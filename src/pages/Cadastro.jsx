import { useState } from "react";
import { UserRound, Mail, Eye, EyeOff, Lock } from "lucide-react";
import { authService } from "../services/api";

function Cadastro({ onCadastro, onIrParaLogin }) {
  const [nome, setNome]                                   = useState("")
  const [email, setEmail]                                 = useState("")
  const [senha, setSenha]                                 = useState("")
  const [confirmarSenha, setConfirmarSenha]                = useState("")
  const [perfil, setPerfil]                                = useState("ALUNO")
  const [mostrarSenha, setMostrarSenha]                     = useState(false)
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha]   = useState(false)
  const [aceitouTermos, setAceitouTermos]                   = useState(false)
  const [erro, setErro]                                     = useState("")
  const [carregando, setCarregando]                         = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErro("")

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.")
      return
    }

    if (!aceitouTermos) {
      setErro("Você precisa aceitar os Termos de Uso para continuar.")
      return
    }

    setCarregando(true)

    try {
      const resposta = await authService.register({
        nome,
        email,
        senha,
        role: perfil,
      })

      localStorage.setItem("token", resposta.token)

      onCadastro({
        nome: resposta.nome,
        email: resposta.email,
        perfil: resposta.role,
      })
    } catch (err) {
      setErro(err.message || "Não foi possível criar a conta.")
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={s.pagina}>
      <div style={s.card}>

        <div style={s.logo}>
          <div style={s.logoIcone}>A</div>
          <span style={s.logoTexto}>AvaliaFácil</span>
        </div>

        <h1 style={s.titulo}>Criar conta</h1>
        <p style={s.subtitulo}>Preencha os dados abaixo para se cadastrar.</p>

        <form onSubmit={handleSubmit} style={s.form}>

          {/* Nome */}
          <div style={s.campo}>
            <label style={s.label}>Nome completo</label>
            <div style={s.campoWrapper}>
              <UserRound size={16} style={s.icone} />
              <input
                type="text"
                placeholder="Digite seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={s.input}
                required
              />
            </div>
          </div>

          {/* E-mail */}
          <div style={s.campo}>
            <label style={s.label}>E-mail</label>
            <div style={s.campoWrapper}>
              <Mail size={16} style={s.icone} />
              <input
                type="email"
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={s.input}
                required
              />
            </div>
          </div>

          {/* Perfil */}
          <div style={s.campo}>
            <label style={s.label}>Perfil</label>
            <p style={s.perfilAjuda}>Escolha como você vai usar a plataforma</p>
            <div style={s.perfilWrapper}>
              <button
                type="button"
                onClick={() => setPerfil("ALUNO")}
                style={{ ...s.btnPerfil, ...(perfil === "ALUNO" ? s.btnPerfilAtivo : {}) }}
              >
                Aluno
              </button>
              <button
                type="button"
                onClick={() => setPerfil("PROFESSOR")}
                style={{ ...s.btnPerfil, ...(perfil === "PROFESSOR" ? s.btnPerfilAtivo : {}) }}
              >
                Professor
              </button>
            </div>
          </div>

          {/* Senha */}
          <div style={s.campo}>
            <label style={s.label}>Senha</label>
            <div style={s.campoWrapper}>
              <Lock size={16} style={s.icone} />
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Crie uma senha"
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
          </div>

          {/* Confirmar senha */}
          <div style={s.campo}>
            <label style={s.label}>Confirmar senha</label>
            <div style={s.campoWrapper}>
              <Lock size={16} style={s.icone} />
              <input
                type={mostrarConfirmarSenha ? "text" : "password"}
                placeholder="Digite sua senha novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                style={{ ...s.input, paddingRight: "42px" }}
                required
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
                style={s.btnOlho}
              >
                {mostrarConfirmarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Termos */}
          <label style={s.termosWrapper}>
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
              style={s.checkbox}
            />
            <span style={s.termosTexto}>
              Li e aceito os Termos de Uso e Política de Privacidade.
            </span>
          </label>

          {erro && <p style={s.erro}>{erro}</p>}

          <button
            type="submit"
            disabled={carregando}
            style={{ ...s.btnEntrar, opacity: carregando ? 0.7 : 1 }}
          >
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </button>

        </form>

        <p style={s.rodape}>
          Já tem uma conta?{" "}
          <span style={s.link} onClick={onIrParaLogin}>Fazer login</span>
        </p>

      </div>
    </div>
  )
}

const s = {
  pagina: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #F7F6F2 0%, #EDEBE3 50%, #E4E2D9 100%)",
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
  padding: "32px 36px",
  width: "100%",
  maxWidth: "420px",
  boxShadow: "0 8px 32px rgba(31, 92, 107, 0.10)",
  },
  logo: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "20px",
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
  fontSize: "13px",
  color: "#5F5E5A",
  margin: "0 0 18px",
  },
  form: {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  },
  campo: {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#040220",
  },
  campoWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  icone: {
    position: "absolute",
    left: "14px",
    color: "#5F5E5A",
    pointerEvents: "none",
  },
  input: {
  width: "100%",
  padding: "10px 14px 10px 40px",
  border: "1.5px solid #E4E2D9",
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
    color: "#5F5E5A",
    display: "flex",
    alignItems: "center",
    padding: "0",
  },
  perfilAjuda: {
  fontSize: "11.5px",
  color: "#5F5E5A",
  margin: "-2px 0 1px",
  },
  perfilWrapper: {
    display: "flex",
    gap: "8px",
  },
  btnPerfil: {
  flex: 1,
  padding: "8px",
  borderRadius: "10px",
  border: "1.5px solid #E4E2D9",
  background: "rgba(255,255,255,0.5)",
  color: "#5F5E5A",
  fontSize: "13px",
  fontWeight: "500",
  cursor: "pointer",
  fontFamily: "inherit",
  outline: "none",
  },
  btnPerfilAtivo: {
    background: "#1F5C6B",
    borderColor: "#1F5C6B",
    color: "#fff",
  },
  termosWrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    cursor: "pointer",
  },
  checkbox: {
    marginTop: "2px",
    width: "15px",
    height: "15px",
    accentColor: "#1F5C6B",
    cursor: "pointer",
    flexShrink: 0,
  },
  termosTexto: {
    fontSize: "12.5px",
    color: "#5F5E5A",
    lineHeight: "1.4",
  },
  erro: {
    color: "#B23A3A",
    fontSize: "13px",
    margin: "0",
  },
  btnEntrar: {
  background: "#040220",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  padding: "11px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  marginTop: "2px",
  },
  rodape: {
  textAlign: "center",
  fontSize: "13px",
  color: "#5F5E5A",
  marginTop: "16px",
  marginBottom: "0",
  },
  link: {
    color: "#1F5C6B",
    fontWeight: "500",
    cursor: "pointer",
  },
}

export default Cadastro