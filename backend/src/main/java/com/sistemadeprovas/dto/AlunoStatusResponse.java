package com.sistemadeprovas.dto;

public record AlunoStatusResponse(
        Long id,
        String nome,
        String status,
        String horarioEnvio,
        int alertas
) {}
