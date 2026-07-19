const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080"

/**
 * Faz uma requisição para a API e já trata erros de forma padronizada.
 * Lança um Error com a mensagem vinda do backend quando a resposta não é ok.
 */
async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
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
    })
  },

  /**
   * @param {{ nome: string, email: string, senha: string, role: "PROFESSOR" | "ALUNO" }} dados
   */
  register(dados) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify(dados),
    })
  },
}
