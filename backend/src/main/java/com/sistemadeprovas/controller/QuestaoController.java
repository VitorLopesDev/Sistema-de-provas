package com.sistemadeprovas.controller;

import com.sistemadeprovas.dto.QuestaoRequest;
import com.sistemadeprovas.dto.QuestaoResponse;
import com.sistemadeprovas.service.QuestaoService;
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
public class QuestaoController {

    private final QuestaoService questaoService;

    @PostMapping("/questoes")
    public ResponseEntity<QuestaoResponse> criar(@Valid @RequestBody QuestaoRequest request) {
        return ResponseEntity.ok(questaoService.criar(request));
    }

    @GetMapping("/questoes/minhas")
    public ResponseEntity<List<QuestaoResponse>> listarMinhas() {
        return ResponseEntity.ok(questaoService.listarMinhas());
    }

    @GetMapping("/questoes/{id}")
    public ResponseEntity<QuestaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(questaoService.buscarPorId(id));
    }

    @PutMapping("/questoes/{id}")
    public ResponseEntity<QuestaoResponse> atualizar(@PathVariable Long id, @Valid @RequestBody QuestaoRequest request) {
        return ResponseEntity.ok(questaoService.atualizar(id, request));
    }

    @DeleteMapping("/questoes/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        questaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assuntos/{assuntoId}/questoes")
    public ResponseEntity<List<QuestaoResponse>> listarPorAssunto(@PathVariable Long assuntoId) {
        return ResponseEntity.ok(questaoService.listarPorAssunto(assuntoId));
    }

    @GetMapping("/disciplinas/{disciplinaId}/questoes")
    public ResponseEntity<List<QuestaoResponse>> listarPorDisciplina(@PathVariable Long disciplinaId) {
        return ResponseEntity.ok(questaoService.listarPorDisciplina(disciplinaId));
    }
}