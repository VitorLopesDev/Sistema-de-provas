package com.sistemadeprovas.dto;

import com.sistemadeprovas.entity.Dificuldade;
import com.sistemadeprovas.entity.TipoQuestao;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record QuestaoRequest(
        @NotNull(message = "Assunto é obrigatório")
        Long assuntoId,

        @NotBlank(message = "Enunciado é obrigatório")
        String enunciado,

        @NotNull(message = "Tipo da questão é obrigatório")
        TipoQuestao tipo,

        @NotNull(message = "Dificuldade é obrigatória")
        Dificuldade dificuldade,

        @Valid
        List<AlternativaRequest> alternativas
) {}