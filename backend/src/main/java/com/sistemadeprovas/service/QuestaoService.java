package com.sistemadeprovas.service;

import com.sistemadeprovas.dto.AlternativaRequest;
import com.sistemadeprovas.dto.AlternativaResponse;
import com.sistemadeprovas.dto.QuestaoRequest;
import com.sistemadeprovas.dto.QuestaoResponse;
import com.sistemadeprovas.entity.Alternativa;
import com.sistemadeprovas.entity.Assunto;
import com.sistemadeprovas.entity.Questao;
import com.sistemadeprovas.entity.RespostaQuestao;
import com.sistemadeprovas.entity.Role;
import com.sistemadeprovas.entity.TipoQuestao;
import com.sistemadeprovas.entity.Usuario;
import com.sistemadeprovas.repository.AssuntoRepository;
import com.sistemadeprovas.repository.QuestaoRepository;
import com.sistemadeprovas.repository.RespostaQuestaoRepository;
import com.sistemadeprovas.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestaoService {

    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final QuestaoRepository questaoRepository;
    private final AssuntoRepository assuntoRepository;
    private final RespostaQuestaoRepository respostaQuestaoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public QuestaoResponse criar(QuestaoRequest request) {
        Usuario professor = getUsuarioAutenticado();
        Assunto assunto = buscarAssuntoOuFalhar(request.assuntoId());

        verificarDono(professor, assunto);
        validarAlternativas(request);

        Questao questao = new Questao();
        questao.setAssunto(assunto);
        questao.setEnunciado(request.enunciado());
        questao.setTipo(request.tipo());
        questao.setDificuldade(request.dificuldade());

        aplicarAlternativas(questao, request);

        questaoRepository.save(questao);

        return toResponse(questao);
    }

    public List<QuestaoResponse> listarPorAssunto(Long assuntoId) {
        Usuario professor = getUsuarioAutenticado();
        Assunto assunto = buscarAssuntoOuFalhar(assuntoId);

        verificarDono(professor, assunto);

        return questaoRepository.findByAssuntoId(assuntoId).stream()
                .map(this::toResponse)
                .toList();
    }

    public List<QuestaoResponse> listarPorDisciplina(Long disciplinaId) {
        Usuario professor = getUsuarioAutenticado();

        return questaoRepository.findByAssuntoDisciplinaId(disciplinaId).stream()
                .filter(questao -> questao.getAssunto().getDisciplina().getProfessor().getId().equals(professor.getId()))
                .map(this::toResponse)
                .toList();
    }

    public List<QuestaoResponse> listarMinhas() {
        Usuario professor = getUsuarioAutenticado();

        return questaoRepository.findByAssuntoDisciplinaProfessorId(professor.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public QuestaoResponse buscarPorId(Long id) {
        Usuario professor = getUsuarioAutenticado();
        Questao questao = buscarQuestaoOuFalhar(id);

        verificarDono(professor, questao.getAssunto());

        return toResponse(questao);
    }

    @Transactional
    public QuestaoResponse atualizar(Long id, QuestaoRequest request) {
        Usuario professor = getUsuarioAutenticado();
        Questao questao = buscarQuestaoOuFalhar(id);

        verificarDono(professor, questao.getAssunto());
        validarAlternativas(request);

        Assunto assuntoAlvo = questao.getAssunto();
        if (!request.assuntoId().equals(assuntoAlvo.getId())) {
            assuntoAlvo = buscarAssuntoOuFalhar(request.assuntoId());
            verificarDono(professor, assuntoAlvo);
        }

        questao.setAssunto(assuntoAlvo);
        questao.setEnunciado(request.enunciado());
        questao.setTipo(request.tipo());
        questao.setDificuldade(request.dificuldade());

        questao.getAlternativas().clear();
        aplicarAlternativas(questao, request);

        questaoRepository.save(questao);

        return toResponse(questao);
    }

    @Transactional
    public void deletar(Long id) {
        Usuario professor = getUsuarioAutenticado();
        Questao questao = buscarQuestaoOuFalhar(id);

        verificarDono(professor, questao.getAssunto());

        try {
            questaoRepository.delete(questao);
            questaoRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir esta questão: ela já foi usada em uma prova ou respondida por algum aluno."
            );
        }
    }

    // --- helpers ---

    private void validarAlternativas(QuestaoRequest request) {
        if (request.tipo() != TipoQuestao.MULTIPLA_ESCOLHA) {
            return;
        }

        List<AlternativaRequest> alternativas = request.alternativas();

        if (alternativas == null || alternativas.size() < 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Questões de múltipla escolha precisam de ao menos 2 alternativas");
        }

        long totalCorretas = alternativas.stream().filter(AlternativaRequest::correta).count();

        if (totalCorretas != 1) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Questões de múltipla escolha precisam ter exatamente uma alternativa correta");
        }
    }

    private void aplicarAlternativas(Questao questao, QuestaoRequest request) {
        if (request.tipo() != TipoQuestao.MULTIPLA_ESCOLHA || request.alternativas() == null) {
            return;
        }

        for (AlternativaRequest alternativaRequest : request.alternativas()) {
            Alternativa alternativa = new Alternativa();
            alternativa.setQuestao(questao);
            alternativa.setTexto(alternativaRequest.texto());
            alternativa.setCorreta(alternativaRequest.correta());
            questao.getAlternativas().add(alternativa);
        }
    }

    private Assunto buscarAssuntoOuFalhar(Long id) {
        return assuntoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assunto não encontrado"));
    }

    private Questao buscarQuestaoOuFalhar(Long id) {
        return questaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Questão não encontrada"));
    }

    private void verificarDono(Usuario professor, Assunto assunto) {
        if (!assunto.getDisciplina().getProfessor().getId().equals(professor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a este assunto");
        }
    }

    private QuestaoResponse toResponse(Questao questao) {
        List<AlternativaResponse> alternativas = questao.getAlternativas().stream()
                .map(a -> new AlternativaResponse(a.getId(), a.getTexto(), a.isCorreta()))
                .toList();

        List<RespostaQuestao> respostas = respostaQuestaoRepository.findByQuestaoId(questao.getId());
        int totalRespondentes = respostas.size();

        Double percentualAcerto = null;
        if (questao.getTipo() == TipoQuestao.MULTIPLA_ESCOLHA && totalRespondentes > 0) {
            long totalCorretas = respostas.stream()
                    .filter(r -> r.getAlternativaEscolhida() != null && r.getAlternativaEscolhida().isCorreta())
                    .count();
            percentualAcerto = (totalCorretas * 100.0) / totalRespondentes;
        }

        return new QuestaoResponse(
                questao.getId(),
                questao.getEnunciado(),
                questao.getAssunto().getDisciplina().getId(),
                questao.getAssunto().getDisciplina().getNome(),
                questao.getAssunto().getId(),
                questao.getAssunto().getNome(),
                questao.getTipo(),
                questao.getDificuldade(),
                questao.getDataCriacao().format(FORMATO_DATA),
                alternativas,
                totalRespondentes,
                percentualAcerto
        );
    }

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));

        if (usuario.getRole() != Role.PROFESSOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas professores podem gerenciar questões");
        }

        return usuario;
    }
}