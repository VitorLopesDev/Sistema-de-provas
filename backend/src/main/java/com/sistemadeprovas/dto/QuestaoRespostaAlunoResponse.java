package com.sistemadeprovas.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record QuestaoRespostaAlunoResponse(
        Long id,
        String pergunta,
        String respostaAluno,
        Boolean correta,        // null (omitido do JSON) quando ainda não é possível determinar
        String respostaCorreta  // só populado quando correta == false
) {}
