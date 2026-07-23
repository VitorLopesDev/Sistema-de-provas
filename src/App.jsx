import { useState } from "react"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Cadastro from "./pages/Cadastro"
import PainelProfessor from "./pages/PainelProfessor"

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
    return <PainelProfessor usuario={usuario} onSair={() => setUsuario(null)} />
  }

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h2>Olá, {usuario.nome}!</h2>
      <p>Área do aluno em construção.</p>
      <button onClick={() => setUsuario(null)}>Sair</button>
    </div>
  )
}

export default App