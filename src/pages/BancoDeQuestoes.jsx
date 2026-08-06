import { useState, useMemo, useRef, useEffect } from "react"
import {
  Search, Plus, Calendar, GraduationCap, Users, X, MoreVertical, Pencil, Trash2,
} from "lucide-react"
import { DIFICULDADES } from "../data/disciplinasSimuladas"
import AvisoSemDisciplina from "../components/AvisoSemDisciplina"
import NovaQuestao from "./NovaQuestao"

function badgeDificuldade(id) {
  return DIFICULDADES.find((d) => d.id === id) || DIFICULDADES[0]
}

function parseDataBR(str) {
  const [d, m, y] = str.split("/")
  return new Date(`${y}-${m}-${d}`)
}

// ── Gráfico de pizza (acertos x erros) via conic-gradient ─────────────────
function GraficoPizza({ percentual }) {
  const cor = "#1a9c5c"
  const corErro = "var(--nexos-error)"
  return (
    <div style={s.pizzaWrap}>
      <div
        style={{
          ...s.pizza,
          background: `conic-gradient(${cor} 0% ${percentual}%, ${corErro} ${percentual}% 100%)`,
        }}
      >
        <div style={s.pizzaMiolo}>
          <span style={s.pizzaNumero}>{percentual}%</span>
          <span style={s.pizzaLabel}>acerto</span>
        </div>
      </div>
      <div style={s.legenda}>
        <div style={s.legendaItem}>
          <span style={{ ...s.legendaBolinha, background: cor }} />
          Acertaram — {percentual}%
        </div>
        <div style={s.legendaItem}>
          <span style={{ ...s.legendaBolinha, background: corErro }} />
          Erraram — {100 - percentual}%
        </div>
      </div>
    </div>
  )
}

// ── Popup de detalhe da questão ────────────────────────────────────────────
function DetalheQuestao({ questao, onFechar, onEditar, onExcluir }) {
  const [menuAberto, setMenuAberto] = useState(false)
  const menuRef = useRef(null)
  const info = badgeDificuldade(questao.dificuldade)

  useEffect(() => {
    function fechar(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAberto(false)
    }
    document.addEventListener("mousedown", fechar)
    return () => document.removeEventListener("mousedown", fechar)
  }, [])

  function confirmarExclusao() {
    if (window.confirm("Excluir essa questão? Essa ação não pode ser desfeita.")) {
      onExcluir(questao.id)
      onFechar()
    }
  }

  return (
    <div style={s.overlay} onClick={onFechar}>
      <div style={s.popup} className="nexos-card" onClick={(e) => e.stopPropagation()}>
        <button style={s.popupFechar} className="nexos-icon-btn" onClick={onFechar}>
          <X size={16} color="var(--nexos-gray)" />
        </button>

        <div style={{ ...s.badgeDificuldade, color: info.cor, background: info.bg }}>{info.label}</div>
        <h3 style={s.popupEnunciado}>{questao.enunciado}</h3>

        <div style={s.metaGrid}>
          <div style={s.metaItem}>
            <Calendar size={13} color="var(--nexos-gray)" />
            Publicada em {questao.dataPublicacao}
          </div>
          <div style={s.metaItem}>
            <GraduationCap size={13} color="var(--nexos-gray)" />
            {questao.disciplina} · {questao.assunto}
          </div>
          <div style={s.metaItem}>
            <Users size={13} color="var(--nexos-gray)" />
            {questao.totalRespondentes} {questao.totalRespondentes === 1 ? "aluno respondeu" : "alunos responderam"}
          </div>
        </div>

        {questao.totalRespondentes > 0 ? (
          <GraficoPizza percentual={questao.percentualAcerto} />
        ) : (
          <p style={s.semRespostas}>Ainda não há respostas suficientes para gerar estatísticas.</p>
        )}

        <div style={s.popupRodape} ref={menuRef}>
          <button style={s.btnMenu} className="nexos-btn" onClick={() => setMenuAberto(!menuAberto)}>
            <MoreVertical size={15} /> Opções
          </button>
          {menuAberto && (
            <div style={s.menuDropdown}>
              <button style={s.menuItem} onClick={() => { setMenuAberto(false); onEditar(questao) }}>
                <Pencil size={14} /> Editar
              </button>
              <button style={{ ...s.menuItem, color: "var(--nexos-error)" }} onClick={confirmarExclusao}>
                <Trash2 size={14} /> Excluir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Lista principal ─────────────────────────────────────────────────────────
function ListaQuestoes({ questoes, onAbrir, onCriar }) {
  const [busca, setBusca] = useState("")
  const [ordem, setOrdem] = useState("recentes")

  const filtradas = useMemo(() => {
    let lista = questoes.filter((q) => q.enunciado.toLowerCase().includes(busca.toLowerCase()))
    if (ordem === "recentes") {
      lista = [...lista].sort((a, b) => parseDataBR(b.dataPublicacao) - parseDataBR(a.dataPublicacao))
    } else {
      const peso = { facil: 0, media: 1, dificil: 2 }
      lista = [...lista].sort((a, b) => peso[a.dificuldade] - peso[b.dificuldade])
    }
    return lista
  }, [questoes, busca, ordem])

  return (
    <div style={s.pagina}>
      <div style={s.cabecalho}>
        <div>
          <h1 style={s.titulo}>Banco de Questões</h1>
          <p style={s.subtitulo}>Todas as questões que você já cadastrou.</p>
        </div>
        <button style={s.btnCriar} className="nexos-btn" onClick={onCriar}>
          <Plus size={15} /> Nova questão
        </button>
      </div>

      <div style={s.filtrosRow}>
        <div style={s.buscaBox}>
          <Search size={15} color="var(--nexos-gray)" />
          <input
            style={s.buscaInput}
            placeholder="Buscar por título da questão..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div style={s.ordemPills}>
          {[["recentes", "Mais recentes"], ["dificuldade", "Dificuldade"]].map(([id, label]) => (
            <button
              key={id}
              className="nexos-btn"
              style={{ ...s.pillOrdem, ...(ordem === id ? s.pillOrdemAtiva : {}) }}
              onClick={() => setOrdem(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtradas.length === 0 ? (
        <div style={s.vazio}>Nenhuma questão encontrada.</div>
      ) : (
        <div style={s.grid}>
          {filtradas.map((questao) => {
            const info = badgeDificuldade(questao.dificuldade)
            return (
              <div key={questao.id} style={s.card} className="nexos-card" onClick={() => onAbrir(questao)}>
                <div style={{ ...s.badgeDificuldade, color: info.cor, background: info.bg }}>{info.label}</div>
                <div style={s.cardEnunciado}>{questao.enunciado}</div>
                <div style={s.cardLinha} />
                <div style={s.cardInfo}>
                  <GraduationCap size={13} color="var(--nexos-gray)" />
                  <span>{questao.disciplina}</span>
                </div>
                <div style={s.cardInfo}>
                  <Calendar size={13} color="var(--nexos-gray)" />
                  <span>{questao.dataPublicacao} · {questao.totalRespondentes} respostas</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
function BancoDeQuestoes({ disciplinas, setDisciplinas, questoes, setQuestoes, iniciarCriando, onIrParaDisciplinas }) {
  const [modo, setModo] = useState(iniciarCriando ? "criar" : "lista")
  const [questaoAberta, setQuestaoAberta] = useState(null)
  const [questaoEditando, setQuestaoEditando] = useState(null)

  function handleSalvarNova(nova) {
    setQuestoes([nova, ...questoes])
    setModo("lista")
  }

  function handleSalvarEdicao(editada) {
    setQuestoes(questoes.map((q) => (q.id === editada.id ? editada : q)))
    setQuestaoEditando(null)
    setModo("lista")
  }

  function handleExcluir(id) {
    setQuestoes(questoes.filter((q) => q.id !== id))
  }

  if (modo === "criar") {
    return (
      <NovaQuestao
        disciplinas={disciplinas}
        setDisciplinas={setDisciplinas}
        onSalvar={handleSalvarNova}
        onCancelar={() => setModo("lista")}
        onIrParaDisciplinas={onIrParaDisciplinas}
      />
    )
  }

  if (modo === "editar" && questaoEditando) {
    return (
      <NovaQuestao
        disciplinas={disciplinas}
        setDisciplinas={setDisciplinas}
        questaoInicial={questaoEditando}
        onSalvar={handleSalvarEdicao}
        onCancelar={() => { setQuestaoEditando(null); setModo("lista") }}
        onIrParaDisciplinas={onIrParaDisciplinas}
      />
    )
  }

  return (
    <>
      {disciplinas.length === 0 && questoes.length === 0 ? (
        <div style={s.pagina}>
          <h1 style={s.titulo}>Banco de Questões</h1>
          <AvisoSemDisciplina acao="cadastrar uma questão" onAdicionar={onIrParaDisciplinas} />
        </div>
      ) : (
        <ListaQuestoes
          questoes={questoes}
          onAbrir={setQuestaoAberta}
          onCriar={() => setModo("criar")}
        />
      )}

      {questaoAberta && (
        <DetalheQuestao
          questao={questaoAberta}
          onFechar={() => setQuestaoAberta(null)}
          onEditar={(q) => { setQuestaoEditando(q); setQuestaoAberta(null); setModo("editar") }}
          onExcluir={handleExcluir}
        />
      )}
    </>
  )
}

const s = {
  pagina: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px" },
  cabecalho: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  titulo: { fontSize: "22px", fontWeight: "700", color: "var(--nexos-navy)", margin: "0 0 4px" },
  subtitulo: { fontSize: "13.5px", color: "var(--nexos-gray)", margin: 0 },

  btnCriar: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px",
    fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
    boxShadow: "0 6px 16px rgba(16, 94, 220, 0.22)",
  },

  filtrosRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  buscaBox: {
    display: "flex", alignItems: "center", gap: "8px", background: "#fff",
    border: "1px solid var(--nexos-border)", borderRadius: "10px", padding: "9px 14px",
    flex: 1, minWidth: "220px", maxWidth: "360px",
  },
  buscaInput: { border: "none", outline: "none", fontSize: "13.5px", fontFamily: "inherit", width: "100%", background: "transparent" },
  ordemPills: { display: "flex", gap: "8px" },
  pillOrdem: {
    background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px",
    padding: "8px 14px", fontSize: "12.5px", fontWeight: "500", color: "var(--nexos-gray)",
    cursor: "pointer", fontFamily: "inherit",
  },
  pillOrdemAtiva: {
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff", border: "1px solid transparent",
  },

  vazio: {
    fontSize: "13.5px", color: "var(--nexos-gray)", background: "var(--nexos-bg)",
    border: "1px dashed var(--nexos-border)", borderRadius: "12px", padding: "24px", textAlign: "center",
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" },
  card: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px",
    padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "10px",
  },
  cardEnunciado: {
    fontSize: "14px", fontWeight: "600", color: "var(--nexos-navy)", lineHeight: 1.4,
    display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  cardLinha: { height: "1px", background: "var(--nexos-border)" },
  cardInfo: { display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--nexos-gray)" },

  badgeDificuldade: {
    display: "inline-flex", alignSelf: "flex-start", fontSize: "11px", fontWeight: "600",
    padding: "4px 10px", borderRadius: "6px",
  },

  overlay: {
    position: "fixed", inset: 0, background: "rgba(5,10,26,0.55)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 100, backdropFilter: "blur(3px)", padding: "20px",
  },
  popup: {
    position: "relative", background: "#fff", borderRadius: "18px", padding: "30px", width: "420px",
    maxHeight: "88vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px",
    boxShadow: "0 24px 60px rgba(5,20,51,0.25)",
  },
  popupFechar: { position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", borderRadius: "8px", padding: "4px" },
  popupEnunciado: { fontSize: "16px", fontWeight: "700", color: "var(--nexos-navy)", margin: 0, lineHeight: 1.4, paddingRight: "20px" },

  metaGrid: { display: "flex", flexDirection: "column", gap: "8px" },
  metaItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--nexos-gray)" },

  semRespostas: {
    fontSize: "12.5px", color: "var(--nexos-gray)", background: "var(--nexos-bg)",
    border: "1px dashed var(--nexos-border)", borderRadius: "10px", padding: "16px", textAlign: "center", margin: 0,
  },

  pizzaWrap: { display: "flex", alignItems: "center", gap: "20px", justifyContent: "center", padding: "8px 0" },
  pizza: {
    width: "110px", height: "110px", borderRadius: "50%", display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  pizzaMiolo: {
    width: "72px", height: "72px", borderRadius: "50%", background: "#fff",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  },
  pizzaNumero: { fontSize: "17px", fontWeight: "700", color: "var(--nexos-navy)" },
  pizzaLabel: { fontSize: "10px", color: "var(--nexos-gray)" },
  legenda: { display: "flex", flexDirection: "column", gap: "8px" },
  legendaItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--nexos-navy)" },
  legendaBolinha: { width: "9px", height: "9px", borderRadius: "50%", display: "inline-block" },

  popupRodape: { position: "relative", marginTop: "6px" },
  btnMenu: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%",
    background: "var(--nexos-bg)", color: "var(--nexos-navy)", border: "1px solid var(--nexos-border)",
    borderRadius: "10px", padding: "10px", fontSize: "13.5px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit",
  },
  menuDropdown: {
    position: "absolute", bottom: "calc(100% + 6px)", left: 0, right: 0, background: "#fff",
    border: "1px solid var(--nexos-border)", borderRadius: "10px", boxShadow: "0 12px 28px rgba(5,20,51,0.14)",
    overflow: "hidden", zIndex: 10,
  },
  menuItem: {
    display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "none", border: "none",
    padding: "11px 14px", fontSize: "13px", fontWeight: "500", color: "var(--nexos-navy)",
    cursor: "pointer", fontFamily: "inherit", textAlign: "left",
  },
}

export default BancoDeQuestoes
