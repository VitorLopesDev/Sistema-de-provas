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
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Representa a tentativa de um aluno específico em uma prova específica
// (o que o front chama de "aluno enviado/pendente" dentro de uma prova).
@Entity
@Table(
        name = "tentativas_prova",
        uniqueConstraints = @UniqueConstraint(columnNames = {"prova_id", "aluno_id"})
)
@Getter
@Setter
@NoArgsConstructor
public class TentativaProva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "prova_id", nullable = false)
    private Prova prova;

    @ManyToOne(optional = false)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Usuario aluno;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusTentativa status = StatusTentativa.PENDENTE;

    private LocalDateTime dataInicio;

    private LocalDateTime dataEnvio;

    // Contador simples de eventos suspeitos (ex: troca de aba, saída de tela cheia).
    // Se um dia precisar de log detalhado (tipo + horário de cada alerta), isso vira
    // uma entidade própria (AlertaTentativa) referenciando esta aqui.
    @Column(nullable = false)
    private Integer alertas = 0;

    // Preenchida depois que a prova é corrigida (múltipla escolha pode ser automática,
    // dissertativa precisa de correção manual do professor via pontuacaoObtida em cada resposta).
    private Double nota;

    @OneToMany(mappedBy = "tentativa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RespostaQuestao> respostas = new ArrayList<>();
}
