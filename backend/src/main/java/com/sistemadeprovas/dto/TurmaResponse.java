package com.sistemadeprovas.dto;

public record TurmaResponse(
        Long id,
        String nome,
        Long disciplinaId,
        String disciplina,
        String turno,
        String nivel,
        String codigo,
        String professorNome,
        int totalAlunos,
        boolean arquivada
) {}
