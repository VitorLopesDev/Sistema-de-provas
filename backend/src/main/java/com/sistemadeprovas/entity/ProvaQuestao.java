package com.sistemadeprovas.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Vincula uma questão do banco a uma prova específica. A mesma questão pode
// ser usada em várias provas, cada uma com seu próprio peso e ordem.
@Entity
@Table(
        name = "prova_questoes",
        uniqueConstraints = @UniqueConstraint(columnNames = {"prova_id", "questao_id"})
)
@Getter
@Setter
@NoArgsConstructor
public class ProvaQuestao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "prova_id", nullable = false)
    private Prova prova;

    @ManyToOne(optional = false)
    @JoinColumn(name = "questao_id", nullable = false)
    private Questao questao;

    // Peso desta questão nesta prova (a mesma questão pode valer pontuações
    // diferentes em provas diferentes)
    @Column(nullable = false)
    private Double pontuacao;

    // Posição da questão dentro desta prova (1, 2, 3...)
    @Column(nullable = false)
    private Integer ordem;
}