import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { authService } from "../services/api"
import Logo from "../components/Logo"

function Login({ onLogin, onIrParaCadastro }) {
  const [email, setEmail]               = useState("")
  const [senha, setSenha]               = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro]                 = useState("")
  const [carregando, setCarregando]     = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro("")
    setCarregando(true)

    try {
      const resposta = await authService.login(email, senha)

      localStorage.setItem("token", resposta.token)

      onLogin({
        nome: resposta.nome,
        email: resposta.email,
        perfil: resposta.role,
      })
    } catch (err) {
      setErro(err.message || "E-mail ou senha incorretos.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={s.pagina}>
      <div style={s.card}>

        {/* Logo */}
        <div style={s.logo}>
          <Logo height={30} />
        </div>

        <h1 style={s.titulo}>Login</h1>
        <p style={s.subtitulo}>Bem-vindo de volta! Faça login para continuar.</p>

        <form onSubmit={handleSubmit} style={s.form}>

          {/* E-mail */}
          <div style={s.campoWrapper}>
            <Mail size={16} style={s.icone} />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={s.input}
              required
            />
          </div>

          {/* Senha */}
          <div style={s.campoWrapper}>
            <Lock size={16} style={s.icone} />
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={{ ...s.input, paddingRight: "42px" }}
              required
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              style={s.btnOlho}
            >
              {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Mensagem de erro */}
          {erro && <p style={s.erro}>{erro}</p>}

          {/* Botão entrar */}
          <button
            type="submit"
            disabled={carregando}
            className="nexos-btn"
            style={{ ...s.btnEntrar, opacity: carregando ? 0.7 : 1 }}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

        </form>

        <p style={s.rodape}>
          Ainda não tem uma conta?{" "}
          <span style={s.link} className="nexos-link" onClick={onIrParaCadastro}>Cadastre-se</span>
        </p>

      </div>
    </div>
  )
}

const s = {
  pagina: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, var(--nexos-bg) 0%, var(--nexos-bg-alt) 50%, var(--nexos-border) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.65)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    borderRadius: "20px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 8px 32px rgba(16, 94, 220, 0.10)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
    justifyContent: "center",
  },
  titulo: {
    fontSize: "24px",
    fontWeight: "700",
    color: "var(--nexos-navy)",
    margin: "0 0 6px",
  },
  subtitulo: {
    fontSize: "14px",
    color: "var(--nexos-gray)",
    margin: "0 0 28px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  campoWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icone: {
    position: "absolute",
    left: "14px",
    color: "var(--nexos-gray)",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 40px",
    border: "1.5px solid var(--nexos-border)",
    borderRadius: "10px",
    fontSize: "14px",
    color: "var(--nexos-navy)",
    background: "rgba(255,255,255,0.7)",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  btnOlho: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "var(--nexos-gray)",
    display: "flex",
    alignItems: "center",
    padding: "0",
  },
  erro: {
    color: "var(--nexos-error)",
    fontSize: "13px",
    margin: "0",
  },
  btnEntrar: {
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
    fontFamily: "inherit",
    boxShadow: "0 8px 22px rgba(16, 94, 220, 0.28)",
  },
  rodape: {
    textAlign: "center",
    fontSize: "13px",
    color: "var(--nexos-gray)",
    marginTop: "24px",
    marginBottom: "0",
  },
  link: {
    color: "var(--nexos-blue)",
    fontWeight: "500",
    cursor: "pointer",
  },
}

export default Login