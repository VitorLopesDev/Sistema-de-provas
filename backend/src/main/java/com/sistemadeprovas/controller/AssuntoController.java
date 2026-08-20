package com.sistemadeprovas.controller;

import com.sistemadeprovas.dto.AssuntoRequest;
import com.sistemadeprovas.dto.AssuntoResponse;
import com.sistemadeprovas.service.AssuntoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AssuntoController {

    private final AssuntoService assuntoService;

    @PostMapping("/disciplinas/{disciplinaId}/assuntos")
    public ResponseEntity<AssuntoResponse> criar(@PathVariable Long disciplinaId, @Valid @RequestBody AssuntoRequest request) {
        return ResponseEntity.ok(assuntoService.criar(disciplinaId, request));
    }

    @GetMapping("/disciplinas/{disciplinaId}/assuntos")
    public ResponseEntity<List<AssuntoResponse>> listarPorDisciplina(@PathVariable Long disciplinaId) {
        return ResponseEntity.ok(assuntoService.listarPorDisciplina(disciplinaId));
    }

    @PutMapping("/assuntos/{id}")
    public ResponseEntity<AssuntoResponse> atualizar(@PathVariable Long id, @Valid @RequestBody AssuntoRequest request) {
        return ResponseEntity.ok(assuntoService.atualizar(id, request));
    }

    @DeleteMapping("/assuntos/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        assuntoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}