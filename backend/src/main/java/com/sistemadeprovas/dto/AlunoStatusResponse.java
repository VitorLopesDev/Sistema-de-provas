package com.sistemadeprovas.dto;

public record AlunoStatusResponse(
        Long id,
        String nome,
        String status, // "enviado" | "pendente"
        String horarioEnvio, // formato HH:mm, ou null se ainda não enviou
        int alertas
) {}
