const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

/**
 * Faz uma requisição para a API e já trata erros de forma padronizada.
 * Lança um Error com a mensagem vinda do backend quando a resposta não é ok.
 */
async function request(path, options = {}) {
  const { semAuth, ...fetchOptions } = options
  const token = !semAuth && localStorage.getItem("token")

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    // O Spring costuma devolver { message: "..." } ou erros de validação
    const mensagem = data?.message || data?.error || "Erro ao comunicar com o servidor."
    throw new Error(mensagem)
  }

  return data
}

export const authService = {
  /**
   * @param {string} email
   * @param {string} senha
   * @returns {Promise<{ token: string, nome: string, email: string, role: string }>}
   */
  login(email, senha) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
      semAuth: true,
    })
  },

  /**
   * @param {{ nome: string, email: string, senha: string, role: "PROFESSOR" | "ALUNO" }} dados
   */
  register(dados) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(dados),
      semAuth: true,
    })
  },
}

export const turmaService = {
  /**
   * @returns {Promise<Array<{ id, nome, disciplina, turno, nivel, codigo, professorNome, totalAlunos }>>}
   */
  listarMinhas() {
    return request("/turmas/minhas")
  },

  /**
   * @param {{ nome: string, disciplinaId: number, turno: string, nivel: string }} dados
   */
  criar(dados) {
    return request("/turmas", {
      method: "POST",
      body: JSON.stringify(dados),
    })
  },

  buscarPorId(id) {
    return request(`/turmas/${id}`)
  },

  atualizar(id, dados) {
    return request(`/turmas/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    })
  },

  deletar(id) {
    return request(`/turmas/${id}`, {
      method: "DELETE",
    })
  },

  /**
   * @param {string} codigo
   */
  entrar(codigo) {
    return request("/turmas/entrar", {
      method: "POST",
      body: JSON.stringify({ codigo }),
    })
  },

  /**
   * @returns {Promise<{ professor: {id, nome}, alunos: Array<{id, nome}> }>}
   */
  listarPessoas(turmaId) {
    return request(`/turmas/${turmaId}/pessoas`)
  },

  /**
   * Arquiva a turma (ela deixa de aparecer como ativa, mas o histórico é preservado).
   */
  arquivar(id) {
    return request(`/turmas/${id}/arquivar`, {
      method: "PUT",
    })
  },
}

export const disciplinaService = {
  /**
   * @returns {Promise<Array<{ id, nome, assuntos: Array<{id, nome, disciplinaId, totalQuestoes}>, totalQuestoes }>>}
   */
  listarMinhas() {
    return request("/disciplinas/minhas")
  },

  /**
   * @param {{ nome: string }} dados
   */
  criar(dados) {
    return request("/disciplinas", {
      method: "POST",
      body: JSON.stringify(dados),
    })
  },

  atualizar(id, dados) {
    return request(`/disciplinas/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    })
  },

  deletar(id) {
    return request(`/disciplinas/${id}`, {
      method: "DELETE",
    })
  },
}

export const assuntoService = {
  /**
   * @param {{ nome: string }} dados
   */
  criar(disciplinaId, dados) {
    return request(`/disciplinas/${disciplinaId}/assuntos`, {
      method: "POST",
      body: JSON.stringify(dados),
    })
  },

  listarPorDisciplina(disciplinaId) {
    return request(`/disciplinas/${disciplinaId}/assuntos`)
  },

  atualizar(id, dados) {
    return request(`/assuntos/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    })
  },

  deletar(id) {
    return request(`/assuntos/${id}`, {
      method: "DELETE",
    })
  },
}

// O backend guarda dificuldade em maiúsculo (FACIL/MEDIA/DIFICIL); as telas
// do banco de questões usam os ids minúsculos definidos em data/disciplinasSimuladas.js.
// Essas duas tabelas fazem a conversão nos dois sentidos, isolando o resto do
// app dessa diferença.
const DIFICULDADE_PARA_BACKEND = { facil: "FACIL", media: "MEDIA", dificil: "DIFICIL" }
const DIFICULDADE_PARA_FRONTEND = { FACIL: "facil", MEDIA: "media", DIFICIL: "dificil" }

function questaoParaFrontend(questao) {
  return {
    ...questao,
    dificuldade: DIFICULDADE_PARA_FRONTEND[questao.dificuldade] || questao.dificuldade,
  }
}

export const questaoService = {
  /**
   * Todas as questões do professor autenticado, em qualquer disciplina/assunto.
   */
  listarMinhas() {
    return request("/questoes/minhas").then((lista) => lista.map(questaoParaFrontend))
  },

  /**
   * @param {{ assuntoId: number, enunciado: string, dificuldade: "facil"|"media"|"dificil",
   *           alternativas: Array<{texto: string, correta: boolean}> }} dados
   */
  criar(dados) {
    return request("/questoes", {
      method: "POST",
      body: JSON.stringify({
        ...dados,
        tipo: "MULTIPLA_ESCOLHA",
        dificuldade: DIFICULDADE_PARA_BACKEND[dados.dificuldade] || dados.dificuldade,
      }),
    }).then(questaoParaFrontend)
  },

  atualizar(id, dados) {
    return request(`/questoes/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        ...dados,
        tipo: "MULTIPLA_ESCOLHA",
        dificuldade: DIFICULDADE_PARA_BACKEND[dados.dificuldade] || dados.dificuldade,
      }),
    }).then(questaoParaFrontend)
  },

  deletar(id) {
    return request(`/questoes/${id}`, {
      method: "DELETE",
    })
  },
}

export const provaService = {
  /**
   * Provas das turmas em que o aluno autenticado está matriculado.
   * @returns {Promise<Array<{ id, titulo, turma, status, dataInicio, dataFim,
   *           nota, notaMaxima, questoes: Array<{id, pergunta, respostaAluno, correta, respostaCorreta}> }>>}
   */
  listarMinhas() {
    return request("/provas/minhas")
  },

  listarPorTurma(turmaId) {
    return request(`/turmas/${turmaId}/provas`)
  },

  /**
   * @param {{ titulo: string, instrucoes?: string, dataInicio: string, dataFim: string,
   *           tempoLimiteMinutos: number, modoSeguro: boolean, questoesIds: number[] }} dados
   *   dataInicio/dataFim no formato ISO (ex: "2026-08-10T14:00:00").
   */
  criar(turmaId, dados) {
    return request(`/turmas/${turmaId}/provas`, {
      method: "POST",
      body: JSON.stringify(dados),
    })
  },

  buscarPorId(id) {
    return request(`/provas/${id}`)
  },

  atualizar(id, dados) {
    return request(`/provas/${id}`, {
      method: "PUT",
      body: JSON.stringify(dados),
    })
  },

  deletar(id) {
    return request(`/provas/${id}`, {
      method: "DELETE",
    })
  },

  /**
   * Alterna se a prova está liberada para o aluno revisar a correção.
   */
  alternarLiberacao(id) {
    return request(`/provas/${id}/liberar`, {
      method: "PATCH",
    })
  },

  /**
   * @param {Object<number, string>} respostas - { questaoId: textoResposta }
   */
  enviarRespostas(provaId, respostas) {
    return request(`/provas/${provaId}/enviar`, {
      method: "POST",
      body: JSON.stringify({ respostas }),
    })
  },
}