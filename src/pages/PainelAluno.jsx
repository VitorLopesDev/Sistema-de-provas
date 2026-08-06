import { useState } from "react"
import Sidebar from "../components/Sidebar"
import AlunoHome from "./AlunoHome"
import AlunoTurmas from "./AlunoTurmas"
import AlunoProvas from "./AlunoProvas"
import AlunoAtividades from "./AlunoAtividades"
import PerfilAluno from "./PerfilAluno"

function PainelAluno({ usuario, onSair, onAtualizarUsuario }) {
  const [paginaAtiva, setPaginaAtiva] = useState("home")
  const [sidebarAberto, setSidebarAberto] = useState(true)

  const marginLeft = sidebarAberto ? "220px" : "64px"

  function navegar(id) {
    setPaginaAtiva(id)
  }

  function renderConteudo() {
    if (paginaAtiva === "home") return <AlunoHome usuario={usuario} onNavegar={navegar} />
    if (paginaAtiva === "turmas") return <AlunoTurmas />
    if (paginaAtiva === "provas") return <AlunoProvas />
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
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--nexos-bg)",
  },
  main: {
    flex: 1,
    padding: "36px 40px",
  },
}

export default PainelAluno
