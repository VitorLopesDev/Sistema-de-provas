import { useState } from "react"
import { Calendar, GraduationCap, Lock, ArrowLeft, Send, CheckCircle2 } from "lucide-react"
import { ATIVIDADES_ALUNO } from "../data/atividadesAluno"

const STATUS_INFO = {
  pendente: { label: "Pendente", cor: "var(--nexos-blue)", bg: "var(--nexos-icon-bg)" },
  enviada: { label: "Enviada", cor: "#1a9c5c", bg: "rgba(26,156,92,0.12)" },
}

function ListaAtividades({ atividades, onAbrir }) {
  return (
    <div style={s.pagina}>
      <div>
        <h1 style={s.titulo}>Minhas atividades</h1>
        <p style={s.subtitulo}>Depois de enviada, você pode consultar suas respostas a qualquer momento — mas não pode mais alterá-las.</p>
      </div>

      <div style={s.grid}>
        {atividades.map((a) => {
          const info = STATUS_INFO[a.status]
          return (
            <div key={a.id} style={s.card} className="nexos-card" onClick={() => onAbrir(a)}>
              <div style={{ ...s.badge, color: info.cor, background: info.bg }}>
                {a.status === "enviada" && <CheckCircle2 size={12} />}
                {info.label}
              </div>
              <div style={s.cardTitulo}>{a.titulo}</div>
              <div style={s.cardLinha} />
              <div style={s.cardInfo}>
                <GraduationCap size={13} color="var(--nexos-gray)" />
                <span>{a.turma}</span>
              </div>
              <div style={s.cardInfo}>
                <Calendar size={13} color="var(--nexos-gray)" />
                <span>Entrega até {a.dataEntrega}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ResponderAtividade({ atividade, onVoltar, onEnviar }) {
  const [respostas, setRespostas] = useState(
    Object.fromEntries(atividade.questoes.map((q) => [q.id, q.respostaAluno || ""]))
  )

  return (
    <div style={s.paginaEstreita}>
      <button style={s.btnVoltar} className="nexos-link" onClick={onVoltar}>
        <ArrowLeft size={14} /> Voltar
      </button>
      <h1 style={{ ...s.titulo, marginTop: "14px" }}>{atividade.titulo}</h1>
      <p style={s.subtitulo}>{atividade.turma} · entrega até {atividade.dataEntrega}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
        {atividade.questoes.map((q, i) => (
          <div key={q.id} style={s.questaoCard} className="nexos-card">
            <div style={s.questaoLabel}>Questão {i + 1}</div>
            <div style={s.questaoTexto}>{q.pergunta}</div>
            <textarea
              style={s.textarea}
              placeholder="Digite sua resposta..."
              value={respostas[q.id]}
              onChange={(e) => setRespostas({ ...respostas, [q.id]: e.target.value })}
            />
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
        <button style={s.btnEnviar} className="nexos-btn" onClick={() => onEnviar(atividade.id, respostas)}>
          <Send size={15} /> Enviar atividade
        </button>
      </div>
    </div>
  )
}

function ConsultarAtividade({ atividade, onVoltar }) {
  return (
    <div style={s.paginaEstreita}>
      <button style={s.btnVoltar} className="nexos-link" onClick={onVoltar}>
        <ArrowLeft size={14} /> Voltar
      </button>
      <h1 style={{ ...s.titulo, marginTop: "14px" }}>{atividade.titulo}</h1>
      <p style={s.subtitulo}>
        <Lock size={12} style={{ verticalAlign: "-1px", marginRight: "5px" }} />
        Enviada — suas respostas não podem mais ser alteradas.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
        {atividade.questoes.map((q, i) => (
          <div key={q.id} style={s.questaoCard} className="nexos-card">
            <div style={s.questaoLabel}>Questão {i + 1}</div>
            <div style={s.questaoTexto}>{q.pergunta}</div>
            <div style={s.respostaBox}>
              <div style={s.respostaLabel}>Sua resposta</div>
              <div style={s.respostaTexto}>{q.respostaAluno}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AlunoAtividades() {
  const [atividades, setAtividades] = useState(ATIVIDADES_ALUNO)
  const [ativa, setAtiva] = useState(null)

  function handleEnviar(id, respostas) {
    setAtividades(atividades.map((a) =>
      a.id === id
        ? { ...a, status: "enviada", questoes: a.questoes.map((q) => ({ ...q, respostaAluno: respostas[q.id] })) }
        : a
    ))
    setAtiva(null)
  }

  if (ativa) {
    const atual = atividades.find((a) => a.id === ativa.id)
    return atual.status === "pendente"
      ? <ResponderAtividade atividade={atual} onVoltar={() => setAtiva(null)} onEnviar={handleEnviar} />
      : <ConsultarAtividade atividade={atual} onVoltar={() => setAtiva(null)} />
  }

  return <ListaAtividades atividades={atividades} onAbrir={setAtiva} />
}

const s = {
  pagina: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px" },
  paginaEstreita: { maxWidth: "760px" },
  titulo: { fontSize: "22px", fontWeight: "700", color: "var(--nexos-navy)", margin: "0 0 4px" },
  subtitulo: { fontSize: "13.5px", color: "var(--nexos-gray)", margin: 0 },
  btnVoltar: { display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--nexos-gray)", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", padding: 0 },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" },
  card: { background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px", padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px" },
  badge: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "600", padding: "4px 9px", borderRadius: "6px", alignSelf: "flex-start", marginBottom: "2px" },
  cardTitulo: { fontSize: "14.5px", fontWeight: "600", color: "var(--nexos-navy)" },
  cardLinha: { height: "1px", background: "var(--nexos-border)", margin: "2px 0 4px" },
  cardInfo: { display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--nexos-gray)" },

  questaoCard: { background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" },
  questaoLabel: { fontSize: "12px", fontWeight: "600", color: "var(--nexos-blue)", textTransform: "uppercase", letterSpacing: "0.03em" },
  questaoTexto: { fontSize: "14.5px", color: "var(--nexos-navy)", lineHeight: 1.5 },

  textarea: { background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px", padding: "10px 12px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit", outline: "none", minHeight: "80px", resize: "vertical" },

  respostaBox: { background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px", padding: "10px 12px" },
  respostaLabel: { fontSize: "11px", fontWeight: "600", color: "var(--nexos-gray)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.03em" },
  respostaTexto: { fontSize: "13.5px", color: "var(--nexos-navy)", lineHeight: 1.5 },

  btnEnviar: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))", color: "#fff", border: "none", borderRadius: "10px", padding: "11px 22px", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 16px rgba(16, 94, 220, 0.22)" },
}

export default AlunoAtividades
