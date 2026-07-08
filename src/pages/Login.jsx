import { useState } from "react"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

// Usuários simulados — depois será substituído pela API do Spring
const USUARIOS_SIMULADOS = [
  { email: "professor@teste.com", senha: "123456", perfil: "PROFESSOR", nome: "Prof. João Silva" },
  { email: "aluno@teste.com",     senha: "123456", perfil: "ALUNO",     nome: "Maria Souza" },
]

function Login({ onLogin }) {
  const [email, setEmail]               = useState("")
  const [senha, setSenha]               = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro]                 = useState("")
  const [carregando, setCarregando]     = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setErro("")
    setCarregando(true)

    // Simula delay de rede
    setTimeout(() => {
      const usuario = USUARIOS_SIMULADOS.find(
        (u) => u.email === email && u.senha === senha
      )
      if (usuario) {
        onLogin(usuario)
      } else {
        setErro("E-mail ou senha incorretos.")
      }
      setCarregando(false)
    }, 800)
  }

  return (
    <div style={s.pagina}>
      <div style={s.card}>

        {/* Logo */}
        <div style={s.logo}>
          <div style={s.logoIcone}>A</div>
          <span style={s.logoTexto}>AvaliaFácil</span>
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
            style={{ ...s.btnEntrar, opacity: carregando ? 0.7 : 1 }}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>

        </form>

        <p style={s.rodape}>
          Ainda não tem uma conta?{" "}
          <span style={s.link}>Cadastre-se</span>
        </p>

      </div>
    </div>
  )
}

const s = {
  pagina: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f2f0ff 0%, #e8e5ff 50%, #ebebf5 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    border: "1px solid rgba(255, 255, 255, 0.8)",
    borderRadius: "20px",
    padding: "40px 36px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 8px 32px rgba(70, 43, 255, 0.08)",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "28px",
    justifyContent: "center",
  },
   logoIcone: {
    width: "36px",
    height: "36px",
    background: "#040220",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "18px",
  },
  logoTexto: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#040220",
  },
  titulo: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#040220",
    margin: "0 0 6px",
  },
  subtitulo: {
    fontSize: "14px",
    color: "#6b698a",
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
    color: "#6b698a",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 40px",
    border: "1.5px solid #e2e0f0",
    borderRadius: "10px",
    fontSize: "14px",
    color: "#040220",
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
    color: "#6b698a",
    display: "flex",
    alignItems: "center",
    padding: "0",
  },
  erro: {
    color: "#dc5a59",
    fontSize: "13px",
    margin: "0",
  },
  btnEntrar: {
    background: "linear-gradient(135deg, #040220 0%, #15123c 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "13px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    marginTop: "4px",
  },
  rodape: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6b698a",
    marginTop: "24px",
    marginBottom: "0",
  },
  link: {
    color: "#462bff",
    fontWeight: "500",
    cursor: "pointer",
  },
}

export default Login