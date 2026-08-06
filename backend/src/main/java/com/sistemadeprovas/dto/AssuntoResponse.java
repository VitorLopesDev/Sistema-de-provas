package com.sistemadeprovas.dto;

public record AssuntoResponse(
        Long id,
        String nome,
        Long disciplinaId,
        int totalQuestoes
) {}