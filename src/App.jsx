import { useState } from "react"
import Login from "./pages/Login"
import PainelProfessor from "./pages/PainelProfessor"

function App() {
  const [usuario, setUsuario] = useState(null)

  if (!usuario) {
    return <Login onLogin={setUsuario} />
  }

  if (usuario.perfil === "PROFESSOR") {
    return <PainelProfessor usuario={usuario} onSair={() => setUsuario(null)} />
  }

  // Placeholder aluno — próxima etapa
  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h2>Olá, {usuario.nome}!</h2>
      <p>Área do aluno em construção.</p>
      <button onClick={() => setUsuario(null)}>Sair</button>
    </div>
  )
}

export default App