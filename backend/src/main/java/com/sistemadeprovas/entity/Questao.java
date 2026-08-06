package com.sistemadeprovas.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Questão vive no banco reutilizável do professor, vinculada a um assunto
// dentro de uma disciplina. Não pertence a nenhuma prova específica — o
// vínculo entre questão e prova (com peso e ordem próprios daquele uso)
// é feito pela entidade ProvaQuestao.
@Entity
@Table(name = "questoes")
@Getter
@Setter
@NoArgsConstructor
public class Questao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "assunto_id", nullable = false)
    private Assunto assunto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String enunciado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoQuestao tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Dificuldade dificuldade;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao;

    // Só é preenchida quando tipo = MULTIPLA_ESCOLHA
    @OneToMany(mappedBy = "questao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Alternativa> alternativas = new ArrayList<>();

    @PrePersist
    protected void aoCriar() {
        dataCriacao = LocalDateTime.now();
    }
}