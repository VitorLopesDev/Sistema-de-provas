import { useState, useMemo } from "react"
import { createPortal } from "react-dom"
import {
  Check, X, ChevronDown, Search, Plus, Pencil, FileText, Eye, AlertTriangle,
} from "lucide-react"
import { provaService } from "../services/api"

const ETAPAS = ["Dados da prova", "Configurações da prova", "Questões", "Revisão/Publicação"]
const DURACOES = [30, 45, 60, 90, 120, 150, 180]

// ── Indicador de progresso ─────────────────────────────────────────────────
function StepIndicator({ etapaAtual, onIrPara }) {
  return (
    <div style={s.stepper}>
      {ETAPAS.map((label, i) => {
        const concluida = i < etapaAtual
        const ativa = i === etapaAtual
        const destacada = ativa || concluida
        const clicavel = i <= etapaAtual

        return (
          <div key={label} style={s.stepColuna}>
            <div style={s.stepLinhaRow}>
              <div style={{ ...s.stepLinha, opacity: i === 0 ? 0 : 1, ...(i <= etapaAtual ? s.stepLinhaAtiva : {}) }} />
              <button
                type="button"
                disabled={!clicavel}
                onClick={() => clicavel && onIrPara(i)}
                style={{
                  ...s.stepDot,
                  ...(destacada ? s.stepDotAtiva : {}),
                  cursor: clicavel ? "pointer" : "default",
                }}
              />
              <div style={{ ...s.stepLinha, opacity: i === ETAPAS.length - 1 ? 0 : 1, ...(i < etapaAtual ? s.stepLinhaAtiva : {}) }} />
            </div>
            <span style={{ ...s.stepLabel, ...(destacada ? s.stepLabelAtiva : {}) }}>{label}</span>
          </div>
        )
      })}
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

function Select({ value, onChange, opcoes, placeholder, disabled }) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <select
        style={{ ...s.select, opacity: disabled ? 0.5 : 1 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>{placeholder}</option>
        {opcoes.map((op) => <option key={op.valor} value={op.valor}>{op.label}</option>)}
      </select>
      <ChevronDown size={14} color="var(--nexos-gray)" style={s.selectIcone} />
    </div>
  )
}

// ── Etapa 1: Dados da prova ────────────────────────────────────────────────
function EtapaDados({ dados, setDados, disciplinas, turmas }) {
   const disciplinaSelecionada = disciplinas.find((d) => String(d.id) === String(dados.disciplinaId))

  const turmasDaDisciplina = useMemo(
    () => turmas.filter((t) => t.disciplina === disciplinaSelecionada?.nome),
    [turmas, disciplinaSelecionada]
  )

  return (
    <div style={s.formCard} className="nexos-card">
      <Campo label="Nome da prova" obrigatorio>
        <input
          style={s.input}
          placeholder="Ex: Linguagem de Programação II - Unidade I"
          value={dados.titulo}
          onChange={(e) => setDados({ ...dados, titulo: e.target.value })}
        />
      </Campo>

      <div style={s.formRow}>
        <Campo label="Disciplina" obrigatorio>
          <Select
            value={dados.disciplinaId}
            onChange={(v) => setDados({ ...dados, disciplinaId: v, turmaId: "" })}
            opcoes={disciplinas.map((d) => ({ valor: String(d.id), label: d.nome }))}
            placeholder="Selecione"
          />
        </Campo>
        <Campo label="Turma" obrigatorio>
          <Select
            value={dados.turmaId}
            onChange={(v) => setDados({ ...dados, turmaId: v })}
            opcoes={turmasDaDisciplina.map((t) => ({ valor: String(t.id), label: t.nome }))}
            placeholder={dados.disciplinaId ? "Selecione" : "Escolha a disciplina primeiro"}
            disabled={!dados.disciplinaId}
          />
        </Campo>
      </div>

      <Campo label="Instruções para a prova (opcional)">
        <textarea
          style={s.textarea}
          placeholder="Ex: Não saia da tela nem troque de aba durante a realização..."
          value={dados.instrucoes}
          onChange={(e) => setDados({ ...dados, instrucoes: e.target.value })}
        />
      </Campo>
    </div>
  )
}

// ── Etapa 2: Configurações da prova ────────────────────────────────────────
function EtapaConfiguracoes({ config, setConfig }) {
  return (
    <>
      <div style={s.formCard} className="nexos-card">
        <Campo label="Tempo limite da prova" obrigatorio>
          <Select
            value={config.tempoLimite}
            onChange={(v) => setConfig({ ...config, tempoLimite: v })}
            opcoes={DURACOES.map((d) => ({ valor: String(d), label: `${d} minutos` }))}
            placeholder="Selecione"
          />
        </Campo>

        <Campo label="Data e hora" obrigatorio>
          <div style={s.dataHoraGrid}>
            <span style={s.dataHoraRotulo}>Início:</span>
            <input type="date" style={s.input} value={config.dataInicio} onChange={(e) => setConfig({ ...config, dataInicio: e.target.value })} />
            <input type="time" style={s.input} value={config.horaInicio} onChange={(e) => setConfig({ ...config, horaInicio: e.target.value })} />

            <span style={s.dataHoraRotulo}>Fim:</span>
            <input type="date" style={s.input} value={config.dataFim} onChange={(e) => setConfig({ ...config, dataFim: e.target.value })} />
            <input type="time" style={s.input} value={config.horaFim} onChange={(e) => setConfig({ ...config, horaFim: e.target.value })} />
          </div>
        </Campo>

        <Campo label="Modo de aplicação" obrigatorio>
          <button
            type="button"
            style={s.toggleWrapper}
            onClick={() => setConfig({ ...config, modoSeguro: !config.modoSeguro })}
          >
            <div style={{ ...s.toggleTrack, ...(config.modoSeguro ? s.toggleTrackAtiva : {}) }}>
              <div style={{ ...s.toggleBola, ...(config.modoSeguro ? s.toggleBolaAtiva : {}) }} />
            </div>
            <span style={s.toggleTexto}>Ativar tela cheia + monitoramento</span>
          </button>
        </Campo>
      </div>

      <div style={s.aviso}>
        <AlertTriangle size={20} color="#C77A09" strokeWidth={2.2} style={s.avisoIcone} />
        <div style={s.avisoConteudo}>
            <span style={s.avisoTitulo}>O envio das respostas é automático. </span>
            <span style={s.avisoTexto}>Ao fim do tempo limite, as respostas do aluno serão registradas, independentemente de ele ter concluído a prova ou não.</span>
        </div>
      </div>
    </>
  )
}

// ── Etapa 3: Seleção de questões ───────────────────────────────────────────
function EtapaQuestoes({ questoes, disciplinas, questoesIds, setQuestoesIds, disciplinaIdInicial }) {
  const [busca, setBusca] = useState("")
  const [assuntoFiltro, setAssuntoFiltro] = useState("")
  const [dificuldadeFiltro, setDificuldadeFiltro] = useState("")

  const disciplinaSelecionada = disciplinas.find((d) => String(d.id) === String(disciplinaIdInicial))
  const assuntosDisponiveis = disciplinaSelecionada?.assuntos || []

  const filtradas = useMemo(() => {
    return questoes.filter((q) => {
      if (String(q.disciplinaId) !== String(disciplinaIdInicial)) return false
      if (assuntoFiltro && String(q.assuntoId) !== assuntoFiltro) return false
      if (dificuldadeFiltro && q.dificuldade !== dificuldadeFiltro) return false
      if (busca && !q.enunciado.toLowerCase().includes(busca.toLowerCase())) return false
      return true
    })
  }, [questoes, disciplinaIdInicial, assuntoFiltro, dificuldadeFiltro, busca])

  function alternar(id) {
    setQuestoesIds(questoesIds.includes(id) ? questoesIds.filter((x) => x !== id) : [...questoesIds, id])
  }

  return (
    <>
      <div style={s.formCard} className="nexos-card">
        <h3 style={s.formTitulo}>Buscar questões</h3>
        <div style={s.buscaBox}>
          <Search size={15} color="var(--nexos-gray)" />
          <input
            style={s.buscaInput}
            placeholder="Buscar por palavra-chave..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <div style={s.formRow}>
          <Campo label="Assunto">
            <Select
              value={assuntoFiltro}
              onChange={setAssuntoFiltro}
              opcoes={[{ valor: "", label: "Todos" }, ...assuntosDisponiveis.map((a) => ({ valor: String(a.id), label: a.nome }))]}
              placeholder="Todos"
            />
          </Campo>
          <Campo label="Dificuldade">
            <Select
              value={dificuldadeFiltro}
              onChange={setDificuldadeFiltro}
              opcoes={[
                { valor: "facil", label: "Fácil" },
                { valor: "media", label: "Média" },
                { valor: "dificil", label: "Difícil" },
              ]}
              placeholder="Todas"
            />
          </Campo>
        </div>
      </div>

      <p style={s.dica}>{questoesIds.length} questão(ões) selecionada(s)</p>

      {filtradas.length === 0 ? (
        <div style={s.vazio}>Nenhuma questão encontrada com esses filtros.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filtradas.map((q) => {
            const marcada = questoesIds.includes(q.id)
            return (
              <div key={q.id} style={{ ...s.questaoCard, ...(marcada ? s.questaoCardAtiva : {}) }} className="nexos-card">
                <div style={s.questaoCabecalho}>
                  <span style={s.questaoMeta}>{q.disciplina} › {q.assunto}</span>
                  <button
                    type="button"
                    style={{ ...s.btnAdicionar, ...(marcada ? s.btnAdicionarAtivo : {}) }}
                    className="nexos-btn"
                    onClick={() => alternar(q.id)}
                  >
                    {marcada ? <><Check size={14} /> Adicionada</> : <><Plus size={14} /> Adicionar à prova</>}
                  </button>
                </div>
                <p style={s.questaoEnunciado}>{q.enunciado}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {q.alternativas.map((alt) => (
                    <div key={alt.id} style={{ ...s.alternativa, ...(alt.correta ? s.alternativaCorreta : {}) }}>
                      {alt.correta && <Check size={13} color="#1a9c5c" />}
                      <span>{alt.texto}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

//* Nova funcionalidade
function PreviewProva({ dados, config, questoesSelecionadas, disciplinas, turmas, onFechar }) {
  const disciplina = disciplinas.find((d) => String(d.id) === String(dados.disciplinaId))
  const turma = turmas.find((t) => String(t.id) === String(dados.turmaId))

  return createPortal(
    <div style={s.previewOverlay} onClick={onFechar}>
      <div style={s.previewPagina} onClick={(e) => e.stopPropagation()}>

        <div style={s.previewTopo}>
          <span style={s.previewTag}>Pré-visualização — visão do aluno</span>
          <button style={s.previewBtnFechar} className="nexos-btn" onClick={onFechar}>
            <X size={15} /> Fechar pré-visualização
          </button>
        </div>

        <div style={s.previewConteudo}>

          <div style={s.previewCabecalhoCard} className="nexos-card">
            <div style={s.previewAlunoRow}>
              <div style={s.previewAvatar}>A</div>
              <div>
                <div style={s.previewAlunoLabel}>Nome do aluno</div>
                <div style={s.previewAlunoNome}>Aluno Exemplo</div>
              </div>
            </div>

            <div style={s.previewLinha} />

            <h1 style={s.previewTitulo}>{dados.titulo || "Sem título"}</h1>

            <div style={s.previewMetaGrid}>
              <div style={s.previewMetaItem}>
                <span style={s.previewMetaLabel}>Disciplina</span>
                <span style={s.previewMetaValor}>{disciplina?.nome || "—"}</span>
              </div>
              <div style={s.previewMetaItem}>
                <span style={s.previewMetaLabel}>Turma</span>
                <span style={s.previewMetaValor}>{turma?.nome || "—"}</span>
              </div>
              <div style={s.previewMetaItem}>
                <span style={s.previewMetaLabel}>Tempo limite</span>
                <span style={s.previewMetaValor}>{config.tempoLimite ? `${config.tempoLimite} minutos` : "—"}</span>
              </div>
              <div style={s.previewMetaItem}>
                <span style={s.previewMetaLabel}>Disponível</span>
                <span style={s.previewMetaValor}>
                  {config.dataInicio && config.horaInicio ? `${config.dataInicio} ${config.horaInicio}` : "—"}
                  {" → "}
                  {config.dataFim && config.horaFim ? `${config.dataFim} ${config.horaFim}` : "—"}
                </span>
              </div>
            </div>

            {dados.instrucoes && (
              <>
                <div style={s.previewLinha} />
                <div>
                  <div style={s.previewMetaLabel}>Instruções</div>
                  <p style={s.previewInstrucoes}>{dados.instrucoes}</p>
                </div>
              </>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {questoesSelecionadas.length === 0 ? (
              <div style={s.previewVazio}>Nenhuma questão selecionada ainda.</div>
            ) : (
              questoesSelecionadas.map((q, i) => (
                <div key={q.id} style={s.previewQuestaoCard} className="nexos-card">
                  <div style={s.previewQuestaoNumero}>Questão {i + 1}</div>
                  <p style={s.previewEnunciado}>{q.enunciado}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {q.alternativas.map((alt, idx) => (
                      <label key={alt.id} style={s.previewAlternativa}>
                        <span style={s.previewAlternativaLetra}>{String.fromCharCode(65 + idx)}</span>
                        <span>{alt.texto}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>,
    document.body
  )
}

// ── Etapa 4: Revisão e publicação ──────────────────────────────────────────
function EtapaRevisao({ dados, config, questoesIds, disciplinas, turmas, questoes, onIrPara }) {
  const [previewAberto, setPreviewAberto] = useState(false)
  const disciplina = disciplinas.find((d) => String(d.id) === String(dados.disciplinaId))
  const turma = turmas.find((t) => String(t.id) === String(dados.turmaId))
  const questoesSelecionadas = questoes.filter((q) => questoesIds.includes(q.id))

  return (
    <div style={s.formCard} className="nexos-card">
      <div style={s.revisaoSecao}>
        <div style={s.revisaoSecaoCabecalho}>
          <h3 style={s.formTitulo}>Dados da prova</h3>
          <button style={s.btnEditar} className="nexos-icon-btn" onClick={() => onIrPara(0)}><Pencil size={14} /></button>
        </div>
        <div style={s.formRow}>
          <RevisaoItem label="Nome da prova" valor={dados.titulo} />
          <RevisaoItem label="Disciplina" valor={disciplina?.nome} />
          <RevisaoItem label="Turma" valor={turma?.nome} />
        </div>
        {dados.instrucoes && <RevisaoItem label="Instruções" valor={dados.instrucoes} bloco />}
      </div>

      <div style={s.linha} />

      <div style={s.revisaoSecao}>
        <div style={s.revisaoSecaoCabecalho}>
          <h3 style={s.formTitulo}>Configurações da prova</h3>
          <button style={s.btnEditar} className="nexos-icon-btn" onClick={() => onIrPara(1)}><Pencil size={14} /></button>
        </div>
        <div style={s.formRow}>
          <RevisaoItem label="Tempo limite" valor={`${config.tempoLimite} minutos`} />
          <RevisaoItem label="Início" valor={`${config.dataInicio} ${config.horaInicio}`} />
          <RevisaoItem label="Fim" valor={`${config.dataFim} ${config.horaFim}`} />
        </div>
        <RevisaoItem label="Modo de aplicação" valor={config.modoSeguro ? "Tela cheia + monitoramento ativado" : "Desativado"} />
      </div>

      <div style={s.linha} />

      <div style={s.revisaoSecao}>
        <div style={s.revisaoSecaoCabecalho}>
          <h3 style={s.formTitulo}>Questões da prova</h3>
          <button style={s.btnEditar} className="nexos-icon-btn" onClick={() => onIrPara(2)}><Pencil size={14} /></button>
        </div>
        <div style={s.revisaoQuestoes}>
          <FileText size={15} color="var(--nexos-blue)" />
          <span>{questoesIds.length} questão(ões) selecionada(s)</span>
        </div>
        <button style={s.btnPreview} className="nexos-btn" onClick={() => setPreviewAberto(true)}>
          <Eye size={14} /> Pré-visualizar como aluno
        </button>
      </div>

      {previewAberto && (
        <PreviewProva
          dados={dados}
          config={config}
          questoesSelecionadas={questoesSelecionadas}
          disciplinas={disciplinas}
          turmas={turmas}
          onFechar={() => setPreviewAberto(false)}
        />
      )}
    </div>
  )
}

function RevisaoItem({ label, valor, bloco }) {
  return (
    <div style={{ flex: bloco ? "none" : 1, width: bloco ? "100%" : "auto" }}>
      <div style={s.revisaoLabel}>{label}</div>
      <div style={s.revisaoValor}>{valor || "—"}</div>
    </div>
  )
}

function ModalConfirmarCancelar({ onFicar, onSair }) {
  return (
    <div style={s.overlay} onClick={onFicar}>
      <div style={s.modalConfirmar} className="nexos-card" onClick={(e) => e.stopPropagation()}>
        <div style={s.modalIcone}>
          <AlertTriangle size={22} color="#b8860b" />
        </div>
        <h3 style={s.modalTitulo}>Cancelar criação da prova?</h3>
        <p style={s.modalTexto}>
          Todo o progresso preenchido até aqui será perdido e não poderá ser recuperado.
        </p>
        <div style={s.modalBotoes}>
          <button style={s.btnCancelarModal} className="nexos-btn" onClick={onFicar}>
            Continuar editando
          </button>
          <button style={s.btnConfirmarCancelar} className="nexos-btn" onClick={onSair}>
            <X size={14} /> Descartar prova
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────
function CriarProva({ turmas, questoes, disciplinas, turmaPreSelecionadaId, onSalvar, onCancelar }) {
  const [etapa, setEtapa] = useState(0)
  const [modalCancelarAberto, setModalCancelarAberto] = useState(false)

  const turmaInicial = turmas.find((t) => t.id === turmaPreSelecionadaId)

  const [dados, setDados] = useState({
    titulo: "",
    disciplinaId: turmaInicial ? String(turmaInicial.disciplinaId) : "",
    turmaId: turmaPreSelecionadaId ? String(turmaPreSelecionadaId) : "",
    instrucoes: "",
  })
  const [config, setConfig] = useState({
    tempoLimite: "",
    dataInicio: "", horaInicio: "",
    dataFim: "", horaFim: "",
    modoSeguro: true,
  })
  const [questoesIds, setQuestoesIds] = useState([])
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")

  const validoEtapa = [
    dados.titulo.trim() && dados.disciplinaId && dados.turmaId,
    config.tempoLimite && config.dataInicio && config.horaInicio && config.dataFim && config.horaFim,
    questoesIds.length > 0,
    true,
  ]

  function proximo() {
    if (!validoEtapa[etapa]) return
    setEtapa((e) => Math.min(e + 1, ETAPAS.length - 1))
  }

  function voltar() {
    setEtapa((e) => Math.max(e - 1, 0))
  }

  async function publicar() {
    if (enviando) return
    setErro("")
    setEnviando(true)

    try {
      const provaCriada = await provaService.criar(Number(dados.turmaId), {
        titulo: dados.titulo.trim(),
        instrucoes: dados.instrucoes.trim() || null,
        dataInicio: `${config.dataInicio}T${config.horaInicio}:00`,
        dataFim: `${config.dataFim}T${config.horaFim}:00`,
        tempoLimiteMinutos: Number(config.tempoLimite),
        modoSeguro: config.modoSeguro,
        questoesIds,
      })
      onSalvar(provaCriada)
    } catch (err) {
      setErro(err.message || "Não foi possível publicar a prova.")
      setEnviando(false)
    }
  }

  return (
    <div style={s.pagina}>
      <StepIndicator etapaAtual={etapa} onIrPara={setEtapa} />

      <h1 style={s.titulo}>{ETAPAS[etapa]}</h1>
      <p style={s.subtitulo}>
        {etapa === 0 && "Preencha os dados gerais da prova abaixo."}
        {etapa === 1 && "Selecione as configurações da sua prova."}
        {etapa === 2 && "Selecione as questões que vão compor sua prova."}
        {etapa === 3 && "Revise as informações da sua prova e depois publique para sua turma."}
      </p>

      {etapa === 0 && <EtapaDados dados={dados} setDados={setDados} disciplinas={disciplinas} turmas={turmas} />}
      {etapa === 1 && <EtapaConfiguracoes config={config} setConfig={setConfig} />}
      {etapa === 2 && (
        <EtapaQuestoes
          questoes={questoes}
          disciplinas={disciplinas}
          questoesIds={questoesIds}
          setQuestoesIds={setQuestoesIds}
          disciplinaIdInicial={dados.disciplinaId}
        />
      )}
      {etapa === 3 && (
        <EtapaRevisao
          dados={dados} config={config} questoesIds={questoesIds}
          disciplinas={disciplinas} turmas={turmas} questoes={questoes}
          onIrPara={setEtapa}
        />
      )}

      <div style={s.formBotoes}>
        <button style={s.btnCancelar} className="nexos-btn" onClick={() => setModalCancelarAberto(true)}>
          <X size={15} /> Cancelar
        </button>
        {erro && <p style={s.erro}>{erro}</p>}
        <div style={{ display: "flex", gap: "10px" }}>
          {etapa > 0 && (
          <button style={s.btnVoltar} className="nexos-btn" onClick={voltar}>
            Voltar
          </button>
          )}
          {etapa < ETAPAS.length - 1 ? (
            <button
              style={{ ...s.btnAvancar, opacity: validoEtapa[etapa] ? 1 : 0.5, cursor: validoEtapa[etapa] ? "pointer" : "not-allowed" }}
              className="nexos-btn"
              onClick={proximo}
            >
              Próximo
            </button>
          ) : (
            <button
              style={{ ...s.btnAvancar, opacity: enviando ? 0.6 : 1, cursor: enviando ? "not-allowed" : "pointer" }}
              className="nexos-btn"
              onClick={publicar}
            >
              <Check size={15} /> {enviando ? "Publicando..." : "Publicar"}
            </button>
          )}
        </div> {modalCancelarAberto && ( <ModalConfirmarCancelar
          onFicar={() => setModalCancelarAberto(false)}
          onSair={onCancelar}
        />
      )}
      </div>
    </div>
  )
}

const s = {
  pagina: { maxWidth: "820px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "4px", padding: "0 4px" },
  erro: { fontSize: "13px", color: "#d33", margin: "8px 0 0", textAlign: "right" },
  titulo: { fontSize: "22px", fontWeight: "700", color: "var(--nexos-navy)", margin: "32px 0 4px" },
  subtitulo: { fontSize: "13.5px", color: "var(--nexos-gray)", margin: "0 0 24px" },

  stepper: { display: "flex", alignItems: "flex-start", marginTop: "8px" },
  stepColuna: {display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: "10px" },
  stepLinhaRow: { display: "flex", alignItems: "center", width: "100%" },
  stepItem: { display: "flex", alignItems: "center", flex: 1, position: "relative" },
  stepDot: {
    width: "11px", height: "11px", borderRadius: "50%", border: "2px solid var(--nexos-border)",
    background: "#fff", flexShrink: 0, padding: 0,
  },
  stepDotAtiva: { background: "var(--nexos-blue)", borderColor: "var(--nexos-blue)" },
  stepLabel: {
    fontSize: "12px", color: "var(--nexos-gray)", textAlign: "center", lineHeight: 1.3,
  },
  stepLabelAtiva: { color: "var(--nexos-blue)", fontWeight: "600" },
  stepLinha: { flex: 1, height: "1.5px", background: "var(--nexos-border)" },
  stepLinhaAtiva: { background: "var(--nexos-blue)" },

  formCard: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "14px",
    padding: "28px", display: "flex", flexDirection: "column", gap: "18px", marginTop: "36px",
    boxSizing: "border-box", width: "100%",
  },
  formTitulo: { fontSize: "15px", fontWeight: "600", color: "var(--nexos-navy)", margin: 0 },
  formRow: { display: "flex", gap: "16px" },
  campo: { flex: 1, display: "flex", flexDirection: "column", gap: "6px" },
  campoLabel: { fontSize: "12px", color: "var(--nexos-gray)" },
  dica: { fontSize: "12.5px", color: "var(--nexos-gray)", margin: "16px 0 0" },

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
  textarea: {
    background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px",
    padding: "10px 12px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit",
    outline: "none", minHeight: "100px", resize: "vertical",
  },

  dataHoraGrid: { display: "grid", gridTemplateColumns: "50px 1fr 110px", gap: "8px", alignItems: "center" },
  dataHoraRotulo: { fontSize: "12.5px", color: "var(--nexos-gray)" },

  toggleWrapper: { display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" },
  toggleTrack: { width: "38px", height: "22px", borderRadius: "11px", background: "var(--nexos-border)", position: "relative", transition: "background .2s" },
  toggleTrackAtiva: { background: "var(--nexos-blue)" },
  toggleBola: { width: "16px", height: "16px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: "3px", transition: "left .2s" },
  toggleBolaAtiva: { left: "19px" },
  toggleTexto: { fontSize: "13.5px", color: "var(--nexos-navy)" },

  aviso: {
    display: "flex", alignItems: "center", gap: "14px", background: "#FAEEDA",
    border: "1px solid #EF9F27", borderRadius: "10px", padding: "16px 18px", marginTop: "16px",
    boxSizing: "border-box", width: "100%",
  },
  avisoIcone: { flexShrink: 0 },
  avisoConteudo: { display: "flex", flexDirection: "column", gap: "3px" },
  avisoTitulo: { fontSize: "13px", fontWeight: "600", color: "#854F0B" },
  avisoCabecalho: { display: "flex", alignItems: "center", gap: "10px" },
  avisoTexto: { fontSize: "12.5px", color: "#854F0B", lineHeight: 1.45 },

  buscaBox: {
    display: "flex", alignItems: "center", gap: "8px", background: "var(--nexos-bg)",
    border: "1px solid var(--nexos-border)", borderRadius: "10px", padding: "9px 14px",
  },
  buscaInput: { border: "none", outline: "none", fontSize: "13.5px", fontFamily: "inherit", width: "100%", background: "transparent" },

  vazio: {
    fontSize: "13.5px", color: "var(--nexos-gray)", background: "var(--nexos-bg)",
    border: "1px dashed var(--nexos-border)", borderRadius: "12px", padding: "24px", textAlign: "center",
  },

  questaoCard: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px",
    padding: "18px", display: "flex", flexDirection: "column", gap: "10px",
  },
  questaoCardAtiva: { borderColor: "var(--nexos-blue)", background: "rgba(16,94,220,0.03)" },
  questaoCabecalho: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" },
  questaoMeta: { fontSize: "12px", color: "var(--nexos-gray)" },
  questaoEnunciado: { fontSize: "13.5px", color: "var(--nexos-navy)", margin: 0, lineHeight: 1.5 },

  btnAdicionar: {
    display: "flex", alignItems: "center", gap: "6px", background: "#fff", color: "var(--nexos-navy)",
    border: "1.5px solid var(--nexos-border)", borderRadius: "8px", padding: "7px 14px",
    fontSize: "12.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
  },
  btnAdicionarAtivo: { background: "rgba(26,156,92,0.1)", borderColor: "#1a9c5c", color: "#1a9c5c" },
  btnCancelarModal: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flex: 1,
    background: "#fff", color: "var(--nexos-navy)", border: "1.5px solid var(--nexos-border)",
    borderRadius: "10px", padding: "10px", fontSize: "13.5px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit",
  },
  btnConfirmarCancelar: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flex: 1,
    background: "var(--nexos-error)", color: "#fff", border: "none",
    borderRadius: "10px", padding: "10px", fontSize: "13.5px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit",
  },
  alternativa: {
    display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "var(--nexos-navy)",
    padding: "7px 10px", borderRadius: "8px", background: "var(--nexos-bg)",
  },
  alternativaCorreta: { background: "rgba(26,156,92,0.08)", border: "1px solid rgba(26,156,92,0.3)" },

  linha: { height: "1px", background: "var(--nexos-border)" },
  revisaoSecao: { display: "flex", flexDirection: "column", gap: "12px" },
  revisaoSecaoCabecalho: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  btnEditar: { background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px", padding: "6px", cursor: "pointer" },
  revisaoLabel: { fontSize: "11.5px", color: "var(--nexos-gray)", marginBottom: "3px" },
  revisaoValor: { fontSize: "13.5px", color: "var(--nexos-navy)", fontWeight: "500" },
  revisaoQuestoes: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13.5px", color: "var(--nexos-navy)" },
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

  btnPreview: {
    display: "flex", alignItems: "center", gap: "8px", marginTop: "14px",
    background: "var(--nexos-bg)", color: "var(--nexos-navy)",
    border: "1.5px solid var(--nexos-border)", borderRadius: "10px", padding: "10px 16px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
  },

  overlay: {
    position: "fixed", inset: 0, background: "rgba(5,10,26,0.5)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(3px)", padding: "20px",
  },
  previewPopup: {
    position: "relative", background: "#fff", borderRadius: "18px", padding: "32px", width: "560px",
    maxHeight: "88vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px",
    boxShadow: "0 24px 60px rgba(5,20,51,0.25)",
  },
  popupFechar: { position: "absolute", top: "14px", right: "14px", background: "none", border: "none", cursor: "pointer", borderRadius: "8px", padding: "4px" },

  previewOverlay: {
    position: "fixed", inset: 0, background: "rgba(5,10,26,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 300, backdropFilter: "blur(3px)", padding: "40px 20px",
  },
  previewPagina: {
    background: "#fff",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "820px",
    maxHeight: "calc(100vh - 80px)",
    boxShadow: "0 24px 60px rgba(5,20,51,0.3)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
   previewTopo: {
    position: "sticky", top: 0, zIndex: 10,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 32px", background: "#fff", borderBottom: "1px solid var(--nexos-border)",
  },
  previewTag: {
    fontSize: "12px", fontWeight: "700", color: "var(--nexos-blue)", textTransform: "uppercase",
    letterSpacing: "0.06em", background: "var(--nexos-icon-bg)", padding: "6px 12px", borderRadius: "999px",
  },
  previewTitulo: { fontSize: "21px", fontWeight: "700", color: "var(--nexos-navy)", margin: 0 },
  previewMeta: { display: "flex", gap: "8px", fontSize: "12.5px", color: "var(--nexos-gray)" },
  previewMetaGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px",
  },
  previewMetaItem: { display: "flex", flexDirection: "column", gap: "3px" },
  previewMetaLabel: { fontSize: "11.5px", fontWeight: "600", color: "var(--nexos-gray)", textTransform: "uppercase", letterSpacing: "0.03em" },
  previewMetaValor: { fontSize: "13.5px", color: "var(--nexos-navy)", fontWeight: "500" },
  previewInstrucoes: { fontSize: "13px", color: "var(--nexos-navy)", margin: "6px 0 0", lineHeight: 1.6, whiteSpace: "pre-wrap" },
  previewVazio: {
    fontSize: "13.5px", color: "var(--nexos-gray)", background: "var(--nexos-bg)",
    border: "1px dashed var(--nexos-border)", borderRadius: "12px", padding: "28px", textAlign: "center",
  },
  previewBtnFechar: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "#fff", color: "var(--nexos-navy)", border: "1.5px solid var(--nexos-border)",
    borderRadius: "10px", padding: "9px 16px", fontSize: "13px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit",
  },
  previewConteudo: {
    maxWidth: "760px", width: "100%", margin: "0 auto",
    padding: "36px 24px 60px",
    display: "flex", flexDirection: "column", gap: "20px",
    overflowY: "auto",
  },
  previewCabecalhoCard: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "16px",
    padding: "28px", display: "flex", flexDirection: "column", gap: "16px",
  },
  previewAlunoRow: { display: "flex", alignItems: "center", gap: "12px" },
  previewAvatar: {
    width: "42px", height: "42px", borderRadius: "50%",
    background: "linear-gradient(135deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", fontWeight: "700",
  },
  previewAlunoLabel: { fontSize: "11.5px", color: "var(--nexos-gray)" },
  previewAlunoNome: { fontSize: "14.5px", fontWeight: "600", color: "var(--nexos-navy)" },
  previewLista: { display: "flex", flexDirection: "column", gap: "20px" },
   previewLinha: { height: "1px", background: "var(--nexos-border)" },
  previewQuestao: { display: "flex", flexDirection: "column", gap: "10px" },
  previewQuestaoCard: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "14px",
    padding: "24px", display: "flex", flexDirection: "column", gap: "12px",
  },
  previewQuestaoNumero: { fontSize: "12px", fontWeight: "700", color: "var(--nexos-blue)", textTransform: "uppercase", letterSpacing: "0.04em" },
  previewEnunciado: { fontSize: "14.5px", color: "var(--nexos-navy)", margin: 0, lineHeight: 1.6 },
  previewAlternativa: {
    display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13.5px", color: "var(--nexos-navy)",
    padding: "11px 14px", borderRadius: "10px", border: "1px solid var(--nexos-border)",
    background: "var(--nexos-bg)", cursor: "default",
  },
  previewAlternativaLetra: {
    fontWeight: "700", color: "var(--nexos-gray)", minWidth: "16px",
  },
  formBotoes: { display: "flex", justifyContent: "space-between", marginTop: "24px" },
  btnCancelar: {
    display: "flex", alignItems: "center", gap: "8px", background: "#fff", color: "var(--nexos-navy)",
    border: "1.5px solid var(--nexos-border)", borderRadius: "10px", padding: "10px 18px",
    fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
  },
  btnVoltar: {
    background: "#fff", color: "var(--nexos-navy)", border: "1.5px solid var(--nexos-border)",
    borderRadius: "10px", padding: "10px 20px", fontSize: "13.5px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit",
  },
  btnAvancar: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff", border: "none", borderRadius: "10px", padding: "10px 22px",
    fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
    boxShadow: "0 6px 16px rgba(16, 94, 220, 0.22)",
  },
}

export default CriarProva