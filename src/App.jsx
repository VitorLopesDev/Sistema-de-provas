import { useState } from "react"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import PainelProfessor from "./pages/PainelProfessor"
import PainelAluno from "./pages/PainelAluno"

function App() {
  const [usuario, setUsuario] = useState(null)
  const [tela, setTela] = useState("home") // "home", "login" ou "cadastro"

  if (!usuario) {
    if (tela === "login") {
      return (
        <Login
          onLogin={setUsuario}
          onIrParaCadastro={() => setTela("cadastro")}
        />
      )
    }
    if (tela === "cadastro") {
      return (
        <Cadastro
          onCadastro={setUsuario}
          onIrParaLogin={() => setTela("login")}
        />
      )
    }
    return (
      <Home
        onIrParaLogin={() => setTela("login")}
        onIrParaCadastro={() => setTela("cadastro")}
      />
    )
  }

  if (usuario.perfil === "PROFESSOR") {
    return (
      <PainelProfessor
        usuario={usuario}
        onSair={() => setUsuario(null)}
        onAtualizarUsuario={(dados) => setUsuario((u) => ({ ...u, ...dados }))}
      />
    )
  }

  return (
    <PainelAluno
      usuario={usuario}
      onSair={() => setUsuario(null)}
      onAtualizarUsuario={(dados) => setUsuario((u) => ({ ...u, ...dados }))}
    />
  )
}

export default App