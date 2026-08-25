package com.sistemadeprovas.service;

import com.sistemadeprovas.dto.AssuntoResponse;
import com.sistemadeprovas.dto.DisciplinaRequest;
import com.sistemadeprovas.dto.DisciplinaResponse;
import com.sistemadeprovas.entity.Disciplina;
import com.sistemadeprovas.entity.Role;
import com.sistemadeprovas.entity.Usuario;
import com.sistemadeprovas.repository.AssuntoRepository;
import com.sistemadeprovas.repository.DisciplinaRepository;
import com.sistemadeprovas.repository.QuestaoRepository;
import com.sistemadeprovas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DisciplinaService {

    private final DisciplinaRepository disciplinaRepository;
    private final AssuntoRepository assuntoRepository;
    private final QuestaoRepository questaoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public DisciplinaResponse criar(DisciplinaRequest request) {
        Usuario professor = getUsuarioAutenticado();

        Disciplina disciplina = new Disciplina();
        disciplina.setNome(request.nome());
        disciplina.setProfessor(professor);

        disciplinaRepository.save(disciplina);

        return toResponse(disciplina);
    }

    public List<DisciplinaResponse> listarMinhas() {
        Usuario professor = getUsuarioAutenticado();

        return disciplinaRepository.findByProfessorId(professor.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public DisciplinaResponse buscarPorId(Long id) {
        Usuario professor = getUsuarioAutenticado();
        Disciplina disciplina = buscarOuFalhar(id);

        verificarDono(professor, disciplina);

        return toResponse(disciplina);
    }

    @Transactional
    public DisciplinaResponse atualizar(Long id, DisciplinaRequest request) {
        Usuario professor = getUsuarioAutenticado();
        Disciplina disciplina = buscarOuFalhar(id);

        verificarDono(professor, disciplina);

        disciplina.setNome(request.nome());
        disciplinaRepository.save(disciplina);

        return toResponse(disciplina);
    }

    @Transactional
    public void deletar(Long id) {
        Usuario professor = getUsuarioAutenticado();
        Disciplina disciplina = buscarOuFalhar(id);

        verificarDono(professor, disciplina);

        try {
            disciplinaRepository.delete(disciplina);
            disciplinaRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir esta disciplina: uma ou mais questões dela já foram usadas em provas ou respondidas por alunos."
            );
        }
    }


    private Disciplina buscarOuFalhar(Long id) {
        return disciplinaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrada"));
    }

    private void verificarDono(Usuario professor, Disciplina disciplina) {
        if (!disciplina.getProfessor().getId().equals(professor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a esta disciplina");
        }
    }

    private DisciplinaResponse toResponse(Disciplina disciplina) {
        List<AssuntoResponse> assuntos = assuntoRepository.findByDisciplinaId(disciplina.getId()).stream()
                .map(assunto -> new AssuntoResponse(
                        assunto.getId(),
                        assunto.getNome(),
                        disciplina.getId(),
                        questaoRepository.findByAssuntoId(assunto.getId()).size()
                ))
                .toList();

        int totalQuestoes = questaoRepository.findByAssuntoDisciplinaId(disciplina.getId()).size();

        return new DisciplinaResponse(
                disciplina.getId(),
                disciplina.getNome(),
                assuntos,
                totalQuestoes
        );
    }

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));

        if (usuario.getRole() != Role.PROFESSOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas professores podem gerenciar disciplinas");
        }

        return usuario;
    }
}