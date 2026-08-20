import { useState } from "react"
import { Library, Plus, X, ChevronDown, Pencil, Trash2, Check } from "lucide-react"
import { disciplinaService, assuntoService } from "../services/api"

const TEMAS = [
  { icone: "var(--nexos-blue)", bg: "var(--nexos-icon-bg)" },
  { icone: "var(--nexos-purple)", bg: "rgba(83,58,220,0.08)" },
  { icone: "var(--nexos-cyan)", bg: "rgba(10,167,246,0.08)" },
]

// ── Formulário: nova disciplina + assuntos ─────────────────────────────────
function FormNovaDisciplina({ onCancelar, onSalvar }) {
  const [nome, setNome] = useState("")
  const [assuntos, setAssuntos] = useState([""])
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")

  function atualizarAssunto(i, valor) {
    const novos = [...assuntos]
    novos[i] = valor
    setAssuntos(novos)
  }

  function removerAssunto(i) {
    setAssuntos(assuntos.filter((_, idx) => idx !== i))
  }

  const valido = nome.trim().length > 0

  async function salvar() {
    if (!valido || enviando) return
    setErro("")
    setEnviando(true)

    try {
      const disciplinaCriada = await disciplinaService.criar({ nome: nome.trim() })

      const nomesAssuntos = assuntos.map((a) => a.trim()).filter(Boolean)
      const assuntosCriados = []
      for (const nomeAssunto of nomesAssuntos) {
        assuntosCriados.push(await assuntoService.criar(disciplinaCriada.id, { nome: nomeAssunto }))
      }

      onSalvar({ ...disciplinaCriada, assuntos: assuntosCriados })
    } catch (err) {
      setErro(err.message || "Não foi possível salvar a disciplina.")
      setEnviando(false)
    }
  }

  return (
    <div style={s.formCard} className="nexos-card">
      <h3 style={s.formTitulo}>Nova disciplina</h3>

      <div style={s.campo}>
        <label style={s.campoLabel}>Nome da disciplina<span style={{ color: "var(--nexos-blue)" }}> *</span></label>
        <input
          style={s.input}
          placeholder="Ex: Linguagem de Programação II"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          autoFocus
        />
      </div>

      <div style={s.campo}>
        <label style={s.campoLabel}>Assuntos da disciplina</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {assuntos.map((assunto, i) => (
            <div key={i} style={{ display: "flex", gap: "8px" }}>
              <input
                style={s.input}
                placeholder={`Ex: ${i === 0 ? "Ponteiros" : "Recursão"}`}
                value={assunto}
                onChange={(e) => atualizarAssunto(i, e.target.value)}
              />
              {assuntos.length > 1 && (
                <button style={s.btnRemoverLinha} className="nexos-icon-btn" onClick={() => removerAssunto(i)}>
                  <X size={15} color="var(--nexos-gray)" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button style={s.btnAddAssunto} className="nexos-link" onClick={() => setAssuntos([...assuntos, ""])}>
          <Plus size={13} /> Adicionar assunto
        </button>
      </div>

      {erro && <p style={s.erro}>{erro}</p>}

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
          onClick={salvar}
        >
          <Check size={15} /> {enviando ? "Salvando..." : "Salvar disciplina"}
        </button>
      </div>
    </div>
  )
}

// ── Um assunto dentro do acordeão (com editar/excluir) ─────────────────────
function ChipAssunto({ assunto, tema, onEditar, onExcluir }) {
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(assunto.nome)

  function salvar() {
    if (nome.trim()) {
      onEditar(nome.trim())
      setEditando(false)
    }
  }

  if (editando) {
    return (
      <div style={{ ...s.assuntoChip, ...s.assuntoChipEditando, borderColor: tema.icone }}>
        <input
          style={s.assuntoInput}
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && salvar()}
          autoFocus
        />
        <button style={s.assuntoIconeBtn} onClick={salvar} title="Salvar">
          <Check size={12} color="#1a9c5c" />
        </button>
      </div>
    )
  }

  return (
    <div style={{ ...s.assuntoChip, borderColor: tema.icone }}>
      {assunto.nome}
      <button style={s.assuntoIconeBtn} onClick={() => setEditando(true)} title="Editar assunto">
        <Pencil size={11} color="var(--nexos-gray)" />
      </button>
      <button style={s.assuntoIconeBtn} onClick={onExcluir} title="Excluir assunto">
        <X size={12} color="var(--nexos-error)" />
      </button>
    </div>
  )
}

// ── Linha para adicionar um novo assunto dentro do acordeão ────────────────
function AdicionarAssuntoInline({ tema, onAdicionar }) {
  const [aberto, setAberto] = useState(false)
  const [nome, setNome] = useState("")

  function salvar() {
    if (nome.trim()) {
      onAdicionar(nome.trim())
      setNome("")
      setAberto(false)
    }
  }

  if (!aberto) {
    return (
      <button style={{ ...s.assuntoChip, ...s.assuntoChipAdicionar, borderColor: tema.icone, color: tema.icone }} onClick={() => setAberto(true)}>
        <Plus size={12} /> Adicionar assunto
      </button>
    )
  }

  return (
    <div style={{ ...s.assuntoChip, ...s.assuntoChipEditando, borderColor: tema.icone }}>
      <input
        style={s.assuntoInput}
        placeholder="Nome do assunto"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && salvar()}
        autoFocus
      />
      <button style={s.assuntoIconeBtn} onClick={salvar} title="Salvar">
        <Check size={12} color="#1a9c5c" />
      </button>
    </div>
  )
}
function LinhaDisciplina({ disciplina, tema, aberta, onToggle, onEditar, onExcluir, onEditarAssunto, onExcluirAssunto, onAdicionarAssunto }) {
  const [editando, setEditando] = useState(false)
  const [nomeEditado, setNomeEditado] = useState(disciplina.nome)

  function confirmarExclusao(e) {
    e.stopPropagation()
    if (window.confirm(`Excluir a disciplina "${disciplina.nome}"? Os assuntos cadastrados também serão removidos.`)) {
      onExcluir(disciplina.id)
    }
  }

  function salvarEdicao(e) {
    e.stopPropagation()
    if (nomeEditado.trim()) {
      onEditar(disciplina.id, nomeEditado.trim())
      setEditando(false)
    }
  }

  return (
    <div style={s.linhaWrap}>
      <div style={s.linha} className="nexos-card" onClick={onToggle}>
        <div style={{ ...s.linhaIcone, background: tema.bg }}>
          <Library size={17} color={tema.icone} />
        </div>

        {editando ? (
          <input
            style={s.inputInline}
            value={nomeEditado}
            onChange={(e) => setNomeEditado(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <div style={s.linhaNome}>{disciplina.nome}</div>
        )}

        <div style={s.linhaAssuntosCount}>
          {disciplina.assuntos.length} {disciplina.assuntos.length === 1 ? "assunto" : "assuntos"}
        </div>

        {editando ? (
          <button style={s.btnSalvarInline} className="nexos-btn" onClick={salvarEdicao}>Salvar</button>
        ) : (
          <>
            <button
              style={s.btnIconeLinha}
              className="nexos-icon-btn"
              onClick={(e) => { e.stopPropagation(); setEditando(true) }}
              title="Editar"
            >
              <Pencil size={14} color="var(--nexos-gray)" />
            </button>
            <button style={s.btnIconeLinha} className="nexos-icon-btn" onClick={confirmarExclusao} title="Excluir">
              <Trash2 size={14} color="var(--nexos-error)" />
            </button>
          </>
        )}

        <ChevronDown
          size={16}
          color="var(--nexos-gray)"
          style={{ transform: aberta ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .25s ease" }}
        />
      </div>

      <div style={{ ...s.acordeao, gridTemplateRows: aberta ? "1fr" : "0fr" }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ ...s.acordeaoConteudo, background: tema.bg }}>
            <div style={s.assuntosGrid}>
              {disciplina.assuntos.map((assunto) => (
                <ChipAssunto
                  key={assunto.id}
                  assunto={assunto}
                  tema={tema}
                  onEditar={(novoNome) => onEditarAssunto(disciplina.id, assunto.id, novoNome)}
                  onExcluir={() => onExcluirAssunto(disciplina.id, assunto.id)}
                />
              ))}
              <AdicionarAssuntoInline tema={tema} onAdicionar={(nome) => onAdicionarAssunto(disciplina.id, nome)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
function MinhasDisciplinas({ disciplinas, setDisciplinas, carregando, erro, iniciarCriando }) {
  const [criando, setCriando] = useState(!!iniciarCriando)
  const [abertaId, setAbertaId] = useState(null)

  function handleSalvar(novaDisciplina) {
    setDisciplinas([novaDisciplina, ...disciplinas])
    setCriando(false)
  }

  async function handleEditar(id, novoNome) {
    try {
      const atualizada = await disciplinaService.atualizar(id, { nome: novoNome })
      setDisciplinas(disciplinas.map((d) => (d.id === id ? { ...d, nome: atualizada.nome } : d)))
    } catch (err) {
      window.alert(err.message || "Não foi possível editar a disciplina.")
    }
  }

  async function handleExcluir(id) {
    try {
      await disciplinaService.deletar(id)
      setDisciplinas(disciplinas.filter((d) => d.id !== id))
      if (abertaId === id) setAbertaId(null)
    } catch (err) {
      window.alert(err.message || "Não foi possível excluir a disciplina.")
    }
  }

  async function handleEditarAssunto(disciplinaId, assuntoId, novoNome) {
    try {
      const atualizado = await assuntoService.atualizar(assuntoId, { nome: novoNome })
      setDisciplinas(disciplinas.map((d) =>
        d.id === disciplinaId
          ? { ...d, assuntos: d.assuntos.map((a) => (a.id === assuntoId ? { ...a, nome: atualizado.nome } : a)) }
          : d
      ))
    } catch (err) {
      window.alert(err.message || "Não foi possível editar o assunto.")
    }
  }

  async function handleExcluirAssunto(disciplinaId, assuntoId) {
    try {
      await assuntoService.deletar(assuntoId)
      setDisciplinas(disciplinas.map((d) =>
        d.id === disciplinaId ? { ...d, assuntos: d.assuntos.filter((a) => a.id !== assuntoId) } : d
      ))
    } catch (err) {
      window.alert(err.message || "Não foi possível excluir o assunto.")
    }
  }

  async function handleAdicionarAssunto(disciplinaId, nome) {
    try {
      const novoAssunto = await assuntoService.criar(disciplinaId, { nome })
      setDisciplinas(disciplinas.map((d) =>
        d.id === disciplinaId ? { ...d, assuntos: [...d.assuntos, novoAssunto] } : d
      ))
    } catch (err) {
      window.alert(err.message || "Não foi possível adicionar o assunto.")
    }
  }

  return (
    <div style={s.pagina}>
      <div style={s.cabecalho}>
        <div>
          <h1 style={s.titulo}>Minhas Disciplinas</h1>
          <p style={s.subtitulo}>Cadastre suas disciplinas e os assuntos de cada uma.</p>
        </div>
        {!criando && (
          <button style={s.btnCriar} className="nexos-btn" onClick={() => setCriando(true)}>
            <Plus size={15} /> Nova disciplina
          </button>
        )}
      </div>

      {criando && <FormNovaDisciplina onCancelar={() => setCriando(false)} onSalvar={handleSalvar} />}

      {carregando ? (
        <div style={s.vazio}>Carregando disciplinas...</div>
      ) : erro ? (
        <div style={s.vazio}>{erro}</div>
      ) : disciplinas.length === 0 && !criando ? (
        <div style={s.vazio}>Nenhuma disciplina cadastrada ainda.</div>
      ) : (
        <div style={s.lista}>
          {disciplinas.map((disciplina, i) => (
            <LinhaDisciplina
              key={disciplina.id}
              disciplina={disciplina}
              tema={TEMAS[i % TEMAS.length]}
              aberta={abertaId === disciplina.id}
              onToggle={() => setAbertaId(abertaId === disciplina.id ? null : disciplina.id)}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
              onEditarAssunto={handleEditarAssunto}
              onExcluirAssunto={handleExcluirAssunto}
              onAdicionarAssunto={handleAdicionarAssunto}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const s = {
  pagina: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "820px", margin: "0 auto" },
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
  btnCancelar: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#fff", color: "var(--nexos-navy)", border: "1.5px solid var(--nexos-border)",
    borderRadius: "10px", padding: "10px 18px", fontSize: "13.5px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit",
  },

  vazio: {
    fontSize: "13.5px", color: "var(--nexos-gray)", background: "var(--nexos-bg)",
    border: "1px dashed var(--nexos-border)", borderRadius: "12px", padding: "24px", textAlign: "center",
  },

  formCard: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "14px",
    padding: "26px", display: "flex", flexDirection: "column", gap: "18px",
  },
  formTitulo: { fontSize: "16px", fontWeight: "600", color: "var(--nexos-navy)", margin: 0 },
  campo: { display: "flex", flexDirection: "column", gap: "8px" },
  campoLabel: { fontSize: "12px", color: "var(--nexos-gray)" },
  input: {
    background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px",
    padding: "9px 12px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit",
    outline: "none", width: "100%",
  },
  btnRemoverLinha: { background: "none", border: "none", cursor: "pointer", borderRadius: "8px", padding: "8px" },
  btnAddAssunto: {
    display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none",
    color: "var(--nexos-blue)", fontSize: "12.5px", fontWeight: "600", cursor: "pointer",
    fontFamily: "inherit", padding: 0, width: "fit-content",
  },
  formBotoes: { display: "flex", justifyContent: "space-between", marginTop: "6px" },
  erro: { fontSize: "13px", color: "#d33", margin: 0 },

  lista: { display: "flex", flexDirection: "column", gap: "12px" },
  linhaWrap: {},
  linha: {
    display: "flex", alignItems: "center", gap: "14px", background: "#fff",
    border: "1px solid var(--nexos-border)", borderRadius: "12px", padding: "14px 16px", cursor: "pointer",
  },
  linhaIcone: {
    width: "36px", height: "36px", borderRadius: "10px", display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  linhaNome: { fontSize: "14.5px", fontWeight: "600", color: "var(--nexos-navy)", flex: 1 },
  inputInline: {
    flex: 1, fontSize: "14.5px", fontWeight: "600", color: "var(--nexos-navy)",
    border: "1.5px solid var(--nexos-blue)", borderRadius: "6px", padding: "4px 8px",
    fontFamily: "inherit", outline: "none",
  },
  linhaAssuntosCount: { fontSize: "12px", color: "var(--nexos-gray)", whiteSpace: "nowrap" },
  btnIconeLinha: { background: "none", border: "none", cursor: "pointer", borderRadius: "8px", padding: "6px" },
  btnSalvarInline: {
    background: "var(--nexos-blue)", color: "#fff", border: "none", borderRadius: "8px",
    padding: "7px 14px", fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
  },

  acordeao: { display: "grid", transition: "grid-template-rows .3s ease" },
  acordeaoConteudo: { borderRadius: "12px", padding: "18px", marginTop: "8px" },
  assuntosGrid: { display: "flex", flexWrap: "wrap", gap: "8px" },
  assuntoChip: {
    display: "flex", alignItems: "center", gap: "6px",
    background: "#fff", border: "1.5px solid", borderRadius: "999px",
    padding: "6px 8px 6px 14px", fontSize: "12.5px", fontWeight: "500", color: "var(--nexos-navy)",
  },
  assuntoChipEditando: { padding: "4px 4px 4px 10px" },
  assuntoChipAdicionar: {
    background: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: "600",
  },
  assuntoInput: {
    border: "none", outline: "none", fontSize: "12.5px", fontFamily: "inherit",
    color: "var(--nexos-navy)", width: "110px", background: "transparent",
  },
  assuntoIconeBtn: {
    background: "none", border: "none", cursor: "pointer", padding: "3px",
    display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%",
  },
}

export default MinhasDisciplinas