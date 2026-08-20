package com.sistemadeprovas.dto;

import java.util.List;

public record DisciplinaResponse(
        Long id,
        String nome,
        List<AssuntoResponse> assuntos,
        int totalQuestoes
) {}