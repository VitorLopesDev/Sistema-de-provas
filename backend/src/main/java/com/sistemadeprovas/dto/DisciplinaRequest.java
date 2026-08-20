package com.sistemadeprovas.dto;

import jakarta.validation.constraints.NotBlank;

public record DisciplinaRequest(
        @NotBlank(message = "Nome da disciplina é obrigatório")
        String nome
) {}