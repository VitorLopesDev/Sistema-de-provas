package com.sistemadeprovas.dto;

import com.sistemadeprovas.entity.Dificuldade;
import com.sistemadeprovas.entity.TipoQuestao;

import java.util.List;

public record QuestaoResponse(
        Long id,
        String enunciado,
        Long disciplinaId,
        String disciplina,
        Long assuntoId,
        String assunto,
        TipoQuestao tipo,
        Dificuldade dificuldade,
        String dataPublicacao,
        List<AlternativaResponse> alternativas,
        int totalRespondentes,
        Double percentualAcerto
) {}