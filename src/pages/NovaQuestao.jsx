import { useState } from "react"
import { ChevronRight, ChevronDown, Plus, Check, X } from "lucide-react"
import { DIFICULDADES } from "../data/disciplinasSimuladas"
import AvisoSemDisciplina from "../components/AvisoSemDisciplina"
import ModalAdicionarRapido from "../components/ModalAdicionarRapido"

function NovaQuestao({ disciplinas, setDisciplinas, questaoInicial, onSalvar, onCancelar, onIrParaDisciplinas }) {
  const editando = !!questaoInicial
  const [disciplinaId, setDisciplinaId] = useState(questaoInicial ? String(questaoInicial.disciplinaId) : "")
  const [assuntoId, setAssuntoId] = useState(questaoInicial ? String(questaoInicial.assuntoId) : "")
  const [dificuldade, setDificuldade] = useState(questaoInicial?.dificuldade || "")
  const [enunciado, setEnunciado] = useState(questaoInicial?.enunciado || "")
  const [alternativas, setAlternativas] = useState(
    questaoInicial ? questaoInicial.alternativas.map((a) => a.texto) : ["", "", "", ""]
  )
  const [corretaIdx, setCorretaIdx] = useState(
    questaoInicial ? questaoInicial.alternativas.findIndex((a) => a.correta) : 0
  )
  const [modalDisciplina, setModalDisciplina] = useState(false)
  const [modalAssunto, setModalAssunto] = useState(false)

  if (disciplinas.length === 0) {
    return (
      <div style={s.pagina}>
        <h1 style={s.titulo}>Nova questão</h1>
        <AvisoSemDisciplina acao="cadastrar uma questão" onAdicionar={onIrParaDisciplinas} />
      </div>
    )
  }

  const disciplinaSelecionada = disciplinas.find((d) => d.id === Number(disciplinaId))
  const assuntosDisponiveis = disciplinaSelecionada?.assuntos || []

  function atualizarAlternativa(i, valor) {
    const novas = [...alternativas]
    novas[i] = valor
    setAlternativas(novas)
  }

  function handleNovaDisciplina(nome) {
    const nova = { id: Date.now(), nome, assuntos: [] }
    setDisciplinas([nova, ...disciplinas])
    setDisciplinaId(String(nova.id))
    setAssuntoId("")
    setModalDisciplina(false)
  }

  function handleNovoAssunto(nome) {
    const novoAssunto = { id: Date.now(), nome }
    setDisciplinas(disciplinas.map((d) =>
      d.id === Number(disciplinaId) ? { ...d, assuntos: [...d.assuntos, novoAssunto] } : d
    ))
    setAssuntoId(String(novoAssunto.id))
    setModalAssunto(false)
  }

  const valido =
    disciplinaId && assuntoId && dificuldade && enunciado.trim() &&
    alternativas.every((a) => a.trim())

  function salvar() {
    if (!valido) return
    const assunto = assuntosDisponiveis.find((a) => a.id === Number(assuntoId))
    onSalvar({
      id: questaoInicial?.id || Date.now(),
      enunciado: enunciado.trim(),
      disciplinaId: disciplinaSelecionada.id,
      disciplina: disciplinaSelecionada.nome,
      assuntoId: assunto.id,
      assunto: assunto.nome,
      dificuldade,
      dataPublicacao: questaoInicial?.dataPublicacao || new Date().toLocaleDateString("pt-BR"),
      alternativas: alternativas.map((texto, i) => ({ id: i + 1, texto: texto.trim(), correta: i === corretaIdx })),
      totalRespondentes: questaoInicial?.totalRespondentes || 0,
      percentualAcerto: questaoInicial?.percentualAcerto || 0,
    })
  }

  return (
    <div style={s.pagina}>
      <div style={s.breadcrumb}>
        <span>Banco de Questões</span>
        <ChevronRight size={12} />
        <span style={{ color: "var(--nexos-navy)" }}>{editando ? "Editar questão" : "Nova questão"}</span>
      </div>

      <h1 style={{ ...s.titulo, marginTop: "14px" }}>{editando ? "Editar questão" : "Nova questão"}</h1>
      <p style={s.subtitulo}>Preencha os dados e as alternativas da questão.</p>

      <div style={s.formCard} className="nexos-card">
        <div style={s.formRow}>
          <div style={s.campo}>
            <label style={s.campoLabel}>Disciplina<span style={{ color: "var(--nexos-blue)" }}> *</span></label>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <select
                  style={s.select}
                  value={disciplinaId}
                  onChange={(e) => { setDisciplinaId(e.target.value); setAssuntoId("") }}
                >
                  <option value="" disabled>Selecione</option>
                  {disciplinas.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
                <ChevronDown size={14} color="var(--nexos-gray)" style={s.selectIcone} />
              </div>
              <button style={s.btnMais} className="nexos-icon-btn" title="Nova disciplina" onClick={() => setModalDisciplina(true)}>
                <Plus size={16} color="var(--nexos-blue)" />
              </button>
            </div>
          </div>

          <div style={s.campo}>
            <label style={s.campoLabel}>Assunto<span style={{ color: "var(--nexos-blue)" }}> *</span></label>
            <div style={{ display: "flex", gap: "8px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <select
                  style={{ ...s.select, opacity: disciplinaId ? 1 : 0.5 }}
                  value={assuntoId}
                  onChange={(e) => setAssuntoId(e.target.value)}
                  disabled={!disciplinaId}
                >
                  <option value="" disabled>{disciplinaId ? "Selecione" : "Escolha a disciplina primeiro"}</option>
                  {assuntosDisponiveis.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                </select>
                <ChevronDown size={14} color="var(--nexos-gray)" style={s.selectIcone} />
              </div>
              <button
                style={{ ...s.btnMais, opacity: disciplinaId ? 1 : 0.5, cursor: disciplinaId ? "pointer" : "not-allowed" }}
                className="nexos-icon-btn"
                title="Novo assunto"
                onClick={() => disciplinaId && setModalAssunto(true)}
              >
                <Plus size={16} color="var(--nexos-blue)" />
              </button>
            </div>
          </div>
        </div>

        <div style={s.campo}>
          <label style={s.campoLabel}>Dificuldade<span style={{ color: "var(--nexos-blue)" }}> *</span></label>
          <div style={{ display: "flex", gap: "10px" }}>
            {DIFICULDADES.map((d) => (
              <button
                key={d.id}
                className="nexos-btn"
                style={{
                  ...s.pillDificuldade,
                  color: dificuldade === d.id ? "#fff" : d.cor,
                  background: dificuldade === d.id ? d.cor : d.bg,
                  borderColor: d.cor,
                }}
                onClick={() => setDificuldade(d.id)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div style={s.campo}>
          <label style={s.campoLabel}>Enunciado<span style={{ color: "var(--nexos-blue)" }}> *</span></label>
          <textarea
            style={s.textarea}
            placeholder="Digite o enunciado da questão..."
            value={enunciado}
            onChange={(e) => setEnunciado(e.target.value)}
          />
        </div>

        <div style={s.campo}>
          <label style={s.campoLabel}>Alternativas<span style={{ color: "var(--nexos-blue)" }}> *</span></label>
          <p style={s.dica}>Marque o círculo da alternativa correta.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {alternativas.map((alt, i) => (
              <div key={i} style={s.alternativaRow}>
                <button
                  style={{ ...s.radio, ...(corretaIdx === i ? s.radioAtivo : {}) }}
                  onClick={() => setCorretaIdx(i)}
                  title="Marcar como correta"
                >
                  {corretaIdx === i && <Check size={12} color="#fff" />}
                </button>
                <input
                  style={s.input}
                  placeholder={`Alternativa ${i + 1}`}
                  value={alt}
                  onChange={(e) => atualizarAlternativa(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={s.formBotoes}>
        <button style={s.btnCancelar} className="nexos-btn" onClick={onCancelar}>
          <X size={15} /> Cancelar
        </button>
        <button
          style={{ ...s.btnSalvar, opacity: valido ? 1 : 0.5, cursor: valido ? "pointer" : "not-allowed" }}
          className="nexos-btn"
          onClick={salvar}
        >
          <Check size={15} /> {editando ? "Salvar alterações" : "Salvar questão"}
        </button>
      </div>

      {modalDisciplina && (
        <ModalAdicionarRapido
          titulo="Nova disciplina"
          placeholder="Ex: Estrutura de Dados"
          onFechar={() => setModalDisciplina(false)}
          onSalvar={handleNovaDisciplina}
        />
      )}
      {modalAssunto && (
        <ModalAdicionarRapido
          titulo="Novo assunto"
          placeholder="Ex: Árvores binárias"
          onFechar={() => setModalAssunto(false)}
          onSalvar={handleNovoAssunto}
        />
      )}
    </div>
  )
}

const s = {
  pagina: { maxWidth: "700px", display: "flex", flexDirection: "column", gap: "4px" },
  breadcrumb: { display: "flex", alignItems: "center", gap: "8px", fontSize: "12.5px", color: "var(--nexos-gray)" },
  titulo: { fontSize: "22px", fontWeight: "700", color: "var(--nexos-navy)", margin: "0 0 4px" },
  subtitulo: { fontSize: "13.5px", color: "var(--nexos-gray)", margin: "0 0 24px" },

  formCard: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "14px",
    padding: "28px", display: "flex", flexDirection: "column", gap: "20px",
  },
  formRow: { display: "flex", gap: "16px" },
  campo: { flex: 1, display: "flex", flexDirection: "column", gap: "6px" },
  campoLabel: { fontSize: "12px", color: "var(--nexos-gray)" },
  dica: { fontSize: "11.5px", color: "var(--nexos-gray)", margin: "-2px 0 2px" },

  input: {
    background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px",
    padding: "9px 12px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit",
    outline: "none", width: "100%",
  },
  select: {
    background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px",
    padding: "9px 32px 9px 12px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit",
    outline: "none", width: "100%", appearance: "none", cursor: "pointer",
  },
  selectIcone: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" },
  btnMais: {
    width: "36px", height: "36px", flexShrink: 0, borderRadius: "8px",
    border: "1px solid var(--nexos-border)", background: "var(--nexos-icon-bg)",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },

  textarea: {
    background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px",
    padding: "10px 12px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit",
    outline: "none", minHeight: "80px", resize: "vertical",
  },

  pillDificuldade: {
    border: "1.5px solid", borderRadius: "999px", padding: "8px 18px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
  },

  alternativaRow: { display: "flex", alignItems: "center", gap: "10px" },
  radio: {
    width: "22px", height: "22px", minWidth: "22px", borderRadius: "50%",
    border: "2px solid var(--nexos-border)", background: "#fff", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  radioAtivo: { background: "#1a9c5c", borderColor: "#1a9c5c" },

  formBotoes: { display: "flex", justifyContent: "space-between", marginTop: "24px" },
  btnCancelar: {
    display: "flex", alignItems: "center", gap: "8px", background: "#fff", color: "var(--nexos-navy)",
    border: "1.5px solid var(--nexos-border)", borderRadius: "10px", padding: "10px 18px",
    fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
  },
  btnSalvar: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff", border: "none", borderRadius: "10px", padding: "10px 20px",
    fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
    boxShadow: "0 6px 16px rgba(16, 94, 220, 0.22)",
  },
}

export default NovaQuestao
