package com.sistemadeprovas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TurmaRequest(
        @NotBlank(message = "Nome da turma é obrigatório")
        String nome,

        @NotNull(message = "Disciplina é obrigatória")
        Long disciplinaId,

        @NotBlank(message = "Turno é obrigatório")
        String turno,

        @NotBlank(message = "Nível é obrigatório")
        String nivel
) {}
