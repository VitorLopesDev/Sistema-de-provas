import { useState } from "react"
import Sidebar from "../components/Sidebar"
import { Clock, AlertTriangle, CheckCircle, ChevronRight, ArrowLeft, Eye, Zap, Calendar, Archive, Pencil, Trash2, Send } from "lucide-react"
import { PROVAS_SIMULADAS } from "../data/provasSimuladas"
import { DISCIPLINAS_SIMULADAS } from "../data/disciplinasSimuladas"
import { QUESTOES_SIMULADAS } from "../data/questoesSimuladas"
import { TURMAS_SIMULADAS } from "../data/turmasSimuladas"
import PainelHome from "./PainelHome"
import Turmas from "./Turmas"
import MinhasDisciplinas from "./MinhasDisciplinas"
import BancoDeQuestoes from "./BancoDeQuestoes"
import PerfilProfessor from "./PerfilProfessor"



// ── Tela: Lista de provas ──────────────────────────────────────────────────
function ListaProvas({ provas: PROVAS_SIMULADAS, onVerDetalhe, onCriar }) {
  const ativas     = PROVAS_SIMULADAS.filter((p) => {
    const agora = new Date()
    const inicio = new Date(p.dataInicio.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))
    const fim    = new Date(p.dataFim.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))
    return agora >= inicio && agora <= fim
  })
  const agendadas  = PROVAS_SIMULADAS.filter((p) => {
    const inicio = new Date(p.dataInicio.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))
    return new Date() < inicio
  })
  const encerradas = PROVAS_SIMULADAS.filter((p) => {
    const fim = new Date(p.dataFim.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))
    return new Date() > fim
  })

  function CardProva({ prova, icone: Icone, corIcone }) {
    const enviados  = prova.alunos.filter((a) => a.status === "enviado").length
    const comAlerta = prova.alunos.filter((a) => a.alertas > 0).length

    return (
      <div style={s.card} className="nexos-card" onClick={() => onVerDetalhe(prova)}>
        <div style={s.cardTopo}>
          <div style={{ ...s.cardIcone, background: corIcone + "18" }}>
            <Icone size={16} color={corIcone} />
          </div>
          <span style={s.cardTurma}>{prova.turma}</span>
        </div>

        <div style={s.cardTitulo}>{prova.titulo}</div>

        <div style={s.cardInfo}>
          <Clock size={11} color="var(--nexos-gray)" />
          <span>{prova.dataInicio} → {prova.dataFim.split(" ")[1]}</span>
        </div>

        <div style={s.cardRodape}>
          <div style={s.estatisticas}>
            <div style={s.stat}>
              <CheckCircle size={12} color="var(--nexos-blue)" />
              <span>{enviados}/{prova.totalAlunos}</span>
            </div>
            {comAlerta > 0 && (
              <div style={s.stat}>
                <AlertTriangle size={12} color="var(--nexos-error)" />
                <span>{comAlerta}</span>
              </div>
            )}
          </div>
          <button style={s.btnVer} className="nexos-icon-btn" onClick={() => onVerDetalhe(prova)}>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    )
  }

  function Secao({ titulo, provas, icone, corIcone }) {
    if (provas.length === 0) return null
    return (
      <div style={s.secao}>
        <div style={s.secaoTitulo}>
          {titulo}
        </div>
        <div style={s.secaoGrid}>
          {provas.map((p) => (
            <CardProva key={p.id} prova={p} icone={icone} corIcone={corIcone} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={s.cabecalho}>
        <div>
          <h1 style={s.titulo}>Provas</h1>
          <p style={s.subtitulo}>Gerencie e acompanhe suas avaliações</p>
        </div>
        <button style={s.btnCriar} className="nexos-btn" onClick={onCriar}>+ Nova prova</button>
      </div>

      <Secao titulo="Ativas"     provas={ativas}     icone={Zap}      corIcone="#105EDC" />
      <Secao titulo="Agendadas"  provas={agendadas}  icone={Calendar} corIcone="var(--nexos-navy)" />
      <Secao titulo="Encerradas" provas={encerradas} icone={Archive}  corIcone="var(--nexos-gray)" />
    </div>
  )
}

// ── Tela: Detalhe da prova ─────────────────────────────────────────────────
function DetalheProva({ prova, onVoltar, onExcluir, onLiberar }) {
  const [editando, setEditando] = useState(false)
  const [tituloEditado, setTituloEditado] = useState(prova.titulo)

  const agora = new Date()
  const fim = new Date(prova.dataFim.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1"))
  const encerrada = agora > fim

  function confirmarExclusao() {
    if (window.confirm(`Excluir "${prova.titulo}"? Essa ação não pode ser desfeita.`)) {
      onExcluir(prova.id)
      onVoltar()
    }
  }

  return (
    <div>
      <button style={s.btnVoltar} className="nexos-link" onClick={onVoltar}>
        <ArrowLeft size={16} /> Voltar
      </button>

      <div style={s.cabecalho}>
        <div style={{ flex: 1 }}>
          {editando ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "6px" }}>
              <input
                style={s.inputTitulo}
                value={tituloEditado}
                onChange={(e) => setTituloEditado(e.target.value)}
                autoFocus
              />
              <button style={s.btnSalvarInline} className="nexos-btn" onClick={() => setEditando(false)}>Salvar</button>
            </div>
          ) : (
            <h1 style={s.titulo}>{tituloEditado}</h1>
          )}
          <p style={s.subtitulo}>{prova.turma}</p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {encerrada && (
            <button
              style={{ ...s.btnAcaoSecundaria, ...(prova.liberada ? s.btnAcaoAtiva : {}) }}
              className="nexos-btn"
              onClick={() => onLiberar(prova.id)}
            >
              <Send size={14} /> {prova.liberada ? "Liberada para revisão" : "Liberar para revisão"}
            </button>
          )}
          <button style={s.btnAcaoSecundaria} className="nexos-btn" onClick={() => setEditando(true)}>
            <Pencil size={14} /> Editar
          </button>
          <button style={s.btnAcaoExcluir} className="nexos-btn" onClick={confirmarExclusao}>
            <Trash2 size={14} /> Excluir
          </button>
        </div>
      </div>

      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e0f0",
        borderRadius: "16px",
        padding: "48px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        marginTop: "8px",
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          background: "#eef1ff",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Eye size={22} color="var(--nexos-navy)" />
        </div>
        <p style={{ fontSize: "15px", fontWeight: "600", color: "var(--nexos-navy)", margin: 0 }}>
          Em desenvolvimento
        </p>
        <p style={{ fontSize: "13px", color: "#6b698a", margin: 0, textAlign: "center" }}>
          O painel detalhado de acompanhamento dos alunos estará disponível em breve.
        </p>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
function PainelProfessor({ usuario, onSair, onAtualizarUsuario }) {
  const [paginaAtiva, setPaginaAtiva] = useState("home")
  const [provas, setProvas] = useState(PROVAS_SIMULADAS)
  const [disciplinas, setDisciplinas] = useState(DISCIPLINAS_SIMULADAS)
  const [questoes, setQuestoes] = useState(QUESTOES_SIMULADAS)
  const [turmas, setTurmas] = useState(TURMAS_SIMULADAS)
  const [provaDetalhe, setProvaDetalhe] = useState(null)
  const [sidebarAberto, setSidebarAberto] = useState(true)
  const [turmasIniciarCriando, setTurmasIniciarCriando] = useState(false)
  const [disciplinasIniciarCriando, setDisciplinasIniciarCriando] = useState(false)
  const [questoesIniciarCriando, setQuestoesIniciarCriando] = useState(false)

  const marginLeft = sidebarAberto ? "220px" : "64px"

  function navegar(id, opcoes = {}) {
    setPaginaAtiva(id)
    setProvaDetalhe(null)
    setTurmasIniciarCriando(id === "turmas" && !!opcoes.criar)
    setDisciplinasIniciarCriando(id === "disciplinas" && !!opcoes.criar)
    setQuestoesIniciarCriando(id === "questoes" && !!opcoes.criar)
  }

  function excluirProva(id) {
    setProvas(provas.filter((p) => p.id !== id))
  }

  function liberarProva(id) {
    setProvas(provas.map((p) => (p.id === id ? { ...p, liberada: !p.liberada } : p)))
    setProvaDetalhe((atual) => (atual && atual.id === id ? { ...atual, liberada: !atual.liberada } : atual))
  }

  function tentarCriarProva() {
    if (disciplinas.length === 0) {
      window.alert("Você ainda não tem nenhuma disciplina cadastrada. Cadastre uma disciplina antes de criar uma prova.")
      navegar("disciplinas", { criar: true })
      return
    }
    window.alert("A criação de provas a partir daqui ainda está em construção — por enquanto, crie uma prova pela tela de uma turma.")
  }

  function renderConteudo() {
    if (paginaAtiva === "home") {
      return <PainelHome usuario={usuario} onNavegar={navegar} />
    }
    if (paginaAtiva === "disciplinas") {
      return (
        <MinhasDisciplinas
          disciplinas={disciplinas}
          setDisciplinas={setDisciplinas}
          iniciarCriando={disciplinasIniciarCriando}
        />
      )
    }
    if (paginaAtiva === "questoes") {
      return (
        <BancoDeQuestoes
          disciplinas={disciplinas}
          setDisciplinas={setDisciplinas}
          questoes={questoes}
          setQuestoes={setQuestoes}
          iniciarCriando={questoesIniciarCriando}
          onIrParaDisciplinas={() => navegar("disciplinas", { criar: true })}
        />
      )
    }
    if (paginaAtiva === "provas") {
      if (provaDetalhe) {
        return (
          <DetalheProva
            prova={provaDetalhe}
            onVoltar={() => setProvaDetalhe(null)}
            onExcluir={excluirProva}
            onLiberar={liberarProva}
          />
        )
      }
      return <ListaProvas provas={provas} onVerDetalhe={(p) => setProvaDetalhe(p)} onCriar={tentarCriarProva} />
    }
    if (paginaAtiva === "turmas") {
      return (
        <Turmas
          turmas={turmas}
          setTurmas={setTurmas}
          iniciarCriando={turmasIniciarCriando}
          onProvaSelecionada={() => (disciplinas.length === 0 ? tentarCriarProva() : navegar("provas"))}
        />
      )
    }
    if (paginaAtiva === "perfil") {
      return (
        <PerfilProfessor usuario={usuario} onAtualizarUsuario={onAtualizarUsuario} disciplinas={disciplinas} turmas={turmas} provas={provas} />
      )
    }
    return (
      <div style={s.placeholder}>
        <Eye size={32} color="#e2e0f0" />
        <p>Em construção</p>
      </div>
    )
  }

  return (
    <div style={s.layout}>
      <Sidebar
        paginaAtiva={paginaAtiva}
        onNavegar={(id) => navegar(id)}
        usuario={usuario}
        onSair={onSair}
        aberto={sidebarAberto}
        onToggle={() => setSidebarAberto(!sidebarAberto)}
        onAbrirPerfil={() => navegar("perfil")}
      />
      <main style={{ ...s.main, marginLeft, transition: "margin-left 0.2s ease" }}>
        {renderConteudo()}
      </main>
    </div>
  )
}

const s = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--nexos-bg)",
  },

  main: {
    flex: 1,
    padding: "36px 40px",
  },

  cabecalho: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
  },

  titulo: {
    fontSize: "22px",
    fontWeight: "700",
    color: "var(--nexos-navy)",
    margin: "0 0 4px",
  },

  subtitulo: {
    fontSize: "14px",
    color: "var(--nexos-gray)",
    margin: 0,
  },

  btnCriar: {
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 6px 18px rgba(16, 94, 220, 0.25)",
  },

  btnAcaoSecundaria: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    background: "#ffffff",
    color: "var(--nexos-navy)",
    border: "1.5px solid var(--nexos-border)",
    borderRadius: "10px",
    padding: "9px 16px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },

  btnAcaoAtiva: {
    background: "rgba(26,156,92,0.1)",
    borderColor: "#1a9c5c",
    color: "#1a9c5c",
  },

  btnAcaoExcluir: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    background: "#ffffff",
    color: "var(--nexos-error)",
    border: "1.5px solid rgba(178,58,58,0.3)",
    borderRadius: "10px",
    padding: "9px 16px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  inputTitulo: {
    fontSize: "22px",
    fontWeight: "700",
    color: "var(--nexos-navy)",
    border: "1.5px solid var(--nexos-blue)",
    borderRadius: "8px",
    padding: "4px 10px",
    fontFamily: "inherit",
    outline: "none",
  },

  btnSalvarInline: {
    background: "var(--nexos-blue)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  },

  secao: {
    border: "1px solid var(--nexos-border)",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    background: "rgba(255,255,255,.65)",
    backdropFilter: "blur(10px)",
  },

  secaoTitulo: {
    fontSize: "15px",
    fontWeight: "600",
    color: "var(--nexos-navy)",
    marginBottom: "16px",
  },

  secaoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },

  card: {
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid var(--nexos-border)",
    background: "rgba(255,255,255,.8)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  cardTopo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardIcone: {
    width: "32px",
    height: "32px",
    background: "rgba(5,20,51,.08)",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cardTitulo: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--nexos-navy)",
    lineHeight: "1.4",
  },

  cardTurma: {
    fontSize: "11px",
    color: "var(--nexos-gray)",
  },

  cardInfo: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    color: "var(--nexos-gray)",
  },

  cardRodape: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10px",
    borderTop: "1px solid var(--nexos-border)",
    marginTop: "2px",
  },

  estatisticas: {
    display: "flex",
    gap: "10px",
  },

  stat: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    color: "var(--nexos-gray)",
  },

  btnVer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(5,20,51,.08)",
    border: "1px solid var(--nexos-border)",
    color: "var(--nexos-navy)",
    borderRadius: "8px",
    width: "30px",
    height: "30px",
    cursor: "pointer",
  },

  btnVoltar: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "none",
    color: "var(--nexos-gray)",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: "20px",
    padding: 0,
  },

  resumoCard: {
    background: "rgba(255,255,255,.65)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid var(--nexos-border)",
    textAlign: "center",
  },

  resumoNumero: {
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--nexos-navy)",
    marginBottom: "4px",
  },

  resumoLabel: {
    fontSize: "13px",
    color: "var(--nexos-gray)",
  },

  tabelaWrapper: {
    background: "rgba(255,255,255,.65)",
    borderRadius: "14px",
    border: "1px solid var(--nexos-border)",
    overflow: "hidden",
  },

  tabela: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    textAlign: "left",
    padding: "14px 20px",
    fontSize: "12px",
    fontWeight: "600",
    color: "var(--nexos-gray)",
    background: "rgba(5,20,51,.04)",
    borderBottom: "1px solid var(--nexos-border)",
    letterSpacing: "0.04em",
  },

  tr: {
    borderBottom: "1px solid var(--nexos-border)",
  },

  td: {
    padding: "14px 20px",
    fontSize: "14px",
    color: "var(--nexos-navy)",
  },

  avatarPequeno: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "rgba(16,94,220,.12)",
    color: "var(--nexos-blue)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600",
  },

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
}

export default PainelProfessor