import { useState } from "react"
import { X, Check } from "lucide-react"

function ModalAdicionarRapido({ titulo, placeholder, onFechar, onSalvar }) {
  const [valor, setValor] = useState("")
  const valido = valor.trim().length > 0

  function salvar() {
    if (!valido) return
    onSalvar(valor.trim())
  }

  return (
    <div style={s.overlay} onClick={onFechar}>
      <div style={s.modal} className="nexos-card" onClick={(e) => e.stopPropagation()}>
        <div style={s.cabecalho}>
          <h3 style={s.titulo}>{titulo}</h3>
          <button style={s.btnFechar} className="nexos-icon-btn" onClick={onFechar}>
            <X size={16} color="var(--nexos-gray)" />
          </button>
        </div>
        <input
          style={s.input}
          placeholder={placeholder}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && salvar()}
          autoFocus
        />
        <button
          style={{ ...s.btnSalvar, opacity: valido ? 1 : 0.5, cursor: valido ? "pointer" : "not-allowed" }}
          className="nexos-btn"
          onClick={salvar}
        >
          <Check size={15} /> Adicionar
        </button>
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: "fixed", inset: 0, background: "rgba(5,10,26,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 200, backdropFilter: "blur(2px)",
  },
  modal: {
    background: "#fff", borderRadius: "16px", padding: "24px", width: "320px",
    display: "flex", flexDirection: "column", gap: "14px",
    boxShadow: "0 24px 60px rgba(5,20,51,0.25)",
  },
  cabecalho: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  titulo: { fontSize: "15px", fontWeight: "700", color: "var(--nexos-navy)", margin: 0 },
  btnFechar: { background: "none", border: "none", cursor: "pointer", borderRadius: "8px", padding: "4px" },
  input: {
    background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px",
    padding: "10px 12px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit", outline: "none",
  },
  btnSalvar: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff", border: "none", borderRadius: "10px", padding: "10px", fontSize: "13.5px",
    fontWeight: "600", fontFamily: "inherit",
  },
}

export default ModalAdicionarRapido
