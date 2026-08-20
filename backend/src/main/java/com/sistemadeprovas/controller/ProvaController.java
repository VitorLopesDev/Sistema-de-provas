package com.sistemadeprovas.controller;

import com.sistemadeprovas.dto.EnviarRespostasRequest;
import com.sistemadeprovas.dto.ProvaRequest;
import com.sistemadeprovas.dto.ProvaResponse;
import com.sistemadeprovas.entity.Role;
import com.sistemadeprovas.entity.Usuario;
import com.sistemadeprovas.repository.UsuarioRepository;
import com.sistemadeprovas.service.ProvaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
public class ProvaController {

    private final ProvaService provaService;
    private final UsuarioRepository usuarioRepository;

    @PostMapping("/turmas/{turmaId}/provas")
    public ResponseEntity<ProvaResponse> criar(@PathVariable Long turmaId, @Valid @RequestBody ProvaRequest request) {
        return ResponseEntity.ok(provaService.criar(turmaId, request));
    }

    @GetMapping("/turmas/{turmaId}/provas")
    public ResponseEntity<?> listarPorTurma(@PathVariable Long turmaId) {
        return ResponseEntity.ok(provaService.listarPorTurma(turmaId));
    }

    @GetMapping("/provas/minhas")
    public ResponseEntity<?> listarMinhas() {
        Usuario usuario = getUsuarioAutenticado();

        if (usuario.getRole() == Role.PROFESSOR) {
            return ResponseEntity.ok(provaService.listarMinhasProfessor());
        }
        return ResponseEntity.ok(provaService.listarMinhasAluno());
    }

    @GetMapping("/provas/{id}")
    public ResponseEntity<ProvaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(provaService.buscarPorId(id));
    }

    @PutMapping("/provas/{id}")
    public ResponseEntity<ProvaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody ProvaRequest request) {
        return ResponseEntity.ok(provaService.atualizar(id, request));
    }

    @DeleteMapping("/provas/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        provaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/provas/{id}/liberar")
    public ResponseEntity<ProvaResponse> alternarLiberacao(@PathVariable Long id) {
        return ResponseEntity.ok(provaService.alternarLiberacao(id));
    }

    @PostMapping("/provas/{id}/enviar")
    public ResponseEntity<?> enviarRespostas(@PathVariable Long id, @Valid @RequestBody EnviarRespostasRequest request) {
        return ResponseEntity.ok(provaService.enviarRespostas(id, request));
    }

    private Usuario getUsuarioAutenticado() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuário não encontrado"));
    }
}
