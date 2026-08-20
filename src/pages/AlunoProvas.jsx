import { useState } from "react"
import { provaService } from "../services/api"
import {
  FileText, Clock, GraduationCap, CheckCircle2, XCircle, Lock,
  ArrowLeft, Send, X, Award,
} from "lucide-react"

const STATUS_INFO = {
  pendente: { label: "Disponível", cor: "var(--nexos-blue)", bg: "var(--nexos-icon-bg)" },
  enviada: { label: "Aguardando correção", cor: "var(--nexos-gray)", bg: "var(--nexos-bg)" },
  liberada: { label: "Corrigida", cor: "#1a9c5c", bg: "rgba(26,156,92,0.12)" },
}

// ── Lista ───────────────────────────────────────────────────────────────
function ListaProvasAluno({ provas, onAbrir }) {
  return (
    <div style={s.pagina}>
      <div>
        <h1 style={s.titulo}>Minhas provas</h1>
        <p style={s.subtitulo}>Acompanhe suas avaliações — a correção só fica disponível quando o professor libera.</p>
      </div>

      <div style={s.grid}>
        {provas.map((prova) => {
          const info = STATUS_INFO[prova.status]
          return (
            <div key={prova.id} style={s.card} className="nexos-card" onClick={() => onAbrir(prova)}>
              <div style={{ ...s.badge, color: info.cor, background: info.bg }}>
                {prova.status === "liberada" && <CheckCircle2 size={12} />}
                {prova.status === "enviada" && <Lock size={11} />}
                {info.label}
              </div>
              <div style={s.cardTitulo}>{prova.titulo}</div>
              <div style={s.cardLinha} />
              <div style={s.cardInfo}>
                <GraduationCap size={13} color="var(--nexos-gray)" />
                <span>{prova.turma}</span>
              </div>
              <div style={s.cardInfo}>
                <Clock size={13} color="var(--nexos-gray)" />
                <span>{prova.dataInicio} → {prova.dataFim.split(" ")[1]}</span>
              </div>
              {prova.status === "liberada" && (
                <div style={s.notaLinha}>
                  <Award size={13} color="#1a9c5c" />
                  <span>Nota: {prova.nota}/{prova.notaMaxima}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Responder prova (status pendente) ──────────────────────────────────────
function ResponderProva({ prova, onVoltar, onEnviar }) {
  const [respostas, setRespostas] = useState(
    Object.fromEntries(prova.questoes.map((q) => [q.id, q.respostaAluno || ""]))
  )

  return (
    <div style={s.paginaEstreita}>
      <button style={s.btnVoltar} className="nexos-link" onClick={onVoltar}>
        <ArrowLeft size={14} /> Voltar
      </button>

      <h1 style={{ ...s.titulo, marginTop: "14px" }}>{prova.titulo}</h1>
      <p style={s.subtitulo}>{prova.turma} · até {prova.dataFim}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
        {prova.questoes.map((q, i) => (
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
        <button
          style={s.btnEnviar}
          className="nexos-btn"
          onClick={() => onEnviar(prova.id, respostas)}
        >
          <Send size={15} /> Enviar respostas
        </button>
      </div>
    </div>
  )
}

// ── Revisão (status liberada — somente leitura) ────────────────────────────
function RevisaoProva({ prova, onVoltar }) {
  const [popupAberto, setPopupAberto] = useState(true)

  return (
    <div style={s.paginaEstreita}>
      <button style={s.btnVoltar} className="nexos-link" onClick={onVoltar}>
        <ArrowLeft size={14} /> Voltar
      </button>

      <h1 style={{ ...s.titulo, marginTop: "14px" }}>{prova.titulo}</h1>
      <p style={s.subtitulo}>{prova.turma} · resultado disponível</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
        {prova.questoes.map((q, i) => (
          <div key={q.id} style={s.questaoCard} className="nexos-card">
            <div style={s.questaoTopo}>
              <div style={s.questaoLabel}>Questão {i + 1}</div>
              {q.correta !== undefined && (
                q.correta
                  ? <span style={{ ...s.badgeCorrecao, color: "#1a9c5c", background: "rgba(26,156,92,0.12)" }}><CheckCircle2 size={13} /> Correta</span>
                  : <span style={{ ...s.badgeCorrecao, color: "var(--nexos-error)", background: "rgba(178,58,58,0.1)" }}><XCircle size={13} /> Incorreta</span>
              )}
            </div>
            <div style={s.questaoTexto}>{q.pergunta}</div>
            <div style={s.respostaBox}>
              <div style={s.respostaLabel}>Sua resposta</div>
              <div style={s.respostaTexto}>{q.respostaAluno}</div>
            </div>
            {q.correta === false && q.respostaCorreta && (
              <div style={{ ...s.respostaBox, borderColor: "#1a9c5c" }}>
                <div style={{ ...s.respostaLabel, color: "#1a9c5c" }}>Resposta correta</div>
                <div style={s.respostaTexto}>{q.respostaCorreta}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {popupAberto && (
        <div style={s.popupOverlay} onClick={() => setPopupAberto(false)}>
          <div style={s.popup} className="nexos-card" onClick={(e) => e.stopPropagation()}>
            <button style={s.popupFechar} className="nexos-icon-btn" onClick={() => setPopupAberto(false)}>
              <X size={16} color="var(--nexos-gray)" />
            </button>
            <div style={s.popupIcone}>
              <Award size={26} color="#fff" />
            </div>
            <div style={s.popupTitulo}>Prova corrigida!</div>
            <p style={s.popupTexto}>
              Sua prova de <strong>{prova.titulo}</strong> foi revisada pelo professor.
            </p>
            <div style={s.popupNota}>{prova.nota}<span style={{ fontSize: "16px", color: "var(--nexos-gray)" }}>/{prova.notaMaxima}</span></div>
            <button style={s.btnEnviar} className="nexos-btn" onClick={() => setPopupAberto(false)}>
              Ver respostas
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Aguardando correção ────────────────────────────────────────────────────
function AguardandoCorrecao({ prova, onVoltar }) {
  return (
    <div style={s.paginaEstreita}>
      <button style={s.btnVoltar} className="nexos-link" onClick={onVoltar}>
        <ArrowLeft size={14} /> Voltar
      </button>
      <div style={{ ...s.vazio, marginTop: "24px" }}>
        <Lock size={22} color="var(--nexos-gray)" style={{ marginBottom: "10px" }} />
        <div style={{ fontWeight: 600, color: "var(--nexos-navy)", marginBottom: "4px" }}>
          {prova.titulo}
        </div>
        Você já enviou essa prova. A correção fica disponível assim que o professor liberar para revisão.
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
function AlunoProvas({ provas, carregando, erro, setProvas, provaInicial }) {
  const [provaAtiva, setProvaAtiva] = useState(provaInicial)
  const [enviando, setEnviando] = useState(false)

  async function handleEnviar(id, respostas) {
    if (enviando) return
    setEnviando(true)
    try {
      const provaAtualizada = await provaService.enviarRespostas(id, respostas)
      setProvas(provas.map((p) => (p.id === id ? provaAtualizada : p)))
      setProvaAtiva(null)
    } catch (err) {
      window.alert(err.message || "Não foi possível enviar suas respostas.")
    } finally {
      setEnviando(false)
    }
  }

  if (carregando) {
    return <div style={s.vazio}>Carregando provas...</div>
  }

  if (erro) {
    return <div style={s.vazio}>{erro}</div>
  }

  if (provaAtiva) {
    const provaAtual = provas.find((p) => p.id === provaAtiva.id)
    if (provaAtual.status === "pendente") {
      return <ResponderProva prova={provaAtual} onVoltar={() => setProvaAtiva(null)} onEnviar={handleEnviar} />
    }
    if (provaAtual.status === "enviada") {
      return <AguardandoCorrecao prova={provaAtual} onVoltar={() => setProvaAtiva(null)} />
    }
    return <RevisaoProva prova={provaAtual} onVoltar={() => setProvaAtiva(null)} />
  }

  return <ListaProvasAluno provas={provas} onAbrir={setProvaAtiva} />
}

const s = {
  pagina: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px", margin: "0 auto" },
  paginaEstreita: { maxWidth: "760px", margin: "0 auto" },
  titulo: { fontSize: "22px", fontWeight: "700", color: "var(--nexos-navy)", margin: "0 0 4px" },
  subtitulo: { fontSize: "13.5px", color: "var(--nexos-gray)", margin: 0 },
  btnVoltar: { display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--nexos-gray)", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", padding: 0 },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" },
  card: { background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px", padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px" },
  badge: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "600", padding: "4px 9px", borderRadius: "6px", alignSelf: "flex-start", marginBottom: "2px" },
  cardTitulo: { fontSize: "14.5px", fontWeight: "600", color: "var(--nexos-navy)" },
  cardLinha: { height: "1px", background: "var(--nexos-border)", margin: "2px 0 4px" },
  cardInfo: { display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--nexos-gray)" },
  notaLinha: { display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", color: "#1a9c5c", fontWeight: "600", marginTop: "2px" },

  questaoCard: { background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px", padding: "20px", display: "flex", flexDirection: "column", gap: "10px" },
  questaoTopo: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  questaoLabel: { fontSize: "12px", fontWeight: "600", color: "var(--nexos-blue)", textTransform: "uppercase", letterSpacing: "0.03em" },
  questaoTexto: { fontSize: "14.5px", color: "var(--nexos-navy)", lineHeight: 1.5 },
  badgeCorrecao: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11.5px", fontWeight: "600", padding: "4px 10px", borderRadius: "6px" },

  textarea: { background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px", padding: "10px 12px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit", outline: "none", minHeight: "80px", resize: "vertical" },

  respostaBox: { background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px", padding: "10px 12px" },
  respostaLabel: { fontSize: "11px", fontWeight: "600", color: "var(--nexos-gray)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.03em" },
  respostaTexto: { fontSize: "13.5px", color: "var(--nexos-navy)", lineHeight: 1.5 },

  btnEnviar: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))", color: "#fff", border: "none", borderRadius: "10px", padding: "11px 22px", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", boxShadow: "0 6px 16px rgba(16, 94, 220, 0.22)", width: "100%" },

  vazio: { fontSize: "13.5px", color: "var(--nexos-gray)", background: "var(--nexos-bg)", border: "1px dashed var(--nexos-border)", borderRadius: "12px", padding: "32px", textAlign: "center" },

  popupOverlay: { position: "fixed", inset: 0, background: "rgba(5,10,26,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(3px)" },
  popup: { position: "relative", background: "#fff", borderRadius: "18px", padding: "32px", width: "340px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", boxShadow: "0 24px 60px rgba(5,20,51,0.25)" },
  popupFechar: { position: "absolute", top: "12px", right: "12px", background: "none", border: "none", cursor: "pointer", borderRadius: "8px", padding: "4px" },
  popupIcone: { width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, var(--nexos-blue), var(--nexos-purple))", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" },
  popupTitulo: { fontSize: "18px", fontWeight: "700", color: "var(--nexos-navy)" },
  popupTexto: { fontSize: "13px", color: "var(--nexos-gray)", margin: "0 0 8px", lineHeight: 1.5 },
  popupNota: { fontSize: "36px", fontWeight: "800", color: "var(--nexos-blue)", marginBottom: "14px" },
}

export default AlunoProvas
