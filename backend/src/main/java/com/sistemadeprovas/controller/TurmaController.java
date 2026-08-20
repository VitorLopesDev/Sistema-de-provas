package com.sistemadeprovas.controller;

import com.sistemadeprovas.dto.EntrarTurmaRequest;
import com.sistemadeprovas.dto.PessoasTurmaResponse;
import com.sistemadeprovas.dto.TurmaRequest;
import com.sistemadeprovas.dto.TurmaResponse;
import com.sistemadeprovas.service.TurmaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/turmas")
@RequiredArgsConstructor
public class TurmaController {

    private final TurmaService turmaService;

    @PostMapping
    public ResponseEntity<TurmaResponse> criar(@Valid @RequestBody TurmaRequest request) {
        return ResponseEntity.ok(turmaService.criar(request));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<TurmaResponse>> listarMinhas() {
        return ResponseEntity.ok(turmaService.listarMinhas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurmaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurmaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody TurmaRequest request) {
        return ResponseEntity.ok(turmaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        turmaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/arquivar")
    public ResponseEntity<TurmaResponse> arquivar(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.arquivar(id));
    }

    @GetMapping("/{id}/pessoas")
    public ResponseEntity<PessoasTurmaResponse> listarPessoas(@PathVariable Long id) {
        return ResponseEntity.ok(turmaService.listarPessoas(id));
    }

    @PostMapping("/entrar")
    public ResponseEntity<TurmaResponse> entrar(@Valid @RequestBody EntrarTurmaRequest request) {
        return ResponseEntity.ok(turmaService.entrar(request));
    }
}