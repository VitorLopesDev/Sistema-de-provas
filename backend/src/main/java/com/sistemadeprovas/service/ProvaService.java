package com.sistemadeprovas.service;

import com.sistemadeprovas.dto.AlternativaResponse;
import com.sistemadeprovas.dto.AlunoProvaResponse;
import com.sistemadeprovas.dto.AlunoStatusResponse;
import com.sistemadeprovas.dto.EnviarRespostasRequest;
import com.sistemadeprovas.dto.ProvaRequest;
import com.sistemadeprovas.dto.ProvaResponse;
import com.sistemadeprovas.dto.QuestaoNaProvaResponse;
import com.sistemadeprovas.dto.QuestaoRespostaAlunoResponse;
import com.sistemadeprovas.entity.Alternativa;
import com.sistemadeprovas.entity.Matricula;
import com.sistemadeprovas.entity.Prova;
import com.sistemadeprovas.entity.ProvaQuestao;
import com.sistemadeprovas.entity.Questao;
import com.sistemadeprovas.entity.RespostaQuestao;
import com.sistemadeprovas.entity.Role;
import com.sistemadeprovas.entity.StatusTentativa;
import com.sistemadeprovas.entity.TentativaProva;
import com.sistemadeprovas.entity.TipoQuestao;
import com.sistemadeprovas.entity.Turma;
import com.sistemadeprovas.entity.Usuario;
import com.sistemadeprovas.repository.MatriculaRepository;
import com.sistemadeprovas.repository.ProvaQuestaoRepository;
import com.sistemadeprovas.repository.ProvaRepository;
import com.sistemadeprovas.repository.QuestaoRepository;
import com.sistemadeprovas.repository.RespostaQuestaoRepository;
import com.sistemadeprovas.repository.TentativaProvaRepository;
import com.sistemadeprovas.repository.TurmaRepository;
import com.sistemadeprovas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProvaService {

    private static final DateTimeFormatter FORMATO_DATA_HORA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
    private static final DateTimeFormatter FORMATO_HORA = DateTimeFormatter.ofPattern("HH:mm");

    private static final double PONTUACAO_TOTAL_PROVA = 10.0;

    private final ProvaRepository provaRepository;
    private final ProvaQuestaoRepository provaQuestaoRepository;
    private final TurmaRepository turmaRepository;
    private final QuestaoRepository questaoRepository;
    private final MatriculaRepository matriculaRepository;
    private final TentativaProvaRepository tentativaProvaRepository;
    private final RespostaQuestaoRepository respostaQuestaoRepository;
    private final UsuarioRepository usuarioRepository;


    @Transactional
    public ProvaResponse criar(Long turmaId, ProvaRequest request) {
        Usuario professor = getUsuarioAutenticado();
        Turma turma = buscarTurmaOuFalhar(turmaId);

        verificarDonoTurma(professor, turma);
        validarDatas(request);
        List<Questao> questoes = validarEBuscarQuestoes(professor, request.questoesIds());

        Prova prova = new Prova();
        prova.setTitulo(request.titulo());
        prova.setInstrucoes(request.instrucoes());
        prova.setTurma(turma);
        prova.setDataInicio(request.dataInicio());
        prova.setDataFim(request.dataFim());
        prova.setTempoLimiteMinutos(request.tempoLimiteMinutos());
        prova.setModoSeguro(request.modoSeguro());

        provaRepository.save(prova);
        salvarQuestoesDaProva(prova, questoes);

        return toResponse(prova);
    }

    public List<ProvaResponse> listarPorTurma(Long turmaId) {
        Usuario usuario = getUsuarioAutenticado();
        Turma turma = buscarTurmaOuFalhar(turmaId);

        verificarAcessoTurma(usuario, turma);

        return provaRepository.findByTurmaId(turmaId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<ProvaResponse> listarMinhasProfessor() {
        Usuario professor = getUsuarioAutenticado();

        return provaRepository.findByTurmaProfessorId(professor.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public ProvaResponse buscarPorId(Long id) {
        Usuario usuario = getUsuarioAutenticado();
        Prova prova = buscarProvaOuFalhar(id);

        verificarAcessoTurma(usuario, prova.getTurma());

        return toResponse(prova);
    }

    @Transactional
    public ProvaResponse atualizar(Long id, ProvaRequest request) {
        Usuario professor = getUsuarioAutenticado();
        Prova prova = buscarProvaOuFalhar(id);

        verificarDonoTurma(professor, prova.getTurma());
        validarDatas(request);
        List<Questao> questoes = validarEBuscarQuestoes(professor, request.questoesIds());

        prova.setTitulo(request.titulo());
        prova.setInstrucoes(request.instrucoes());
        prova.setDataInicio(request.dataInicio());
        prova.setDataFim(request.dataFim());
        prova.setTempoLimiteMinutos(request.tempoLimiteMinutos());
        prova.setModoSeguro(request.modoSeguro());
        provaRepository.save(prova);

        provaQuestaoRepository.deleteAll(provaQuestaoRepository.findByProvaIdOrderByOrdemAsc(prova.getId()));
        salvarQuestoesDaProva(prova, questoes);

        return toResponse(prova);
    }

    @Transactional
    public void deletar(Long id) {
        Usuario professor = getUsuarioAutenticado();
        Prova prova = buscarProvaOuFalhar(id);

        verificarDonoTurma(professor, prova.getTurma());

        try {
            provaQuestaoRepository.deleteAll(provaQuestaoRepository.findByProvaIdOrderByOrdemAsc(prova.getId()));
            provaRepository.delete(prova);
            provaRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir esta prova: já existem tentativas de alunos registradas nela."
            );
        }
    }

    @Transactional
    public ProvaResponse alternarLiberacao(Long id) {
        Usuario professor = getUsuarioAutenticado();
        Prova prova = buscarProvaOuFalhar(id);

        verificarDonoTurma(professor, prova.getTurma());

        prova.setLiberada(!prova.isLiberada());
        provaRepository.save(prova);

        return toResponse(prova);
    }


    public List<AlunoProvaResponse> listarMinhasAluno() {
        Usuario aluno = getUsuarioAutenticado();

        List<Turma> turmas = matriculaRepository.findByAlunoId(aluno.getId()).stream()
                .map(Matricula::getTurma)
                .toList();

        List<AlunoProvaResponse> resultado = new ArrayList<>();
        for (Turma turma : turmas) {
            for (Prova prova : provaRepository.findByTurmaId(turma.getId())) {
                resultado.add(toAlunoResponse(prova, aluno));
            }
        }
        return resultado;
    }

    @Transactional
    public AlunoProvaResponse enviarRespostas(Long provaId, EnviarRespostasRequest request) {
        Usuario aluno = getUsuarioAutenticado();

        if (aluno.getRole() != Role.ALUNO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas alunos podem responder provas");
        }

        Prova prova = buscarProvaOuFalhar(provaId);

        if (!matriculaRepository.existsByAlunoIdAndTurmaId(aluno.getId(), prova.getTurma().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não está matriculado na turma desta prova");
        }

        TentativaProva tentativa = tentativaProvaRepository.findByProvaIdAndAlunoId(provaId, aluno.getId())
                .orElseGet(() -> {
                    TentativaProva nova = new TentativaProva();
                    nova.setProva(prova);
                    nova.setAluno(aluno);
                    nova.setDataInicio(LocalDateTime.now());
                    return nova;
                });

        if (tentativa.getStatus() == StatusTentativa.ENVIADO) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Você já enviou esta prova");
        }

        tentativa.setStatus(StatusTentativa.ENVIADO);
        tentativa.setDataEnvio(LocalDateTime.now());
        tentativaProvaRepository.save(tentativa);

        List<ProvaQuestao> provaQuestoes = provaQuestaoRepository.findByProvaIdOrderByOrdemAsc(provaId);
        double notaAcumulada = 0.0;

        for (ProvaQuestao pq : provaQuestoes) {
            Questao questao = pq.getQuestao();
            String textoResposta = request.respostas().get(questao.getId());

            RespostaQuestao resposta = respostaQuestaoRepository.findByTentativaId(tentativa.getId()).stream()
                    .filter(r -> r.getQuestao().getId().equals(questao.getId()))
                    .findFirst()
                    .orElseGet(RespostaQuestao::new);

            resposta.setTentativa(tentativa);
            resposta.setQuestao(questao);
            resposta.setRespostaTexto(textoResposta);

            if (questao.getTipo() == TipoQuestao.MULTIPLA_ESCOLHA) {
                Alternativa corretaAlt = questao.getAlternativas().stream()
                        .filter(Alternativa::isCorreta)
                        .findFirst()
                        .orElse(null);

                boolean acertou = corretaAlt != null && textoResposta != null
                        && corretaAlt.getTexto().trim().equalsIgnoreCase(textoResposta.trim());

                resposta.setPontuacaoObtida(acertou ? pq.getPontuacao() : 0.0);
                notaAcumulada += resposta.getPontuacaoObtida();
            } else {
                resposta.setPontuacaoObtida(null); // dissertativa aguarda correção manual (ainda não existe essa tela)
            }

            respostaQuestaoRepository.save(resposta);
        }

        tentativa.setNota(notaAcumulada);
        tentativaProvaRepository.save(tentativa);

        return toAlunoResponse(prova, aluno);
    }

    private void validarDatas(ProvaRequest request) {
        if (!request.dataFim().isAfter(request.dataInicio())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A data/hora de término precisa ser depois do início");
        }
    }

    private List<Questao> validarEBuscarQuestoes(Usuario professor, List<Long> questoesIds) {
        if (questoesIds.size() != questoesIds.stream().distinct().count()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A mesma questão não pode aparecer duas vezes na prova");
        }

        List<Questao> questoes = new ArrayList<>();
        for (Long questaoId : questoesIds) {
            Questao questao = questaoRepository.findById(questaoId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Questão " + questaoId + " não encontrada"));

            if (!questao.getAssunto().getDisciplina().getProfessor().getId().equals(professor.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a uma das questões selecionadas");
            }

            questoes.add(questao);
        }

        return questoes;
    }

    private void salvarQuestoesDaProva(Prova prova, List<Questao> questoes) {
        double pontuacaoPorQuestao = PONTUACAO_TOTAL_PROVA / questoes.size();

        for (int i = 0; i < questoes.size(); i++) {
            ProvaQuestao provaQuestao = new ProvaQuestao();
            provaQuestao.setProva(prova);
            provaQuestao.setQuestao(questoes.get(i));
            provaQuestao.setPontuacao(pontuacaoPorQuestao);
            provaQuestao.setOrdem(i + 1);

            provaQuestaoRepository.save(provaQuestao);
        }
    }

    private Turma buscarTurmaOuFalhar(Long id) {
        return turmaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Turma não encontrada"));
    }

    private Prova buscarProvaOuFalhar(Long id) {
        return provaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prova não encontrada"));
    }

    private void verificarDonoTurma(Usuario professor, Turma turma) {
        if (!turma.getProfessor().getId().equals(professor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a esta turma");
        }
    }

    private void verificarAcessoTurma(Usuario usuario, Turma turma) {
        boolean ehDono = turma.getProfessor().getId().equals(usuario.getId());
        boolean estaMatriculado = matriculaRepository.existsByAlunoIdAndTurmaId(usuario.getId(), turma.getId());

        if (!ehDono && !estaMatriculado) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a esta turma");
        }
    }

    private ProvaResponse toResponse(Prova prova) {
        List<Matricula> matriculas = matriculaRepository.findByTurmaId(prova.getTurma().getId());
        List<TentativaProva> tentativas = tentativaProvaRepository.findByProvaId(prova.getId());

        List<AlunoStatusResponse> alunos = matriculas.stream()
                .map(matricula -> {
                    Usuario aluno = matricula.getAluno();
                    TentativaProva tentativa = tentativas.stream()
                            .filter(t -> t.getAluno().getId().equals(aluno.getId()))
                            .findFirst()
                            .orElse(null);

                    boolean enviado = tentativa != null && tentativa.getStatus() == StatusTentativa.ENVIADO;
                    String horarioEnvio = enviado && tentativa.getDataEnvio() != null
                            ? tentativa.getDataEnvio().format(FORMATO_HORA)
                            : null;
                    int alertas = tentativa != null ? tentativa.getAlertas() : 0;

                    return new AlunoStatusResponse(
                            aluno.getId(),
                            aluno.getNome(),
                            enviado ? "enviado" : "pendente",
                            horarioEnvio,
                            alertas
                    );
                })
                .toList();

        List<QuestaoNaProvaResponse> questoes = provaQuestaoRepository.findByProvaIdOrderByOrdemAsc(prova.getId()).stream()
                .map(pq -> new QuestaoNaProvaResponse(
                        pq.getQuestao().getId(),
                        pq.getQuestao().getEnunciado(),
                        pq.getQuestao().getTipo(),
                        pq.getPontuacao(),
                        pq.getOrdem(),
                        pq.getQuestao().getAlternativas().stream()
                                .map(a -> new AlternativaResponse(a.getId(), a.getTexto(), a.isCorreta()))
                                .toList()
                ))
                .toList();

        return new ProvaResponse(
                prova.getId(),
                prova.getTitulo(),
                prova.getInstrucoes(),
                prova.getTurma().getId(),
                prova.getTurma().getNome(),
                prova.getDataInicio().format(FORMATO_DATA_HORA),
                prova.getDataFim().format(FORMATO_DATA_HORA),
                prova.getTempoLimiteMinutos(),
                prova.isModoSeguro(),
                prova.isLiberada(),
                matriculas.size(),
                alunos,
                questoes
        );
    }

    private AlunoProvaResponse toAlunoResponse(Prova prova, Usuario aluno) {
        List<ProvaQuestao> provaQuestoes = provaQuestaoRepository.findByProvaIdOrderByOrdemAsc(prova.getId());
        TentativaProva tentativa = tentativaProvaRepository.findByProvaIdAndAlunoId(prova.getId(), aluno.getId())
                .orElse(null);

        String status;
        if (tentativa == null || tentativa.getStatus() == StatusTentativa.PENDENTE) {
            status = "pendente";
        } else if (prova.isLiberada()) {
            status = "liberada";
        } else {
            status = "enviada";
        }

        List<RespostaQuestao> respostas = tentativa != null
                ? respostaQuestaoRepository.findByTentativaId(tentativa.getId())
                : List.of();

        List<QuestaoRespostaAlunoResponse> questoes = provaQuestoes.stream()
                .map(pq -> {
                    Questao questao = pq.getQuestao();
                    RespostaQuestao resposta = respostas.stream()
                            .filter(r -> r.getQuestao().getId().equals(questao.getId()))
                            .findFirst()
                            .orElse(null);

                    String respostaAlunoTexto = resposta != null ? resposta.getRespostaTexto() : "";

                    Boolean correta = null;
                    String respostaCorretaTexto = null;

                    if (resposta != null && questao.getTipo() == TipoQuestao.MULTIPLA_ESCOLHA) {
                        Alternativa corretaAlt = questao.getAlternativas().stream()
                                .filter(Alternativa::isCorreta)
                                .findFirst()
                                .orElse(null);

                        if (corretaAlt != null) {
                            String respostaNormalizada = respostaAlunoTexto == null ? "" : respostaAlunoTexto.trim();
                            correta = corretaAlt.getTexto().trim().equalsIgnoreCase(respostaNormalizada);
                            if (!correta) {
                                respostaCorretaTexto = corretaAlt.getTexto();
                            }
                        }
                    }

                    return new QuestaoRespostaAlunoResponse(
                            questao.getId(),
                            questao.getEnunciado(),
                            respostaAlunoTexto,
                            correta,
                            respostaCorretaTexto
                    );
                })
                .toList();

        Double nota = tentativa != null ? tentativa.getNota() : null;

        return new AlunoProvaResponse(
                prova.getId(),
                prova.getTitulo(),
                prova.getTurma().getNome(),
                status,
                prova.getDataInicio().format(FORMATO_DATA_HORA),
                prova.getDataFim().format(FORMATO_DATA_HORA),
                nota,
                PONTUACAO_TOTAL_PROVA,
                questoes
        );
    }

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));
    }
}
