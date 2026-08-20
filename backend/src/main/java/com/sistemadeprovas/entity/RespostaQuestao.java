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

// Resposta do aluno para UMA questão dentro de uma tentativa.
// Só um dos dois campos (alternativaEscolhida / respostaTexto) é preenchido,
// dependendo do tipo da questão.
@Entity
@Table(
        name = "respostas_questao",
        uniqueConstraints = @UniqueConstraint(columnNames = {"tentativa_id", "questao_id"})
)
@Getter
@Setter
@NoArgsConstructor
public class RespostaQuestao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "tentativa_id", nullable = false)
    private TentativaProva tentativa;

    @ManyToOne(optional = false)
    @JoinColumn(name = "questao_id", nullable = false)
    private Questao questao;

    // Preenchido quando questao.tipo == MULTIPLA_ESCOLHA
    @ManyToOne
    @JoinColumn(name = "alternativa_id")
    private Alternativa alternativaEscolhida;

    // Preenchido quando questao.tipo == DISSERTATIVA
    @Column(columnDefinition = "TEXT")
    private String respostaTexto;

    // Nota dessa questão específica. Múltipla escolha pode ser calculada automaticamente
    // (comparando com a alternativa correta); dissertativa precisa ser preenchida pelo professor.
    private Double pontuacaoObtida;
}
