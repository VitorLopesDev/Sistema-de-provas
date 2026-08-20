package com.sistemadeprovas.service;

import com.sistemadeprovas.dto.AssuntoRequest;
import com.sistemadeprovas.dto.AssuntoResponse;
import com.sistemadeprovas.entity.Assunto;
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
public class AssuntoService {

    private final AssuntoRepository assuntoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final QuestaoRepository questaoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public AssuntoResponse criar(Long disciplinaId, AssuntoRequest request) {
        Usuario professor = getUsuarioAutenticado();
        Disciplina disciplina = buscarDisciplinaOuFalhar(disciplinaId);

        verificarDono(professor, disciplina);

        Assunto assunto = new Assunto();
        assunto.setNome(request.nome());
        assunto.setDisciplina(disciplina);

        assuntoRepository.save(assunto);

        return toResponse(assunto);
    }

    public List<AssuntoResponse> listarPorDisciplina(Long disciplinaId) {
        Usuario professor = getUsuarioAutenticado();
        Disciplina disciplina = buscarDisciplinaOuFalhar(disciplinaId);

        verificarDono(professor, disciplina);

        return assuntoRepository.findByDisciplinaId(disciplinaId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public AssuntoResponse atualizar(Long id, AssuntoRequest request) {
        Usuario professor = getUsuarioAutenticado();
        Assunto assunto = buscarAssuntoOuFalhar(id);

        verificarDono(professor, assunto.getDisciplina());

        assunto.setNome(request.nome());
        assuntoRepository.save(assunto);

        return toResponse(assunto);
    }

    @Transactional
    public void deletar(Long id) {
        Usuario professor = getUsuarioAutenticado();
        Assunto assunto = buscarAssuntoOuFalhar(id);

        verificarDono(professor, assunto.getDisciplina());

        try {
            assuntoRepository.delete(assunto);
            assuntoRepository.flush();
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Não é possível excluir este assunto: uma ou mais questões dele já foram usadas em provas ou respondidas por alunos."
            );
        }
    }

    // --- helpers ---

    private Disciplina buscarDisciplinaOuFalhar(Long id) {
        return disciplinaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrada"));
    }

    private Assunto buscarAssuntoOuFalhar(Long id) {
        return assuntoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assunto não encontrado"));
    }

    private void verificarDono(Usuario professor, Disciplina disciplina) {
        if (!disciplina.getProfessor().getId().equals(professor.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem acesso a esta disciplina");
        }
    }

    private AssuntoResponse toResponse(Assunto assunto) {
        int totalQuestoes = questaoRepository.findByAssuntoId(assunto.getId()).size();

        return new AssuntoResponse(
                assunto.getId(),
                assunto.getNome(),
                assunto.getDisciplina().getId(),
                totalQuestoes
        );
    }

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));

        if (usuario.getRole() != Role.PROFESSOR) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Apenas professores podem gerenciar assuntos");
        }

        return usuario;
    }
}