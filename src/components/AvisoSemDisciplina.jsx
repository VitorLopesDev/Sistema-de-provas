import { AlertTriangle, Plus } from "lucide-react"

function AvisoSemDisciplina({ acao = "cadastrar uma questão", onAdicionar }) {
  return (
    <div style={s.aviso}>
      <div style={s.icone}>
        <AlertTriangle size={22} color="#b8860b" />
      </div>
      <div>
        <div style={s.titulo}>Você ainda não tem nenhuma disciplina cadastrada</div>
        <p style={s.texto}>
          Antes de {acao}, cadastre pelo menos uma disciplina — é ela que organiza os assuntos usados nas questões e provas.
        </p>
      </div>
      <button style={s.botao} className="nexos-btn" onClick={onAdicionar}>
        <Plus size={15} /> Adicionar disciplina
      </button>
    </div>
  )
}

const s = {
  aviso: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "12px",
    background: "rgba(184,134,11,0.06)",
    border: "1px dashed #b8860b",
    borderRadius: "14px",
    padding: "36px",
    maxWidth: "480px",
  },
  icone: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "rgba(184,134,11,0.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: "15px",
    fontWeight: "700",
    color: "var(--nexos-navy)",
    marginBottom: "4px",
  },
  texto: {
    fontSize: "13px",
    color: "var(--nexos-gray)",
    lineHeight: 1.6,
    margin: 0,
  },
  botao: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "13.5px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    marginTop: "4px",
  },
}

export default AvisoSemDisciplina
