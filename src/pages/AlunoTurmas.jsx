import { useState, useEffect } from "react"
import {
  GraduationCap, Clock, User, Plus, X, Check, ArrowLeft, FileText, Users, ChevronRight,
} from "lucide-react"
import { turmaService } from "../services/api"

// ── Modal: entrar em turma ─────────────────────────────────────────────────
function ModalEntrarTurma({ onFechar, onEntrou }) {
  const [codigo, setCodigo] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")

  async function entrar() {
    if (!codigo.trim() || enviando) return
    setErro("")
    setEnviando(true)
    try {
      const turma = await turmaService.entrar(codigo.trim().toUpperCase())
      onEntrou(turma)
    } catch (err) {
      setErro(err.message || "Código inválido. Confira com seu professor.")
      setEnviando(false)
    }
  }

  return (
    <div style={s.overlay} onClick={onFechar}>
      <div style={s.modal} className="nexos-card" onClick={(e) => e.stopPropagation()}>
        <div style={s.modalCabecalho}>
          <h3 style={s.modalTitulo}>Entrar em uma turma</h3>
          <button style={s.btnIcone} className="nexos-icon-btn" onClick={onFechar}>
            <X size={16} color="var(--nexos-gray)" />
          </button>
        </div>
        <p style={s.modalTexto}>Peça o código da turma para o seu professor.</p>
        <input
          style={s.input}
          placeholder="Ex: K7X2MQP"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && entrar()}
          autoFocus
        />
        {erro && <p style={s.erro}>{erro}</p>}
        <button
          style={{ ...s.btnEntrar, opacity: codigo.trim() && !enviando ? 1 : 0.5 }}
          className="nexos-btn"
          onClick={entrar}
          disabled={!codigo.trim() || enviando}
        >
          <Check size={15} /> {enviando ? "Entrando..." : "Entrar na turma"}
        </button>
      </div>
    </div>
  )
}

// ── Aba: Pessoas da turma ──────────────────────────────────────────────────
function AbaPessoas({ turmaId }) {
  const [dados, setDados] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    setCarregando(true)
    setErro("")
    turmaService
      .listarPessoas(turmaId)
      .then(setDados)
      .catch((err) => setErro(err.message || "Não foi possível carregar as pessoas da turma."))
      .finally(() => setCarregando(false))
  }, [turmaId])

  if (carregando) return <div style={s.vazio}>Carregando pessoas...</div>
  if (erro) return <div style={s.vazio}>{erro}</div>

  const professor = dados?.professor
  const alunos = dados?.alunos || []

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <div style={s.pessoasCabecalho}>
          <span>Professor</span>
        </div>
        {professor ? (
          <div style={s.pessoaLinha}>
            <div style={s.pessoaAvatar}>{professor.nome.charAt(0).toUpperCase()}</div>
            <span style={s.pessoaNome}>{professor.nome}</span>
          </div>
        ) : (
          <div style={s.vazio}>Nenhum professor associado.</div>
        )}
      </div>

      <div>
        <div style={s.pessoasCabecalho}>
          <span>Colegas de turma</span>
          <span style={s.contadorPessoas}>{alunos.length}</span>
        </div>
        {alunos.length === 0 ? (
          <div style={s.vazio}>Nenhum outro aluno matriculado ainda.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {alunos.map((aluno) => (
              <div key={aluno.id} style={s.pessoaLinha}>
                <div style={s.pessoaAvatar}>{aluno.nome.charAt(0).toUpperCase()}</div>
                <span style={s.pessoaNome}>{aluno.nome}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Aba: Provas da turma ───────────────────────────────────────────────────
const STATUS_INFO = {
  pendente: { label: "Disponível", cor: "var(--nexos-blue)", bg: "var(--nexos-icon-bg)" },
  enviada: { label: "Aguardando correção", cor: "var(--nexos-gray)", bg: "var(--nexos-bg)" },
  liberada: { label: "Corrigida", cor: "#1a9c5c", bg: "rgba(26,156,92,0.12)" },
}

function AbaProvas({ turma, provas, onIrParaProva }) {
  const provasDaTurma = provas.filter((p) => p.turma === turma.nome)

  if (provasDaTurma.length === 0) {
    return <div style={s.vazio}>Nenhuma prova disponível para essa turma ainda.</div>
  }

  return (
    <div style={s.grid}>
      {provasDaTurma.map((prova) => {
        const info = STATUS_INFO[prova.status] || STATUS_INFO.pendente
        return (
          <div key={prova.id} style={s.card} className="nexos-card" onClick={() => onIrParaProva(prova)}>
            <div style={{ ...s.badge, color: info.cor, background: info.bg }}>{info.label}</div>
            <div style={s.cardTitulo}>{prova.titulo}</div>
            <div style={s.cardLinha} />
            <div style={s.cardInfo}>
              <Clock size={12} color="var(--nexos-gray)" />
              <span>{prova.dataInicio} → {prova.dataFim?.split(" ")[1]}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Tela: Detalhe da turma (visão do aluno) ────────────────────────────────
function DetalheTurmaAluno({ turma, provas, onVoltar, onIrParaProva }) {
  const [aba, setAba] = useState("provas")

  return (
    <div style={s.pagina}>
      <button style={s.btnVoltar} className="nexos-link" onClick={onVoltar}>
        <ArrowLeft size={14} /> Voltar
      </button>

      <div>
        <h1 style={s.tituloGrande}>{turma.nome}</h1>
        <div style={s.metaRow}>
          <div style={s.metaItem}>
            <GraduationCap size={14} color="var(--nexos-gray)" />
            <span>{turma.disciplina}</span>
          </div>
          <div style={s.metaItem}>
            <User size={14} color="var(--nexos-gray)" />
            <span>{turma.professorNome}</span>
          </div>
        </div>
        <div style={s.linhaCompleta} />
      </div>

      <div style={s.tabs}>
        <button
          style={{ ...s.tab, ...(aba === "provas" ? s.tabAtiva : {}) }}
          className="nexos-btn"
          onClick={() => setAba("provas")}
        >
          <FileText size={15} /> Provas
        </button>
        <button
          style={{ ...s.tab, ...(aba === "pessoas" ? s.tabAtiva : {}) }}
          className="nexos-btn"
          onClick={() => setAba("pessoas")}
        >
          <Users size={15} /> Pessoas
        </button>
      </div>

      {aba === "provas" && <AbaProvas turma={turma} provas={provas} onIrParaProva={onIrParaProva} />}
      {aba === "pessoas" && <AbaPessoas turmaId={turma.id} />}
    </div>
  )
}

// ── Tela: Lista de turmas ──────────────────────────────────────────────────
function ListaTurmas({ turmas, carregando, erro, onCriar, onAbrir }) {
  return (
    <div style={s.pagina}>
      <div style={s.cabecalho}>
        <div>
          <h1 style={s.titulo}>Minhas turmas</h1>
          <p style={s.subtitulo}>Turmas em que você está matriculado.</p>
        </div>
        <button style={s.btnCriar} className="nexos-btn" onClick={onCriar}>
          <Plus size={15} /> Entrar em turma
        </button>
      </div>

      {carregando ? (
        <div style={s.vazio}>Carregando turmas...</div>
      ) : erro ? (
        <div style={s.vazio}>{erro}</div>
      ) : turmas.length === 0 ? (
        <div style={s.vazio}>Você ainda não está em nenhuma turma. Use o código do professor para entrar.</div>
      ) : (
        <div style={s.grid}>
          {turmas.map((turma) => (
            <div key={turma.id} style={s.card} className="nexos-card" onClick={() => onAbrir(turma)}>
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
                <User size={12} /> {turma.professorNome}
              </div>
              <div style={s.verMais}>
                Ver turma <ChevronRight size={13} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
function AlunoTurmas({ turmas, provas, carregando, erro, onTurmaAdicionada, onIrParaProva }) {
  const [modalAberto, setModalAberto] = useState(false)
  const [turmaAtiva, setTurmaAtiva] = useState(null)

  if (turmaAtiva) {
    return (
      <DetalheTurmaAluno
        turma={turmaAtiva}
        provas={provas}
        onVoltar={() => setTurmaAtiva(null)}
        onIrParaProva={onIrParaProva}
      />
    )
  }

  return (
    <>
      <ListaTurmas
        turmas={turmas}
        carregando={carregando}
        erro={erro}
        onCriar={() => setModalAberto(true)}
        onAbrir={setTurmaAtiva}
      />

      {modalAberto && (
        <ModalEntrarTurma
          onFechar={() => setModalAberto(false)}
          onEntrou={(turma) => {
            onTurmaAdicionada(turma)
            setModalAberto(false)
          }}
        />
      )}
    </>
  )
}

const s = {
  pagina: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "1000px", margin: "0 auto" },
  cabecalho: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  titulo: { fontSize: "22px", fontWeight: "700", color: "var(--nexos-navy)", margin: "0 0 4px" },
  tituloGrande: { fontSize: "26px", fontWeight: "700", color: "var(--nexos-navy)", margin: "0 0 12px" },
  subtitulo: { fontSize: "13.5px", color: "var(--nexos-gray)", margin: 0 },
  btnCriar: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff", border: "none", borderRadius: "10px", padding: "10px 18px",
    fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
    boxShadow: "0 6px 16px rgba(16, 94, 220, 0.22)",
  },
  btnVoltar: { display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "var(--nexos-gray)", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", padding: 0 },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" },
  card: { background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px", padding: "20px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "8px" },
  cardIcone: { width: "34px", height: "34px", borderRadius: "10px", background: "var(--nexos-icon-bg)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" },
  cardTitulo: { fontSize: "14.5px", fontWeight: "600", color: "var(--nexos-navy)" },
  cardLinha: { height: "1px", background: "var(--nexos-border)", margin: "2px 0 4px" },
  cardInfo: { display: "flex", alignItems: "center", gap: "7px", fontSize: "12px", color: "var(--nexos-gray)" },
  verMais: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", fontWeight: "600", color: "var(--nexos-blue)", marginTop: "6px" },
  badge: { display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "11px", fontWeight: "600", padding: "4px 9px", borderRadius: "6px", alignSelf: "flex-start", marginBottom: "2px" },

  vazio: {
    fontSize: "13.5px", color: "var(--nexos-gray)", background: "var(--nexos-bg)",
    border: "1px dashed var(--nexos-border)", borderRadius: "12px", padding: "24px", textAlign: "center",
  },

  metaRow: { display: "flex", gap: "20px", marginBottom: "16px" },
  metaItem: { display: "flex", alignItems: "center", gap: "7px", fontSize: "13px", color: "var(--nexos-gray)" },
  linhaCompleta: { height: "1px", background: "var(--nexos-border)", marginBottom: "4px" },

  tabs: { display: "flex", gap: "8px", borderBottom: "1px solid var(--nexos-border)" },
  tab: {
    display: "flex", alignItems: "center", gap: "8px", background: "none", border: "none",
    borderBottom: "2px solid transparent", padding: "12px 18px", fontSize: "13.5px", fontWeight: "500",
    color: "var(--nexos-gray)", cursor: "pointer", fontFamily: "inherit", marginBottom: "-1px",
  },
  tabAtiva: { color: "var(--nexos-blue)", borderBottom: "2px solid var(--nexos-blue)", fontWeight: "600" },

  pessoasCabecalho: {
    display: "flex", alignItems: "center", gap: "8px",
    fontSize: "14px", fontWeight: "700", color: "var(--nexos-navy)", marginBottom: "10px",
  },
  contadorPessoas: {
    fontSize: "12px", fontWeight: "600", color: "var(--nexos-blue)",
    background: "var(--nexos-icon-bg)", borderRadius: "999px", padding: "1px 9px",
  },
  pessoaLinha: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "12px 4px", borderBottom: "1px solid var(--nexos-border)",
  },
  pessoaAvatar: {
    width: "32px", height: "32px", minWidth: "32px", borderRadius: "50%",
    background: "linear-gradient(135deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", fontWeight: "600",
  },
  pessoaNome: { fontSize: "13.5px", color: "var(--nexos-navy)" },

  overlay: {
    position: "fixed", inset: 0, background: "rgba(5,10,26,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 200, backdropFilter: "blur(2px)",
  },
  modal: {
    background: "#fff", borderRadius: "16px", padding: "26px", width: "360px",
    display: "flex", flexDirection: "column", gap: "14px",
    boxShadow: "0 24px 60px rgba(5,20,51,0.25)",
  },
  modalCabecalho: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalTitulo: { fontSize: "16px", fontWeight: "700", color: "var(--nexos-navy)", margin: 0 },
  modalTexto: { fontSize: "12.5px", color: "var(--nexos-gray)", margin: 0 },
  btnIcone: { background: "none", border: "none", cursor: "pointer", borderRadius: "8px", padding: "4px" },
  input: {
    background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px",
    padding: "10px 12px", fontSize: "14px", color: "var(--nexos-navy)", fontFamily: "inherit",
    outline: "none", textTransform: "uppercase", letterSpacing: "0.05em",
  },
  erro: { fontSize: "12.5px", color: "var(--nexos-error)", margin: 0 },
  btnEntrar: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff", border: "none", borderRadius: "10px", padding: "11px", fontSize: "13.5px",
    fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
  },
}

export default AlunoTurmas
