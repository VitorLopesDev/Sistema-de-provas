package com.sistemadeprovas.dto;

public record AlternativaResponse(
        Long id,
        String texto,
        boolean correta
) {}