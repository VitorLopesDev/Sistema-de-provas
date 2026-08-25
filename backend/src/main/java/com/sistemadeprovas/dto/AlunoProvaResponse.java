package com.sistemadeprovas.dto;

import java.util.List;

public record AlunoProvaResponse(
        Long id,
        String titulo,
        String turma,
        String status,
        String dataInicio,
        String dataFim,
        Double nota,
        Double notaMaxima,
        List<QuestaoRespostaAlunoResponse> questoes
) {}
