package com.sistemadeprovas.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record EnviarRespostasRequest(
        @NotNull(message = "Respostas são obrigatórias")
        Map<Long, String> respostas
) {}
