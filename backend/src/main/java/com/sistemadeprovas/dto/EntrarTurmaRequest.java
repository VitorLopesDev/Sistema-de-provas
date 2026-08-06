package com.sistemadeprovas.dto;

import jakarta.validation.constraints.NotBlank;

public record EntrarTurmaRequest(
        @NotBlank(message = "Código da turma é obrigatório")
        String codigo
) {}