package com.sistemadeprovas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;
import java.util.List;

public record ProvaRequest(
        @NotBlank(message = "Título é obrigatório")
        String titulo,

        String instrucoes,

        @NotNull(message = "Data/hora de início é obrigatória")
        LocalDateTime dataInicio,

        @NotNull(message = "Data/hora de término é obrigatória")
        LocalDateTime dataFim,

        @NotNull(message = "Tempo limite é obrigatório")
        @Positive(message = "Tempo limite precisa ser maior que zero")
        Integer tempoLimiteMinutos,

        boolean modoSeguro,

        @NotEmpty(message = "A prova precisa ter ao menos uma questão")
        List<Long> questoesIds
) {}
