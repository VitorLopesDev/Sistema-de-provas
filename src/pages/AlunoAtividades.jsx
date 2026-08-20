import { ClipboardList } from "lucide-react"

function AlunoAtividades() {
  return (
    <div style={s.pagina}>
      <div>
        <h1 style={s.titulo}>Minhas atividades</h1>
        <p style={s.subtitulo}>Acompanhe suas atividades e entregas.</p>
      </div>

      <div style={s.placeholder}>
        <ClipboardList size={32} color="var(--nexos-border)" />
        <p style={s.placeholderTexto}>Em desenvolvimento</p>
      </div>
    </div>
  )
}

const s = {
  pagina: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px", margin: "0 auto" },
  titulo: { fontSize: "22px", fontWeight: "700", color: "var(--nexos-navy)", margin: "0 0 4px" },
  subtitulo: { fontSize: "13.5px", color: "var(--nexos-gray)", margin: 0 },

  placeholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    height: "300px",
    color: "var(--nexos-gray)",
    fontSize: "14px",
  },
  placeholderTexto: {
    fontSize: "14px",
    fontWeight: "600",
    margin: 0,
  },
}

export default AlunoAtividades
