package com.sistemadeprovas.dto;

import java.util.List;

public record PessoasTurmaResponse(
        PessoaResponse professor,
        List<PessoaResponse> alunos
) {}
