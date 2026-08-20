package com.sistemadeprovas.dto;

import java.util.List;

public record ProvaResponse(
        Long id,
        String titulo,
        String instrucoes,
        Long turmaId,
        String turma,
        String dataInicio, // formato dd/MM/yyyy HH:mm
        String dataFim,    // formato dd/MM/yyyy HH:mm
        Integer tempoLimite, // minutos
        boolean modoSeguro,
        boolean liberada,
        int totalAlunos,
        List<AlunoStatusResponse> alunos,
        List<QuestaoNaProvaResponse> questoes
) {}
