package com.sistemadeprovas.dto;

import java.util.List;

public record ProvaResponse(
        Long id,
        String titulo,
        String instrucoes,
        Long turmaId,
        String turma,
        String dataInicio,
        String dataFim,
        Integer tempoLimite,
        boolean modoSeguro,
        boolean liberada,
        int totalAlunos,
        List<AlunoStatusResponse> alunos,
        List<QuestaoNaProvaResponse> questoes
) {}
