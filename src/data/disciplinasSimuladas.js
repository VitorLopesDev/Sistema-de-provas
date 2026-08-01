export const DISCIPLINAS_SIMULADAS = [
  {
    id: 1,
    nome: "Linguagem de Programação II",
    assuntos: [
      { id: 1, nome: "Ponteiros" },
      { id: 2, nome: "Recursão" },
      { id: 3, nome: "Structs" },
    ],
  },
  {
    id: 2,
    nome: "Banco de Dados I",
    assuntos: [
      { id: 4, nome: "Modelagem ER" },
      { id: 5, nome: "Normalização" },
      { id: 6, nome: "SQL" },
    ],
  },
]

export const DIFICULDADES = [
  { id: "facil", label: "Fácil", cor: "#1a9c5c", bg: "rgba(26,156,92,0.1)" },
  { id: "media", label: "Média", cor: "#b8860b", bg: "rgba(184,134,11,0.1)" },
  { id: "dificil", label: "Difícil", cor: "var(--nexos-error)", bg: "rgba(178,58,58,0.1)" },
]
