package com.sistemadeprovas.dto;

import jakarta.validation.constraints.NotBlank;

public record TurmaRequest(
        @NotBlank(message = "Nome da turma é obrigatório")
        String nome,

        @NotBlank(message = "Disciplina é obrigatória")
        String disciplina,

        @NotBlank(message = "Turno é obrigatório")
        String turno,

        @NotBlank(message = "Nível é obrigatório")
        String nivel
) {}