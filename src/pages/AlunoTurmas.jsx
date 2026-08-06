import { GraduationCap, Clock, User } from "lucide-react"
import { TURMAS_ALUNO } from "../data/turmasAluno"

function AlunoTurmas() {
  return (
    <div style={s.pagina}>
      <div>
        <h1 style={s.titulo}>Minhas turmas</h1>
        <p style={s.subtitulo}>Turmas em que você está matriculado.</p>
      </div>

      <div style={s.grid}>
        {TURMAS_ALUNO.map((turma) => (
          <div key={turma.id} style={s.card} className="nexos-card">
            <div style={s.cardIcone}>
              <GraduationCap size={17} color="var(--nexos-blue)" />
            </div>
            <div style={s.cardTitulo}>{turma.disciplina}</div>
            <div style={s.cardLinha} />
            <div style={s.cardInfo}>{turma.nome}</div>
            <div style={s.cardInfo}>
              <Clock size={12} /> {turma.turno}
            </div>
            <div style={s.cardInfo}>
              <User size={12} /> {turma.professor}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const s = {
  pagina: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px" },
  titulo: { fontSize: "22px", fontWeight: "700", color: "var(--nexos-navy)", margin: "0 0 4px" },
  subtitulo: { fontSize: "13.5px", color: "var(--nexos-gray)", margin: 0 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" },
  card: { background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  cardIcone: { width: "34px", height: "34px", borderRadius: "10px", background: "var(--nexos-icon-bg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" },
  cardTitulo: { fontSize: "14.5px", fontWeight: "600", color: "var(--nexos-navy)" },
  cardLinha: { height: "1px", background: "var(--nexos-border)", margin: "2px 0 4px" },
  cardInfo: { display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--nexos-gray)" },
}

export default AlunoTurmas
