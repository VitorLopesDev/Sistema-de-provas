import { Sparkles, Users, FileEdit, HelpCircle, FileText, ArrowRight, Clock, GraduationCap } from "lucide-react"
import { PROVAS_SIMULADAS } from "../data/provasSimuladas"

function PainelHome({ usuario, onNavegar }) {

  const ativas = PROVAS_SIMULADAS.filter((p) => {
    const agora = new Date()
    const inicio = new Date(p.dataInicio.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))
    const fim = new Date(p.dataFim.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))
    return agora >= inicio && agora <= fim
  }).slice(0, 3)

  return (
    <div style={s.pagina}>

      {/* Card de saudação */}
      <div style={s.saudacaoCard} className="nexos-card">
        <div>
          <h1 style={s.saudacaoTitulo}>Olá, Professor(a) {usuario.nome}</h1>
          <p style={s.saudacaoSubtitulo}>Bem-vindo de volta! O que vamos fazer hoje?</p>
        </div>
        <div style={s.saudacaoArte}>
          <div style={s.arteGlowRoxo} />
          <div style={s.arteGlowAzul} />
          <GraduationCap size={46} color="#ffffff" style={{ position: "relative", zIndex: 1 }} />
        </div>
      </div>

      {/* Ações rápidas */}
      <div style={s.secao}>
        <div style={s.secaoTitulo}>
          <Sparkles size={18} color="var(--nexos-blue)" />
          <span>Faça agora mesmo</span>
        </div>

        <div style={s.acoesRow}>
          <button style={s.btnAcao} className="nexos-btn" onClick={() => onNavegar("turmas", { criar: true })}>
            <Users size={16} />
            Criar turma
          </button>
          <button style={s.btnAcao} className="nexos-btn" onClick={() => onNavegar("provas")}>
            <FileEdit size={16} />
            Criar avaliação
          </button>
          <button style={s.btnAcao} className="nexos-btn" onClick={() => onNavegar("questoes", { criar: true })}>
            <HelpCircle size={16} />
            Nova questão
          </button>
        </div>
      </div>

      {/* Provas ativas */}
      <div style={s.secao}>
        <div style={s.provasHeader}>
          <div style={s.secaoTitulo}>
            <FileText size={18} color="var(--nexos-blue)" />
            <span>Provas ativas</span>
          </div>
          <button style={s.verTodas} className="nexos-link" onClick={() => onNavegar("provas")}>
            Ver todas <ArrowRight size={13} />
          </button>
        </div>

        {ativas.length === 0 ? (
          <div style={s.vazio}>Nenhuma prova ativa no momento.</div>
        ) : (
          <div style={s.provasGrid}>
            {ativas.map((prova) => (
              <div key={prova.id} style={s.provaCard} className="nexos-card" onClick={() => onNavegar("provas")}>
                <div style={s.provaTitulo}>{prova.titulo}</div>
                <div style={s.provaLinha} />
                <div style={s.provaInfo}>
                  <GraduationCap size={13} color="var(--nexos-gray)" />
                  <span>{prova.turma}</span>
                </div>
                <div style={s.provaInfo}>
                  <Clock size={13} color="var(--nexos-gray)" />
                  <span>{prova.dataInicio} → {prova.dataFim.split(" ")[1]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

const s = {
  pagina: {
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    maxWidth: "1000px",
  },

  saudacaoCard: {
    background: "#ffffff",
    border: "1px solid var(--nexos-border)",
    borderRadius: "16px",
    padding: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
  },

  saudacaoTitulo: {
    fontSize: "22px",
    fontWeight: "700",
    color: "var(--nexos-navy)",
    margin: "0 0 6px",
  },

  saudacaoSubtitulo: {
    fontSize: "13.5px",
    color: "var(--nexos-gray)",
    margin: 0,
  },

  saudacaoArte: {
    position: "relative",
    width: "108px",
    height: "108px",
    minWidth: "108px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, var(--nexos-blue), var(--nexos-purple))",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  arteGlowRoxo: {
    position: "absolute",
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "var(--nexos-purple)",
    filter: "blur(24px)",
    top: "-10px",
    right: "-10px",
    opacity: 0.8,
  },

  arteGlowAzul: {
    position: "absolute",
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    background: "var(--nexos-cyan)",
    filter: "blur(24px)",
    bottom: "-10px",
    left: "-10px",
    opacity: 0.7,
  },

  secao: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  secaoTitulo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--nexos-navy)",
  },

  acoesRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  btnAcao: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "11px 18px",
    fontSize: "13.5px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 6px 16px rgba(16, 94, 220, 0.22)",
  },

  provasHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  verTodas: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "none",
    color: "var(--nexos-gray)",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
    padding: 0,
  },

  provasGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  },

  provaCard: {
    background: "var(--nexos-bg)",
    border: "1px solid var(--nexos-border)",
    borderRadius: "12px",
    padding: "18px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  provaTitulo: {
    fontSize: "14.5px",
    fontWeight: "600",
    color: "var(--nexos-navy)",
  },

  provaLinha: {
    height: "1px",
    background: "var(--nexos-border)",
    margin: "2px 0 4px",
  },

  provaInfo: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "12px",
    color: "var(--nexos-gray)",
  },

  vazio: {
    fontSize: "13.5px",
    color: "var(--nexos-gray)",
    background: "var(--nexos-bg)",
    border: "1px dashed var(--nexos-border)",
    borderRadius: "12px",
    padding: "24px",
    textAlign: "center",
  },
}

export default PainelHome
