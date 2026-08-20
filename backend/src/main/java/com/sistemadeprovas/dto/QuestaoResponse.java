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
        String dataPublicacao, // formato dd/MM/yyyy
        List<AlternativaResponse> alternativas,
        int totalRespondentes,
        // null quando ainda não há respostas, ou quando o tipo é DISSERTATIVA
        // (correção manual, não dá pra calcular "acerto" automaticamente)
        Double percentualAcerto
) {}