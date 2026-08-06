// status: "pendente" (ainda não enviada) ou "enviada" (enviada — consulta liberada na hora, sem precisar o professor liberar)
export const ATIVIDADES_ALUNO = [
  {
    id: 1,
    titulo: "Lista de exercícios — Ponteiros em C",
    turma: "Linguagem de Programação II",
    dataEntrega: "20/07/2026 23:59",
    status: "enviada",
    questoes: [
      { id: 1, pergunta: "O que representa o operador & antes de uma variável?", respostaAluno: "Retorna o endereço de memória da variável." },
      { id: 2, pergunta: "O que acontece ao desreferenciar um ponteiro nulo?", respostaAluno: "O programa gera um erro de segmentação (segfault)." },
    ],
  },
  {
    id: 2,
    titulo: "Exercícios — Modelagem ER",
    turma: "Banco de Dados I",
    dataEntrega: "29/07/2026 23:59",
    status: "pendente",
    questoes: [
      { id: 1, pergunta: "Desenhe o diagrama ER para um sistema de biblioteca.", respostaAluno: "" },
    ],
  },
]
