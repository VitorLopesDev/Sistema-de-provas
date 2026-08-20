package com.sistemadeprovas.dto;

import java.util.List;

public record AlunoProvaResponse(
        Long id,
        String titulo,
        String turma,
        String status, // "pendente" | "enviada" | "liberada"
        String dataInicio, // formato dd/MM/yyyy HH:mm
        String dataFim,    // formato dd/MM/yyyy HH:mm
        Double nota,
        Double notaMaxima,
        List<QuestaoRespostaAlunoResponse> questoes
) {}
