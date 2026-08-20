package com.sistemadeprovas.controller;

import com.sistemadeprovas.dto.DisciplinaRequest;
import com.sistemadeprovas.dto.DisciplinaResponse;
import com.sistemadeprovas.service.DisciplinaService;
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
@RequestMapping("/disciplinas")
@RequiredArgsConstructor
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    @PostMapping
    public ResponseEntity<DisciplinaResponse> criar(@Valid @RequestBody DisciplinaRequest request) {
        return ResponseEntity.ok(disciplinaService.criar(request));
    }

    @GetMapping("/minhas")
    public ResponseEntity<List<DisciplinaResponse>> listarMinhas() {
        return ResponseEntity.ok(disciplinaService.listarMinhas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DisciplinaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(disciplinaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DisciplinaResponse> atualizar(@PathVariable Long id, @Valid @RequestBody DisciplinaRequest request) {
        return ResponseEntity.ok(disciplinaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        disciplinaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}