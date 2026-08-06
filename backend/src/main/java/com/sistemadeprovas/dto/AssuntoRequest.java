package com.sistemadeprovas.dto;

import jakarta.validation.constraints.NotBlank;

public record AssuntoRequest(
        @NotBlank(message = "Nome do assunto é obrigatório")
        String nome
) {}