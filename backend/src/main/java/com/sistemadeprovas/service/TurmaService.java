package com.sistemadeprovas.service;

import com.sistemadeprovas.dto.EntrarTurmaRequest;
import com.sistemadeprovas.dto.PessoaResponse;
import com.sistemadeprovas.dto.PessoasTurmaResponse;
import com.sistemadeprovas.dto.TurmaRequest;
import com.sistemadeprovas.dto.TurmaResponse;
import com.sistemadeprovas.entity.Disciplina;
import com.sistemadeprovas.entity.Matricula;
import com.sistemadeprovas.entity.Role;
import com.sistemadeprovas.entity.Turma;
import com.sistemadeprovas.entity.Usuario;
import com.sistemadeprovas.repository.DisciplinaRepository;
import com.sistemadeprovas.repository.MatriculaRepository;
import com.sistemadeprovas.repository.TurmaRepository;
import com.sistemadeprovas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TurmaService {

    private final TurmaRepository turmaRepository;
    private final MatriculaRepository matriculaRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public TurmaResponse criar(TurmaRequest request) {
        Usuario usuario = getUsuarioAutenticado();

        if (usuario.getRole() != Role.PROFESSOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas professores podem criar turmas");
        }

        Disciplina disciplina = buscarDisciplinaDoProfessor(usuario, request.disciplinaId());

        Turma turma = new Turma();
        turma.setNome(request.nome());
        turma.setDisciplina(disciplina);
        turma.setTurno(request.turno());
        turma.setNivel(request.nivel());
        turma.setCodigo(gerarCodigoUnico());
        turma.setProfessor(usuario);

        turmaRepository.save(turma);

        return toResponse(turma);
    }

    public List<TurmaResponse> listarMinhas() {
        Usuario usuario = getUsuarioAutenticado();

        List<Turma> turmas = usuario.getRole() == Role.PROFESSOR
                ? turmaRepository.findByProfessorId(usuario.getId())
                : matriculaRepository.findByAlunoId(usuario.getId()).stream()
                .map(Matricula::getTurma)
                .toList();

        return turmas.stream().map(this::toResponse).toList();
    }

    public TurmaResponse buscarPorId(Long id) {
        Usuario usuario = getUsuarioAutenticado();
        Turma turma = buscarTurmaOuFalhar(id);

        verificarAcesso(usuario, turma);

        return toResponse(turma);
    }

    @Transactional
    public TurmaResponse atualizar(Long id, TurmaRequest request) {
        Usuario usuario = getUsuarioAutenticado();
        Turma turma = buscarTurmaOuFalhar(id);

        verificarDono(usuario, turma);

        Disciplina disciplina = buscarDisciplinaDoProfessor(usuario, request.disciplinaId());

        turma.setNome(request.nome());
        turma.setDisciplina(disciplina);
        turma.setTurno(request.turno());
        turma.setNivel(request.nivel());
        turmaRepository.save(turma);

        return toResponse(turma);
    }

    @Transactional
    public void deletar(Long id) {
        Usuario usuario = getUsuarioAutenticado();
        Turma turma = buscarTurmaOuFalhar(id);

        verificarDono(usuario, turma);

        turmaRepository.delete(turma);
    }

    @Transactional
    public TurmaResponse arquivar(Long id) {
        Usuario usuario = getUsuarioAutenticado();
        Turma turma = buscarTurmaOuFalhar(id);

        verificarDono(usuario, turma);

        turma.setArquivada(!turma.isArquivada());
        turmaRepository.save(turma);

        return toResponse(turma);
    }

    public PessoasTurmaResponse listarPessoas(Long id) {
        Usuario usuario = getUsuarioAutenticado();
        Turma turma = buscarTurmaOuFalhar(id);

        verificarAcesso(usuario, turma);

        PessoaResponse professor = new PessoaResponse(turma.getProfessor().getId(), turma.getProfessor().getNome());

        List<PessoaResponse> alunos = matriculaRepository.findByTurmaId(turma.getId()).stream()
                .map(m -> new PessoaResponse(m.getAluno().getId(), m.getAluno().getNome()))
                .toList();

        return new PessoasTurmaResponse(professor, alunos);
    }

    @Transactional
    public TurmaResponse entrar(EntrarTurmaRequest request) {
        Usuario usuario = getUsuarioAutenticado();

        if (usuario.getRole() != Role.ALUNO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas alunos podem entrar em turmas");
        }

        String codigo = request.codigo().trim().toUpperCase(Locale.ROOT);
        Turma turma = turmaRepository.findByCodigo(codigo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Código de turma inválido"));

        if (turma.isArquivada()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Não é possível entrar em uma turma arquivada");
        }

        if (matriculaRepository.existsByAlunoIdAndTurmaId(usuario.getId(), turma.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Você já está matriculado nesta turma");
        }

        Matricula matricula = new Matricula();
        matricula.setAluno(usuario);
        matricula.setTurma(turma);
        matriculaRepository.save(matricula);

        return toResponse(turma);
    }


    private Turma buscarTurmaOuFalhar(Long id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));
    }

    private Disciplina buscarDisciplinaDoProfessor(Usuario professor, Long disciplinaId) {
        Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrada"));

        if (!disciplina.getProfessor().getId().equals(professor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a esta disciplina");
        }

        return disciplina;
    }

    private void verificarDono(Usuario usuario, Turma turma) {
        if (!turma.getProfessor().getId().equals(usuario.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas o professor dono da turma pode realizar esta ação");
        }
    }

    private void verificarAcesso(Usuario usuario, Turma turma) {
        boolean ehDono = turma.getProfessor().getId().equals(usuario.getId());
        boolean estaMatriculado = matriculaRepository.existsByAlunoIdAndTurmaId(usuario.getId(), turma.getId());

        if (!ehDono && !estaMatriculado) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a esta turma");
        }
    }

    private String gerarCodigoUnico() {
        String codigo;
        do {
            codigo = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        } while (turmaRepository.findByCodigo(codigo).isPresent());
        return codigo;
    }

    private TurmaResponse toResponse(Turma turma) {
        int totalAlunos = matriculaRepository.findByTurmaId(turma.getId()).size();
        return new TurmaResponse(
                turma.getId(),
                turma.getNome(),
                turma.getDisciplina().getId(),
                turma.getDisciplina().getNome(),
                turma.getTurno(),
                turma.getNivel(),
                turma.getCodigo(),
                turma.getProfessor().getNome(),
                totalAlunos,
                turma.isArquivada()
        );
    }

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));
    }
}
