import { useState } from "react"
import Sidebar from "../components/Sidebar"
import { Clock, AlertTriangle, CheckCircle, XCircle, ChevronRight, ArrowLeft, Eye, FileText, Zap, Calendar, Archive } from "lucide-react"

// Dados simulados — depois substituído pela API
const PROVAS_SIMULADAS = [
  {
    id: 1,
    titulo: "Banco de Dados I — Prova 2",
    turma: "P5 — Ciência da Computação",
    dataInicio: "07/07/2025 08:00",
    dataFim: "07/07/2025 09:30",
    tempoLimite: 90,
    totalAlunos: 5,
    alunos: [
      { id: 1, nome: "Maria Souza",    status: "enviado",    horarioEnvio: "08:47",  alertas: 0 },
      { id: 2, nome: "João Pedro",     status: "enviado",    horarioEnvio: "09:12",  alertas: 2 },
      { id: 3, nome: "Ana Lima",       status: "enviado",    horarioEnvio: "09:30",  alertas: 0 },
      { id: 4, nome: "Carlos Silva",   status: "pendente",   horarioEnvio: null,     alertas: 1 },
      { id: 5, nome: "Beatriz Costa",  status: "pendente",   horarioEnvio: null,     alertas: 0 },
    ],
  },
  {
    id: 2,
    titulo: "Linguagem de Programação II — Prova 2",
    turma: "P3 — Ciência da Computação",
    dataInicio: "06/07/2025 10:00",
    dataFim: "06/07/2025 11:00",
    tempoLimite: 60,
    totalAlunos: 4,
    alunos: [
      { id: 1, nome: "Lucas Mendes",   status: "enviado",    horarioEnvio: "10:45",  alertas: 0 },
      { id: 2, nome: "Fernanda Rocha", status: "enviado",    horarioEnvio: "10:58",  alertas: 3 },
      { id: 3, nome: "Rafael Torres",  status: "enviado",    horarioEnvio: "11:00",  alertas: 1 },
      { id: 4, nome: "Julia Neves",    status: "enviado",    horarioEnvio: "10:32",  alertas: 0 },
    ],
  },
  {
    id: 3,
    titulo: "Estrutura de Dados — Prova 1",
    turma: "P4 — Ciência da Computação",
    dataInicio: "10/07/2025 14:00",
    dataFim: "10/07/2025 15:30",
    tempoLimite: 90,
    totalAlunos: 6,
    alunos: [],
  },
]

// ── Tela: Lista de provas ──────────────────────────────────────────────────
function ListaProvas({ onVerDetalhe }) {
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
      <div style={s.card}>
        <div style={s.cardTopo}>
          <div style={{ ...s.cardIcone, background: corIcone + "18" }}>
            <Icone size={16} color={corIcone} />
          </div>
          <span style={s.cardTurma}>{prova.turma}</span>
        </div>

        <div style={s.cardTitulo}>{prova.titulo}</div>

        <div style={s.cardInfo}>
          <Clock size={11} color="#6b698a" />
          <span>{prova.dataInicio} → {prova.dataFim.split(" ")[1]}</span>
        </div>

        <div style={s.cardRodape}>
          <div style={s.estatisticas}>
            <div style={s.stat}>
              <CheckCircle size={12} color="#00e88f" />
              <span>{enviados}/{prova.totalAlunos}</span>
            </div>
            {comAlerta > 0 && (
              <div style={s.stat}>
                <AlertTriangle size={12} color="#ff8b3d" />
                <span>{comAlerta}</span>
              </div>
            )}
          </div>
          <button style={s.btnVer} onClick={() => onVerDetalhe(prova)}>
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
        <button style={s.btnCriar}>+ Nova prova</button>
      </div>

      <Secao titulo="Ativas"     provas={ativas}     icone={Zap}      corIcone="#462bff" />
      <Secao titulo="Agendadas"  provas={agendadas}  icone={Calendar} corIcone="#00e88f" />
      <Secao titulo="Encerradas" provas={encerradas} icone={Archive}  corIcone="#6b698a" />
    </div>
  )
}

// ── Tela: Detalhe da prova ─────────────────────────────────────────────────
function DetalheProva({ prova, onVoltar }) {
  return (
    <div>
      <button style={s.btnVoltar} onClick={onVoltar}>
        <ArrowLeft size={16} /> Voltar
      </button>

      <div style={s.cabecalho}>
        <div>
          <h1 style={s.titulo}>{prova.titulo}</h1>
          <p style={s.subtitulo}>{prova.turma}</p>
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
          <Eye size={22} color="#040220" />
        </div>
        <p style={{ fontSize: "15px", fontWeight: "600", color: "#040220", margin: 0 }}>
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
function PainelProfessor({ usuario, onSair }) {
  const [paginaAtiva, setPaginaAtiva] = useState("provas")
  const [provaDetalhe, setProvaDetalhe] = useState(null)
  const [sidebarAberto, setSidebarAberto] = useState(true)

  const marginLeft = sidebarAberto ? "220px" : "64px"

  function renderConteudo() {
    if (paginaAtiva === "provas") {
      if (provaDetalhe) {
        return <DetalheProva prova={provaDetalhe} onVoltar={() => setProvaDetalhe(null)} />
      }
      return <ListaProvas onVerDetalhe={(p) => setProvaDetalhe(p)} />
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
        onNavegar={(id) => { setPaginaAtiva(id); setProvaDetalhe(null) }}
        usuario={usuario}
        onSair={onSair}
        aberto={sidebarAberto}
        onToggle={() => setSidebarAberto(!sidebarAberto)}
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
    background: "#f5f4fd",
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
    color: "#040220",
    margin: "0 0 4px",
  },
  subtitulo: {
    fontSize: "14px",
    color: "#6b698a",
    margin: 0,
  },
  btnCriar: {
    background: "linear-gradient(135deg, #040220 0%, #15123c 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  secao: {
    border: "1px solid #e2e0f0",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "20px",
    background: "#ffffff",
  },
  secaoTitulo: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#040220",
    marginBottom: "16px",
    letterSpacing: "0.01em",
  },
  secaoDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  secaoContagem: {
    background: "#f5f4fd",
    color: "#6b698a",
    borderRadius: "20px",
    padding: "1px 8px",
    fontSize: "12px",
    fontWeight: "500",
  },
  secaoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },
  card: {
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #e2e0f0",
    background: "#ffffff",
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
    background: "#f2f0ff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitulo: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#040220",
    lineHeight: "1.4",
  },
  cardTurma: {
    fontSize: "11px",
    color: "#8b89b0",
  },
  cardInfo: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    color: "#6b698a",
  },
  cardRodape: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "10px",
    borderTop: "1px solid #f0eef8",
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
    color: "#6b698a",
  },
  btnVer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eef1ff",
    border: "1px solid #d9defc",
    color: "#040220",
    borderRadius: "8px",
    width: "30px",
    height: "30px",
    cursor: "all .2s ease",
  },
  //
  badge: {
    borderRadius: "20px",
    padding: "3px 12px",
    fontSize: "12px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },
  badgeAtiva: {
    background: "#00e88f22",
    color: "#007a4d",
  },
  badgeEncerrada: {
    background: "#ebebf5",
    color: "#6b698a",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#6b698a",
  },
  btnVoltar: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "none",
    border: "none",
    color: "#6b698a",
    fontSize: "14px",
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: "20px",
    padding: 0,
  },
  resumoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "28px",
  },
  resumoCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e2e0f0",
    textAlign: "center",
  },
  resumoNumero: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#040220",
    marginBottom: "4px",
  },
  resumoLabel: {
    fontSize: "13px",
    color: "#6b698a",
  },
  tabelaWrapper: {
    background: "#ffffff",
    borderRadius: "14px",
    border: "1px solid #e2e0f0",
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
    color: "#6b698a",
    background: "#f5f4fd",
    borderBottom: "1px solid #e2e0f0",
    letterSpacing: "0.04em",
  },
  tr: {
    borderBottom: "1px solid #f0eef8",
  },
  td: {
    padding: "14px 20px",
    fontSize: "14px",
    color: "#040220",
  },
  alunoNome: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatarPequeno: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#e8e5ff",
    color: "#462bff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "600",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "12px",
    fontWeight: "500",
  },
  placeholder: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    height: "300px",
    color: "#6b698a",
    fontSize: "14px",
  },
}

export default PainelProfessor