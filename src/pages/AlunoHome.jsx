import { GraduationCap, Clock, ArrowRight, FileText, Award } from "lucide-react"

function AlunoHome({ usuario, provas, carregando, onNavegar }) {
  const primeiroNome = usuario.nome.split(" ")[0]

  if (carregando) {
    return (
      <div style={s.pagina}>
        <div style={s.vazio}>Carregando...</div>
      </div>
    )
  }

  const pendentes = provas.filter((p) => p.status === "pendente")
  const liberadasRecentes = provas.filter((p) => p.status === "liberada").slice(0, 3)

  return (
    <div style={s.pagina}>

      <div style={s.saudacaoCard} className="nexos-card">
        <div>
          <h1 style={s.saudacaoTitulo}>Olá, {primeiroNome}</h1>
          <p style={s.saudacaoSubtitulo}>Bem-vindo de volta! Veja o que precisa da sua atenção.</p>
        </div>
        <div style={s.saudacaoArte}>
          <div style={s.arteGlowRoxo} />
          <div style={s.arteGlowAzul} />
          <GraduationCap size={46} color="#ffffff" style={{ position: "relative", zIndex: 1 }} />
        </div>
      </div>

      <div style={s.secao}>
        <div style={s.provasHeader}>
          <div style={s.secaoTitulo}>
            <FileText size={18} color="var(--nexos-blue)" />
            <span>Provas pendentes</span>
          </div>
          <button style={s.verTodas} className="nexos-link" onClick={() => onNavegar("provas")}>
            Ver todas <ArrowRight size={13} />
          </button>
        </div>

        {pendentes.length === 0 ? (
          <div style={s.vazio}>Nenhuma prova pendente no momento. 🎉</div>
        ) : (
          <div style={s.grid}>
            {pendentes.map((prova) => (
              <div key={prova.id} style={s.card} className="nexos-card" onClick={() => onNavegar("provas")}>
                <div style={s.cardTitulo}>{prova.titulo}</div>
                <div style={s.cardLinha} />
                <div style={s.cardInfo}>
                  <GraduationCap size={13} color="var(--nexos-gray)" />
                  <span>{prova.turma}</span>
                </div>
                <div style={s.cardInfo}>
                  <Clock size={13} color="var(--nexos-gray)" />
                  <span>até {prova.dataFim}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {liberadasRecentes.length > 0 && (
        <div style={s.secao}>
          <div style={s.secaoTitulo}>
            <Award size={18} color="var(--nexos-blue)" />
            <span>Correções recentes</span>
          </div>
          <div style={s.grid}>
            {liberadasRecentes.map((prova) => (
              <div key={prova.id} style={s.card} className="nexos-card" onClick={() => onNavegar("provas")}>
                <div style={s.cardTitulo}>{prova.titulo}</div>
                <div style={s.cardLinha} />
                <div style={{ ...s.cardInfo, color: "#1a9c5c", fontWeight: 600 }}>
                  <Award size={13} color="#1a9c5c" />
                  <span>Nota: {prova.nota}/{prova.notaMaxima}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}

const s = {
  pagina: { display: "flex", flexDirection: "column", gap: "40px", maxWidth: "1000px", margin: "0 auto" },

  saudacaoCard: { background: "#ffffff", border: "1px solid var(--nexos-border)", borderRadius: "16px", padding: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px" },
  saudacaoTitulo: { fontSize: "22px", fontWeight: "700", color: "var(--nexos-navy)", margin: "0 0 6px" },
  saudacaoSubtitulo: { fontSize: "13.5px", color: "var(--nexos-gray)", margin: 0 },
  saudacaoArte: { position: "relative", width: "108px", height: "108px", minWidth: "108px", borderRadius: "50%", background: "linear-gradient(135deg, var(--nexos-blue), var(--nexos-purple))", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  arteGlowRoxo: { position: "absolute", width: "70px", height: "70px", borderRadius: "50%", background: "var(--nexos-purple)", filter: "blur(24px)", top: "-10px", right: "-10px", opacity: 0.8 },
  arteGlowAzul: { position: "absolute", width: "70px", height: "70px", borderRadius: "50%", background: "var(--nexos-cyan)", filter: "blur(24px)", bottom: "-10px", left: "-10px", opacity: 0.7 },

  secao: { display: "flex", flexDirection: "column", gap: "16px" },
  secaoTitulo: { display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", fontWeight: "600", color: "var(--nexos-navy)" },
  provasHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  verTodas: { display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--nexos-gray)", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", padding: 0 },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" },
  card: { background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "12px", padding: "18px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px" },
  cardTitulo: { fontSize: "14.5px", fontWeight: "600", color: "var(--nexos-navy)" },
  cardLinha: { height: "1px", background: "var(--nexos-border)", margin: "2px 0 4px" },
  cardInfo: { display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--nexos-gray)" },

  vazio: { fontSize: "13.5px", color: "var(--nexos-gray)", background: "var(--nexos-bg)", border: "1px dashed var(--nexos-border)", borderRadius: "12px", padding: "24px", textAlign: "center" },
}

export default AlunoHome
