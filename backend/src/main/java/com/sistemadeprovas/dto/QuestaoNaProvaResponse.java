package com.sistemadeprovas.dto;

import com.sistemadeprovas.entity.TipoQuestao;

import java.util.List;

public record QuestaoNaProvaResponse(
        Long questaoId,
        String enunciado,
        TipoQuestao tipo,
        Double pontuacao,
        Integer ordem,
        List<AlternativaResponse> alternativas
) {}
