package com.sistemadeprovas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "turmas")
@Getter
@Setter
@NoArgsConstructor
public class Turma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome; // ex: "P5 — Ciência da Computação"

    // Código que o aluno usa para se matricular na turma (ex: "BD1-2026-P5")
    @Column(nullable = false, unique = true)
    private String codigo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "professor_id", nullable = false)
    private Usuario professor;
}
