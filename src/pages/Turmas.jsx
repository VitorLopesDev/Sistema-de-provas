import { useState, useEffect } from "react"
import {
  Plus, X, Check, ChevronDown, ChevronRight, GraduationCap, Clock,
  FileText, Users, Settings, Calendar, Pencil, Archive, Copy, AlertTriangle, ArrowLeft,
} from "lucide-react"
import { TURNOS, NIVEIS } from "../data/turmasSimuladas"
import { PROVAS_SIMULADAS } from "../data/provasSimuladas"
import { turmaService } from "../services/api"

// ── Tela: Lista de turmas ──────────────────────────────────────────────────
function ListaTurmas({ turmas, carregando, erro, onVerDetalhe, onCriar }) {
  return (
    <div style={s.pagina}>
      <div style={s.cabecalho}>
        <div>
          <h1 style={s.titulo}>Turmas</h1>
          <p style={s.subtitulo}>Gerencie suas turmas e disciplinas</p>
        </div>
        <button style={s.btnCriar} className="nexos-btn" onClick={onCriar}>
          <Plus size={15} /> Nova turma
        </button>
      </div>

      {carregando ? (
        <div style={s.vazio}>Carregando turmas...</div>
      ) : erro ? (
        <div style={s.vazio}>{erro}</div>
      ) : turmas.length === 0 ? (
        <div style={s.vazio}>Nenhuma turma criada ainda.</div>
      ) : (
        <div style={s.grid}>
          {turmas.map((turma) => (
            <div key={turma.id} style={s.card} className="nexos-card" onClick={() => onVerDetalhe(turma)}>
              <div style={s.cardIcone}>
                <GraduationCap size={17} color="var(--nexos-blue)" />
              </div>
              <div style={s.cardTitulo}>{turma.disciplina}</div>
              <div style={s.cardLinha} />
              <div style={s.cardInfo}>{turma.nome}</div>
              <div style={s.cardInfo}>{turma.turno} · {turma.totalAlunos} alunos</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Tela: Criar turma ──────────────────────────────────────────────────────
function CriarTurma({ disciplinas, onCancelar, onCriar }) {
  const [nomeTurma, setNomeTurma] = useState("")
  const [disciplinaId, setDisciplinaId] = useState("")
  const [turno, setTurno] = useState("")
  const [nivel, setNivel] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")

  const valido = nomeTurma.trim() && disciplinaId && turno && nivel

  async function handleCriar() {
    if (!valido || enviando) return
    setErro("")
    setEnviando(true)

    const disciplina = disciplinas.find((d) => d.id === Number(disciplinaId))

    try {
      const turmaCriada = await turmaService.criar({
        nome: nomeTurma,
        disciplina: disciplina.nome,
        turno,
        nivel,
      })
      onCriar(turmaCriada)
    } catch (err) {
      setErro(err.message || "Não foi possível criar a turma.")
      setEnviando(false)
    }
  }

  return (
    <div style={s.paginaEstreita}>
      <div style={s.breadcrumb}>
        <span>Turmas</span>
        <ChevronRight size={12} />
        <span style={{ color: "var(--nexos-navy)" }}>Criar turma</span>
      </div>

      <div style={{ marginTop: "20px", marginBottom: "28px" }}>
        <h1 style={s.titulo}>Nova turma</h1>
        <p style={s.subtitulo}>Preencha os dados gerais para criar uma nova turma.</p>
      </div>

      <div style={s.formCard} className="nexos-card">
        <h3 style={s.formTitulo}>Dados da turma</h3>

        <div style={s.formRow}>
          <Campo label="Nome da turma" obrigatorio>
            <input
              style={s.input}
              placeholder="Ex: Ciência da Computação 2026.1"
              value={nomeTurma}
              onChange={(e) => setNomeTurma(e.target.value)}
            />
          </Campo>
          <Campo label="Turno" obrigatorio>
            <Select value={turno} onChange={setTurno} opcoes={TURNOS} placeholder="Selecione" />
          </Campo>
        </div>

        <div style={s.formRow}>
          <Campo label="Disciplina" obrigatorio>
            {disciplinas.length === 0 ? (
              <p style={{ fontSize: "12.5px", color: "var(--nexos-gray)", margin: 0 }}>
                Nenhuma disciplina cadastrada ainda.
              </p>
            ) : (
              <div style={{ position: "relative", width: "100%" }}>
                <select
                  style={s.select}
                  value={disciplinaId}
                  onChange={(e) => setDisciplinaId(e.target.value)}
                >
                  <option value="" disabled>Selecione</option>
                  {disciplinas.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
                <ChevronDown size={14} color="var(--nexos-gray)" style={s.selectIcone} />
              </div>
            )}
          </Campo>
          <Campo label="Nível" obrigatorio>
            <Select value={nivel} onChange={setNivel} opcoes={NIVEIS} placeholder="Selecione" />
          </Campo>
        </div>
      </div>

      {erro && <div style={s.erro}>{erro}</div>}

      <div style={s.formBotoes}>
        <button style={s.btnCancelar} className="nexos-btn" onClick={onCancelar}>
          <X size={15} /> Cancelar
        </button>
        <button
          style={{
            ...s.btnCriar,
            opacity: valido && !enviando ? 1 : 0.5,
            cursor: valido && !enviando ? "pointer" : "not-allowed",
          }}
          className="nexos-btn"
          onClick={handleCriar}
        >
          <Check size={15} /> {enviando ? "Criando..." : "Criar turma"}
        </button>
      </div>
    </div>
  )
}

function Campo({ label, obrigatorio, children }) {
  return (
    <div style={s.campo}>
      <label style={s.campoLabel}>{label}{obrigatorio && <span style={{ color: "var(--nexos-blue)" }}> *</span>}</label>
      {children}
    </div>
  )
}

function Select({ value, onChange, opcoes, placeholder }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        style={s.select}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>{placeholder}</option>
        {opcoes.map((op) => <option key={op} value={op}>{op}</option>)}
      </select>
      <ChevronDown size={14} color="var(--nexos-gray)" style={s.selectIcone} />
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

  if (carregando) {
    return <div style={s.vazio}>Carregando pessoas...</div>
  }

  if (erro) {
    return <div style={s.vazio}>{erro}</div>
  }

  const professor = dados?.professor
  const alunos = dados?.alunos || []

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      <div>
        <div style={s.pessoasCabecalho}>
          <span>Professores</span>
          <span style={s.contadorPessoas}>{professor ? 1 : 0}</span>
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
          <span>Alunos</span>
          <span style={s.contadorPessoas}>{alunos.length}</span>
        </div>
        {alunos.length === 0 ? (
          <div style={s.vazio}>Nenhum aluno matriculado nessa turma ainda.</div>
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

// ── Campo editável individual (nome/turno/nível/disciplina) ────────────────
function CampoEditavel({ label, valor, tipo = "texto", opcoes, onSalvar }) {
  const [editando, setEditando] = useState(false)
  const [valorEditado, setValorEditado] = useState(valor)
  const [salvando, setSalvando] = useState(false)

  async function salvar() {
    if (!valorEditado.trim() || salvando) return
    setSalvando(true)
    try {
      await onSalvar(valorEditado)
      setEditando(false)
    } catch (err) {
      window.alert(err.message || "Não foi possível salvar a alteração.")
    } finally {
      setSalvando(false)
    }
  }

  if (editando) {
    return (
      <div style={s.configCampo}>
        <span style={s.configLabel}>{label}:</span>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {tipo === "select" ? (
            <div style={{ position: "relative" }}>
              <select
                style={s.configSelect}
                value={valorEditado}
                onChange={(e) => setValorEditado(e.target.value)}
                autoFocus
              >
                {opcoes.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
              <ChevronDown size={13} color="var(--nexos-gray)" style={s.configSelectIcone} />
            </div>
          ) : (
            <input
              style={s.configInput}
              value={valorEditado}
              onChange={(e) => setValorEditado(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && salvar()}
              autoFocus
            />
          )}
          <button style={s.configBtnIcone} onClick={salvar} title="Salvar" disabled={salvando}>
            <Check size={13} color="#1a9c5c" />
          </button>
          <button style={s.configBtnIcone} onClick={() => { setValorEditado(valor); setEditando(false) }} title="Cancelar">
            <X size={13} color="var(--nexos-gray)" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.configCampo}>
      <span style={s.configLabel}>{label}:</span>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={s.configValor}>{valor}</span>
        <button style={s.configBtnIcone} onClick={() => setEditando(true)} title={`Editar ${label.toLowerCase()}`}>
          <Pencil size={12} color="var(--nexos-gray)" />
        </button>
      </div>
    </div>
  )
}

function ModalConfirmarArquivar({ nomeTurma, onCancelar, onConfirmar, arquivando }) {
  return (
    <div style={s.overlay} onClick={onCancelar}>
      <div style={s.modalConfirmar} className="nexos-card" onClick={(e) => e.stopPropagation()}>
        <div style={s.modalIcone}>
          <AlertTriangle size={22} color="#b8860b" />
        </div>
        <h3 style={s.modalTitulo}>Arquivar turma?</h3>
        <p style={s.modalTexto}>
          A turma <strong>{nomeTurma}</strong> deixará de aparecer como ativa, mas o histórico de provas e alunos será preservado.
        </p>
        <div style={s.modalBotoes}>
          <button style={s.btnCancelarModal} className="nexos-btn" onClick={onCancelar} disabled={arquivando}>
            Cancelar
          </button>
          <button style={s.btnConfirmarArquivar} className="nexos-btn" onClick={onConfirmar} disabled={arquivando}>
            <Archive size={14} /> {arquivando ? "Arquivando..." : "Arquivar turma"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Aba: Configurações da turma ────────────────────────────────────────────
function AbaConfiguracoes({ turma, disciplinas, onAtualizarTurma, onArquivada }) {
  const [copiado, setCopiado] = useState(false)
  const [arquivando, setArquivando] = useState(false)
  const [modalArquivarAberto, setModalArquivarAberto] = useState(false)

  async function salvarCampo(campo, valor) {
    const dados = {
      nome: turma.nome,
      disciplina: turma.disciplina,
      turno: turma.turno,
      nivel: turma.nivel,
      [campo]: valor,
    }
    const turmaAtualizada = await turmaService.atualizar(turma.id, dados)
    onAtualizarTurma(turmaAtualizada)
  }

  function copiarCodigo() {
    if (!turma.codigo) return
    navigator.clipboard.writeText(turma.codigo)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function confirmarArquivar() {
    setArquivando(true)
    try {
      await turmaService.arquivar(turma.id)
      onArquivada(turma.id)
    } catch (err) {
      window.alert(err.message || "Não foi possível arquivar a turma.")
      setArquivando(false)
      setModalArquivarAberto(false)
    }
  }

  return (
    <div>
      <div style={s.configCabecalho}>
        <h2 style={s.subtituloSecao}>Configurações</h2>
        <button style={s.btnArquivar} className="nexos-btn" onClick={() => setModalArquivarAberto(true)}>
          <Archive size={14} /> Arquivar turma
        </button>
      </div>

      <div style={s.configGrid}>
        <CampoEditavel
          label="Nome da turma"
          valor={turma.nome}
          onSalvar={(v) => salvarCampo("nome", v)}
        />
        <CampoEditavel
          label="Turno"
          valor={turma.turno}
          tipo="select"
          opcoes={TURNOS}
          onSalvar={(v) => salvarCampo("turno", v)}
        />
        <CampoEditavel
          label="Disciplina"
          valor={turma.disciplina}
          tipo="select"
          opcoes={disciplinas.map((d) => d.nome)}
          onSalvar={(v) => salvarCampo("disciplina", v)}
        />
        <CampoEditavel
          label="Nível"
          valor={turma.nivel}
          tipo="select"
          opcoes={NIVEIS}
          onSalvar={(v) => salvarCampo("nivel", v)}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <span style={s.configLabel}>Código da turma:</span>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
          <span style={s.codigoBox}>{turma.codigo || "—"}</span>
          {turma.codigo && (
            <button style={s.configBtnIcone} onClick={copiarCodigo} title="Copiar código">
              {copiado ? <Check size={14} color="#1a9c5c" /> : <Copy size={14} color="var(--nexos-gray)" />}
            </button>
          )}
        </div>
      </div>
      
      {modalArquivarAberto && (
        <ModalConfirmarArquivar
          nomeTurma={turma.nome}
          arquivando={arquivando}
          onCancelar={() => setModalArquivarAberto(false)}
          onConfirmar={confirmarArquivar}
        />
      )}
    </div>
  )
}

// ── Tela: Detalhe da turma ─────────────────────────────────────────────────
function DetalheTurma({ turma, provas, disciplinas, onNovaProva, onAtualizarTurma, onArquivada, onVoltar }) {
  const [aba, setAba] = useState("provas")
  const [filtro, setFiltro] = useState("todas")

  const provasDaTurma = provas.filter((p) => p.turmaId === turma.id)

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
            <Clock size={14} color="var(--nexos-gray)" />
            <span>{turma.turno}</span>
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
        <button
          style={{ ...s.tab, ...(aba === "config" ? s.tabAtiva : {}) }}
          className="nexos-btn"
          onClick={() => setAba("config")}
        >
          <Settings size={15} /> Configurações
        </button>
      </div>

      {aba === "provas" && (
        <>
          <div style={s.provasHeader}>
            <h2 style={s.subtituloSecao}>Provas</h2>
            <button style={s.btnCriar} className="nexos-btn" onClick={() => onNovaProva(turma.id)}>
              <Plus size={15} /> Nova prova
            </button>
          </div>

          <div style={s.filtros}>
            {[["todas", "Todas"], ["ativas", "Ativas"], ["arquivadas", "Arquivadas"]].map(([id, label]) => (
              <button
                key={id}
                className="nexos-btn"
                style={{ ...s.filtro, ...(filtro === id ? s.filtroAtivo : {}) }}
                onClick={() => setFiltro(id)}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={s.grid}>
            {provasDaTurma.map((prova) => (
              <div key={prova.id} style={s.card} className="nexos-card">
                <div style={s.cardTitulo}>{prova.titulo}</div>
                <div style={s.cardLinha} />
                <div style={s.cardInfo}>
                  <GraduationCap size={13} color="var(--nexos-gray)" style={{ marginRight: "6px" }} />
                  {turma.nome}
                </div>
                <div style={s.cardInfo}>
                  <Calendar size={13} color="var(--nexos-gray)" style={{ marginRight: "6px" }} />
                  {prova.dataInicio} → {prova.dataFim.split(" ")[1]}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {aba === "pessoas" && <AbaPessoas turmaId={turma.id} />}
      {aba === "config" && (<AbaConfiguracoes turma={turma} disciplinas={disciplinas} onAtualizarTurma={onAtualizarTurma} onArquivada={onArquivada}/>)}
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
function Turmas({ turmas, setTurmas, disciplinas, provas, carregando, erro, iniciarCriando, onProvaSelecionada }) {
  const [modo, setModo] = useState(iniciarCriando ? "criar" : "lista")
  const [turmaAtiva, setTurmaAtiva] = useState(null)

  if (modo === "criar") {
    return (
      <CriarTurma
        disciplinas={disciplinas}
        onCancelar={() => setModo("lista")}
        onCriar={(novaTurma) => {
          setTurmas([novaTurma, ...turmas])
          setTurmaAtiva(novaTurma)
          setModo("detalhe")
        }}
      />
    )
  }

  if (modo === "detalhe" && turmaAtiva) {
    return (
      <DetalheTurma
        turma={turmaAtiva}
        provas={provas}
        disciplinas={disciplinas}
        onNovaProva={onProvaSelecionada}
        onAtualizarTurma={(turmaAtualizada) => {
          setTurmas(turmas.map((t) => (t.id === turmaAtualizada.id ? turmaAtualizada : t)))
          setTurmaAtiva(turmaAtualizada)
        }}
        onArquivada={(turmaId) => {
          setTurmas(turmas.filter((t) => t.id !== turmaId))
          setModo("lista")
          setTurmaAtiva(null)
        }}
        onVoltar={() => { setModo("lista"); setTurmaAtiva(null) }}
      />
    )
  }

  return (
    <ListaTurmas
      turmas={turmas}
      carregando={carregando}
      erro={erro}
      onCriar={() => setModo("criar")}
      onVerDetalhe={(turma) => { setTurmaAtiva(turma); setModo("detalhe") }}
    />
  )
}

const s = {
  pagina: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  paginaEstreita: {
    maxWidth: "760px",
    margin: "0 auto",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "12.5px",
    color: "var(--nexos-gray)",
  },
  cabecalho: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titulo: {
    fontSize: "22px",
    fontWeight: "700",
    color: "var(--nexos-navy)",
    margin: "0 0 4px",
  },
  tituloGrande: {
    fontSize: "26px",
    fontWeight: "700",
    color: "var(--nexos-navy)",
    margin: "0 0 12px",
  },
  subtitulo: {
    fontSize: "13.5px",
    color: "var(--nexos-gray)",
    margin: 0,
  },
  metaRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "16px",
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "13px",
    color: "var(--nexos-gray)",
  },
  linhaCompleta: {
    height: "1px",
    background: "var(--nexos-border)",
    marginBottom: "4px",
  },
  btnCriar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 18px",
    fontSize: "13.5px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 6px 16px rgba(16, 94, 220, 0.22)",
  },
  btnCancelar: {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  background: "#fff",
  color: "var(--nexos-navy)",
  border: "1.5px solid var(--nexos-border)",
  borderRadius: "10px",
  padding: "10px 18px",
  fontSize: "13.5px",
  fontWeight: "600",
  cursor: "pointer",
  fontFamily: "inherit",
  },
  btnCancelarModal: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  background: "#fff",
  color: "var(--nexos-navy)",
  border: "1.5px solid var(--nexos-border)",
  borderRadius: "10px",
  padding: "10px 18px",
  fontSize: "13.5px",
  fontWeight: "600",
  cursor: "pointer",
  fontFamily: "inherit",
  flex: 1,
  },
  btnVoltar: {
  display: "flex", alignItems: "center", gap: "6px",
  background: "none", border: "none", color: "var(--nexos-gray)",
  fontSize: "13px", cursor: "pointer", fontFamily: "inherit", padding: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#fff",
    border: "1px solid var(--nexos-border)",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  cardIcone: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "var(--nexos-icon-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "4px",
  },
  cardTitulo: {
    fontSize: "14.5px",
    fontWeight: "600",
    color: "var(--nexos-navy)",
  },
  cardLinha: {
    height: "1px",
    background: "var(--nexos-border)",
    margin: "2px 0 4px",
  },
  cardInfo: {
    display: "flex",
    alignItems: "center",
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
  formCard: {
    background: "#fff",
    border: "1px solid var(--nexos-border)",
    borderRadius: "14px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  formTitulo: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--nexos-navy)",
    margin: 0,
  },
  formRow: {
    display: "flex",
    gap: "16px",
  },
  campo: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  campoLabel: {
    fontSize: "12px",
    color: "var(--nexos-gray)",
  },
  input: {
    background: "var(--nexos-bg)",
    border: "1px solid var(--nexos-border)",
    borderRadius: "8px",
    padding: "9px 12px",
    fontSize: "13.5px",
    color: "var(--nexos-navy)",
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
  },
  select: {
    background: "var(--nexos-bg)",
    border: "1px solid var(--nexos-border)",
    borderRadius: "8px",
    padding: "9px 32px 9px 12px",
    fontSize: "13.5px",
    color: "var(--nexos-navy)",
    fontFamily: "inherit",
    outline: "none",
    width: "100%",
    appearance: "none",
    cursor: "pointer",
  },
  selectIcone: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
  },
  formBotoes: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "24px",
  },
  erro: {
    fontSize: "13px",
    color: "#d33",
    marginTop: "-8px",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    borderBottom: "1px solid var(--nexos-border)",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "12px 18px",
    fontSize: "13.5px",
    fontWeight: "500",
    color: "var(--nexos-gray)",
    cursor: "pointer",
    fontFamily: "inherit",
    marginBottom: "-1px",
  },
  tabAtiva: {
    color: "var(--nexos-blue)",
    borderBottom: "2px solid var(--nexos-blue)",
    fontWeight: "600",
  },
  provasHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px",
  },
  subtituloSecao: {
    fontSize: "17px",
    fontWeight: "700",
    color: "var(--nexos-navy)",
    margin: 0,
  },
  filtros: {
    display: "flex",
    gap: "10px",
  },
  filtro: {
    background: "var(--nexos-bg)",
    border: "1px solid var(--nexos-border)",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "500",
    color: "var(--nexos-gray)",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  filtroAtivo: {
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff",
    border: "1px solid transparent",
  },
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
  configCabecalho: {
    display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px",
  },
  btnArquivar: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#fff", color: "var(--nexos-navy)", border: "1.5px solid var(--nexos-border)",
    borderRadius: "10px", padding: "9px 16px", fontSize: "13px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit",
  },
  configGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px",
  },
  configCampo: { display: "flex", flexDirection: "column", gap: "4px" },
  configLabel: { fontSize: "12px", fontWeight: "600", color: "var(--nexos-gray)" },
  configValor: { fontSize: "14px", color: "var(--nexos-navy)" },
  configBtnIcone: {
    background: "none", border: "none", cursor: "pointer", padding: "3px",
    display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px",
  },
  configInput: {
    background: "var(--nexos-bg)", border: "1.5px solid var(--nexos-blue)", borderRadius: "6px",
    padding: "6px 10px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit",
    outline: "none",
  },
  configSelect: {
    background: "var(--nexos-bg)", border: "1.5px solid var(--nexos-blue)", borderRadius: "6px",
    padding: "6px 28px 6px 10px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit",
    outline: "none", appearance: "none", cursor: "pointer",
  },
  configSelectIcone: { position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" },
  codigoBox: {
    background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px",
    padding: "8px 14px", fontSize: "13.5px", fontWeight: "600", color: "var(--nexos-navy)",
    fontFamily: "monospace", letterSpacing: "0.03em",
  },
  overlay: {
    position: "fixed", inset: 0, background: "rgba(5,10,26,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 200, backdropFilter: "blur(2px)",
  },
  modalConfirmar: {
    background: "#fff", borderRadius: "16px", padding: "28px", width: "380px",
    display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "8px",
    boxShadow: "0 24px 60px rgba(5,20,51,0.25)",
  },
  modalIcone: {
    width: "44px", height: "44px", borderRadius: "12px", background: "rgba(184,134,11,0.14)",
    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "6px",
  },
  modalTitulo: { fontSize: "16px", fontWeight: "700", color: "var(--nexos-navy)", margin: 0 },
  modalTexto: { fontSize: "13px", color: "var(--nexos-gray)", lineHeight: 1.6, margin: "0 0 12px" },
  modalBotoes: { display: "flex", gap: "10px", width: "100%" },
  btnConfirmarArquivar: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flex: 1,
    background: "var(--nexos-error)", color: "#fff", border: "none",
    borderRadius: "10px", padding: "10px", fontSize: "13.5px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit",
  },
}

export default Turmas