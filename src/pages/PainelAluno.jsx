/*import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import AlunoHome from "./AlunoHome"
import AlunoTurmas from "./AlunoTurmas"
import AlunoProvas from "./AlunoProvas"
import AlunoAtividades from "./AlunoAtividades"
import PerfilAluno from "./PerfilAluno"
import { turmaService, provaService } from "../services/api"

function PainelAluno({ usuario, onSair, onAtualizarUsuario }) {
  const [paginaAtiva, setPaginaAtiva] = useState("home")
  const [sidebarAberto, setSidebarAberto] = useState(true)

  const [turmas, setTurmas] = useState([])
  const [turmasCarregando, setTurmasCarregando] = useState(true)
  const [turmasErro, setTurmasErro] = useState("")

  const [provas, setProvas] = useState([])
  const [provasCarregando, setProvasCarregando] = useState(true)
  const [provasErro, setProvasErro] = useState("")

  useEffect(() => {
    turmaService
      .listarMinhas()
      .then(setTurmas)
      .catch((err) => setTurmasErro(err.message || "Não foi possível carregar suas turmas."))
      .finally(() => setTurmasCarregando(false))

    provaService
      .listarMinhas()
      .then(setProvas)
      .catch((err) => setProvasErro(err.message || "Não foi possível carregar suas provas."))
      .finally(() => setProvasCarregando(false))
  }, [])

  const marginLeft = sidebarAberto ? "220px" : "64px"

  function navegar(id) {
    setPaginaAtiva(id)
  }

  function renderConteudo() {
    if (paginaAtiva === "home") {
      return (
        <AlunoHome
          usuario={usuario}
          provas={provas}
          carregando={provasCarregando}
          onNavegar={navegar}
        />
      )
    }
    if (paginaAtiva === "turmas") {
      return (
        <AlunoTurmas
          turmas={turmas}
          carregando={turmasCarregando}
          erro={turmasErro}
          onTurmaAdicionada={(novaTurma) => setTurmas([novaTurma, ...turmas])}
        />
      )
    }
    if (paginaAtiva === "provas") {
      return (
        <AlunoProvas
          provas={provas}
          carregando={provasCarregando}
          erro={provasErro}
          setProvas={setProvas}
        />
      )
    }
    if (paginaAtiva === "atividades") return <AlunoAtividades />
    if (paginaAtiva === "perfil") return <PerfilAluno usuario={usuario} onAtualizarUsuario={onAtualizarUsuario} />
    return null
  }

  return (
    <div style={s.layout}>
      <Sidebar
        paginaAtiva={paginaAtiva}
        onNavegar={navegar}
        usuario={usuario}
        onSair={onSair}
        aberto={sidebarAberto}
        onToggle={() => setSidebarAberto(!sidebarAberto)}
        onAbrirPerfil={() => navegar("perfil")}
      />
      <main style={{ ...s.main, marginLeft, transition: "margin-left 0.2s ease" }}>
        {renderConteudo()}
      </main>
    </div>
  )
}

const s = {
  layout: { display: "flex", minHeight: "100vh", background: "var(--nexos-bg)" },
  main: { flex: 1, padding: "36px 40px" },
}

export default PainelAluno*/
import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import AlunoHome from "./AlunoHome"
import AlunoTurmas from "./AlunoTurmas"
import AlunoProvas from "./AlunoProvas"
import AlunoAtividades from "./AlunoAtividades"
import PerfilAluno from "./PerfilAluno"
import { turmaService, provaService } from "../services/api"

function PainelAluno({ usuario, onSair, onAtualizarUsuario }) {
  const [paginaAtiva, setPaginaAtiva] = useState("home")
  const [sidebarAberto, setSidebarAberto] = useState(true)
  const [provaPreSelecionada, setProvaPreSelecionada] = useState(null)

  const [turmas, setTurmas] = useState([])
  const [turmasCarregando, setTurmasCarregando] = useState(true)
  const [turmasErro, setTurmasErro] = useState("")

  const [provas, setProvas] = useState([])
  const [provasCarregando, setProvasCarregando] = useState(true)
  const [provasErro, setProvasErro] = useState("")

  useEffect(() => {
    turmaService
      .listarMinhas()
      .then(setTurmas)
      .catch((err) => setTurmasErro(err.message || "Não foi possível carregar suas turmas."))
      .finally(() => setTurmasCarregando(false))

    provaService
      .listarMinhas()
      .then(setProvas)
      .catch((err) => setProvasErro(err.message || "Não foi possível carregar suas provas."))
      .finally(() => setProvasCarregando(false))
  }, [])

  const marginLeft = sidebarAberto ? "220px" : "64px"

  function navegar(id) {
    setPaginaAtiva(id)
    setProvaPreSelecionada(null)
  }

  function renderConteudo() {
    if (paginaAtiva === "home") {
      return (
        <AlunoHome
          usuario={usuario}
          provas={provas}
          carregando={provasCarregando}
          onNavegar={navegar}
        />
      )
    }
    if (paginaAtiva === "turmas") {
      return (
        <AlunoTurmas
          turmas={turmas}
          provas={provas}
          carregando={turmasCarregando}
          erro={turmasErro}
          onTurmaAdicionada={(novaTurma) => setTurmas([novaTurma, ...turmas])}
          onIrParaProva={(prova) => {
            setProvaPreSelecionada(prova)
            setPaginaAtiva("provas")
          }}
        />
      )
    }
    if (paginaAtiva === "provas") {
      return (
        <AlunoProvas
          provas={provas}
          carregando={provasCarregando}
          erro={provasErro}
          setProvas={setProvas}
          provaInicial={provaPreSelecionada}
        />
      )
    }
    if (paginaAtiva === "atividades") return <AlunoAtividades />
    if (paginaAtiva === "perfil") return <PerfilAluno usuario={usuario} onAtualizarUsuario={onAtualizarUsuario} />
    return null
  }

  return (
    <div style={s.layout}>
      <Sidebar
        paginaAtiva={paginaAtiva}
        onNavegar={navegar}
        usuario={usuario}
        onSair={onSair}
        aberto={sidebarAberto}
        onToggle={() => setSidebarAberto(!sidebarAberto)}
        onAbrirPerfil={() => navegar("perfil")}
      />
      <main style={{ ...s.main, marginLeft, transition: "margin-left 0.2s ease" }}>
        {renderConteudo()}
      </main>
    </div>
  )
}

const s = {
  layout: { display: "flex", minHeight: "100vh", background: "var(--nexos-bg)" },
  main: { flex: 1, padding: "36px 40px" },
}

export default PainelAluno