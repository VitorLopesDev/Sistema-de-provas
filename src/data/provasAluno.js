// status: "pendente" (ainda não respondida, dentro do prazo)
//         "enviada"  (aluno já respondeu, aguardando o professor liberar para revisão)
//         "liberada" (professor liberou — aluno já pode ver a correção)
export const PROVAS_ALUNO = [
  {
    id: 1,
    titulo: "Banco de Dados I — Prova 2",
    turma: "Ciência da Computação 2026.1",
    dataInicio: "07/07/2025 08:00",
    dataFim: "07/07/2025 09:30",
    status: "liberada",
    nota: 8.5,
    notaMaxima: 10,
    questoes: [
      {
        id: 1,
        pergunta: "O que é uma chave primária em um banco de dados relacional?",
        respostaAluno: "É um campo (ou conjunto de campos) que identifica de forma única cada registro de uma tabela.",
        correta: true,
      },
      {
        id: 2,
        pergunta: "Qual comando SQL é usado para remover uma tabela inteira?",
        respostaAluno: "DELETE TABLE",
        correta: false,
        respostaCorreta: "DROP TABLE",
      },
      {
        id: 3,
        pergunta: "O que significa a sigla ACID em transações de banco de dados?",
        respostaAluno: "Atomicidade, Consistência, Isolamento e Durabilidade.",
        correta: true,
      },
    ],
  },
  {
    id: 2,
    titulo: "Linguagem de Programação II — Prova 2",
    turma: "Ciência da Computação 2026.1",
    dataInicio: "06/07/2025 10:00",
    dataFim: "06/07/2025 11:00",
    status: "enviada",
    questoes: [
      { id: 1, pergunta: "Explique o conceito de herança em POO.", respostaAluno: "É quando uma classe filha reaproveita atributos e métodos de uma classe pai." },
      { id: 2, pergunta: "O que é polimorfismo?", respostaAluno: "É a capacidade de um mesmo método se comportar de formas diferentes." },
    ],
  },
  {
    id: 3,
    titulo: "Estrutura de Dados — Prova 1",
    turma: "Ciência da Computação 2026.1",
    dataInicio: "24/07/2026 06:00",
    dataFim: "24/07/2026 23:59",
    status: "pendente",
    questoes: [
      { id: 1, pergunta: "Qual a diferença entre uma pilha (stack) e uma fila (queue)?", respostaAluno: "" },
      { id: 2, pergunta: "Explique a complexidade de tempo de uma busca binária.", respostaAluno: "" },
    ],
  },
]
