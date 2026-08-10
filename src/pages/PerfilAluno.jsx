import { useState } from "react"
import { Mail, IdCard, GraduationCap, Library, Lock, Clock, User, Pencil, Check, X } from "lucide-react"
import { TURMAS_ALUNO } from "../data/turmasAluno"
import AvatarSeletor from "../components/AvatarSeletor"

function PerfilAluno({ usuario, onAtualizarUsuario }) {
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(usuario.nome)
  const [matricula, setMatricula] = useState(usuario.matricula || "")

  const bloqueado = !!usuario.bloqueado
  const disciplinas = [...new Map(TURMAS_ALUNO.map((t) => [t.disciplina, t])).values()]

  function iniciarEdicao() {
    setNome(usuario.nome)
    setMatricula(usuario.matricula || "")
    setEditando(true)
  }

  function salvar() {
    onAtualizarUsuario({
      nome: nome.trim() || usuario.nome,
      matricula: matricula.trim(),
    })
    setEditando(false)
  }

  return (
    <div style={s.pagina}>

      <div style={s.cabecalhoCard} className="nexos-card">
        <AvatarSeletor
          nome={usuario.nome}
          foto={usuario.foto}
          avatarPreset={usuario.avatarPreset}
          onAtualizar={onAtualizarUsuario}
          size={84}
        />

        <div style={{ flex: 1 }}>
          {editando ? (
            <div style={s.formEdicao}>
              <div style={s.formRow}>
                <Campo label="Nome">
                  <input style={s.input} value={nome} onChange={(e) => setNome(e.target.value)} autoFocus />
                </Campo>
                <Campo label="Matrícula">
                  <input style={s.input} value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Ex: 2023104532" />
                </Campo>
              </div>
              <div style={s.formBotoes}>
                <button style={s.btnCancelar} className="nexos-btn" onClick={() => setEditando(false)}>
                  <X size={14} /> Cancelar
                </button>
                <button style={s.btnSalvar} className="nexos-btn" onClick={salvar}>
                  <Check size={14} /> Salvar alterações
                </button>
              </div>
            </div>
          ) : (
            <>
              <div style={s.nomeRow}>
                <h1 style={s.nome}>{usuario.nome}</h1>
                <button style={s.btnEditar} className="nexos-icon-btn" onClick={iniciarEdicao} title="Editar perfil">
                  <Pencil size={14} color="var(--nexos-gray)" />
                </button>
              </div>
              <p style={s.cargo}>Aluno</p>
              <div style={s.infoRow}>
                <div style={s.infoItem}>
                  <Mail size={13} color="var(--nexos-gray)" />
                  {usuario.email}
                </div>
                <div style={s.infoItem}>
                  <IdCard size={13} color="var(--nexos-gray)" />
                  Matrícula: {usuario.matricula || "—"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {bloqueado ? (
        <div style={s.bloqueado}>
          <Lock size={22} color="#b8860b" style={{ marginBottom: "6px" }} />
          <div style={{ fontWeight: 700, color: "var(--nexos-navy)", marginBottom: "4px" }}>
            Acesso às turmas bloqueado
          </div>
          <p style={{ margin: 0 }}>
            Seu acesso a turmas e disciplinas está temporariamente bloqueado. Fale com a coordenação para regularizar.
          </p>
        </div>
      ) : (
        <>
          <div style={s.secao}>
            <div style={s.secaoTitulo}>
              <GraduationCap size={17} color="var(--nexos-blue)" />
              <span>Minhas turmas</span>
              <span style={s.contador}>{TURMAS_ALUNO.length}</span>
            </div>
            <div style={s.grid}>
              {TURMAS_ALUNO.map((t) => (
                <div key={t.id} style={s.card} className="nexos-card">
                  <div style={s.cardTitulo}>{t.disciplina}</div>
                  <div style={s.cardInfo}>{t.nome}</div>
                  <div style={s.cardInfo}>
                    <Clock size={11} style={{ marginRight: "5px", verticalAlign: "-1px" }} />
                    {t.turno}
                  </div>
                  <div style={s.cardInfo}>
                    <User size={11} style={{ marginRight: "5px", verticalAlign: "-1px" }} />
                    {t.professor}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.secao}>
            <div style={s.secaoTitulo}>
              <Library size={17} color="var(--nexos-blue)" />
              <span>Disciplinas cadastradas</span>
              <span style={s.contador}>{disciplinas.length}</span>
            </div>
            <div style={s.chips}>
              {disciplinas.map((d) => (
                <div key={d.disciplina} style={s.chip}>{d.disciplina}</div>
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  )
}

function Campo({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "5px", flex: 1 }}>
      <label style={{ fontSize: "11.5px", color: "var(--nexos-gray)" }}>{label}</label>
      {children}
    </div>
  )
}

const s = {
  pagina: { display: "flex", flexDirection: "column", gap: "36px", maxWidth: "1000px", margin: "0 auto" },

  cabecalhoCard: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "16px",
    padding: "28px 32px", display: "flex", alignItems: "flex-start", gap: "22px",
  },
  nomeRow: { display: "flex", alignItems: "center", gap: "8px" },
  nome: { fontSize: "21px", fontWeight: "700", color: "var(--nexos-navy)", margin: "0 0 2px" },
  btnEditar: { background: "none", border: "none", cursor: "pointer", borderRadius: "8px", padding: "5px", marginTop: "-14px" },
  cargo: { fontSize: "13.5px", color: "var(--nexos-blue)", fontWeight: "600", margin: "0 0 12px" },
  infoRow: { display: "flex", gap: "20px", flexWrap: "wrap" },
  infoItem: { display: "flex", alignItems: "center", gap: "7px", fontSize: "12.5px", color: "var(--nexos-gray)" },

  formEdicao: { display: "flex", flexDirection: "column", gap: "14px" },
  formRow: { display: "flex", gap: "14px" },
  input: {
    background: "var(--nexos-bg)", border: "1px solid var(--nexos-border)", borderRadius: "8px",
    padding: "8px 12px", fontSize: "13.5px", color: "var(--nexos-navy)", fontFamily: "inherit",
    outline: "none", width: "100%",
  },
  formBotoes: { display: "flex", gap: "10px", marginTop: "2px" },
  btnCancelar: {
    display: "flex", alignItems: "center", gap: "7px", background: "#fff", color: "var(--nexos-navy)",
    border: "1.5px solid var(--nexos-border)", borderRadius: "9px", padding: "8px 16px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
  },
  btnSalvar: {
    display: "flex", alignItems: "center", gap: "7px",
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff", border: "none", borderRadius: "9px", padding: "8px 16px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit",
  },

  secao: { display: "flex", flexDirection: "column", gap: "16px" },
  secaoTitulo: { display: "flex", alignItems: "center", gap: "10px", fontSize: "16px", fontWeight: "600", color: "var(--nexos-navy)" },
  contador: {
    fontSize: "11.5px", fontWeight: "700", color: "var(--nexos-blue)", background: "var(--nexos-icon-bg)",
    borderRadius: "999px", padding: "2px 9px", marginLeft: "-2px",
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" },
  card: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px",
    padding: "16px 18px", display: "flex", flexDirection: "column", gap: "5px",
  },
  cardTitulo: { fontSize: "13.5px", fontWeight: "600", color: "var(--nexos-navy)" },
  cardInfo: { fontSize: "12px", color: "var(--nexos-gray)" },

  chips: { display: "flex", flexWrap: "wrap", gap: "10px" },
  chip: {
    background: "var(--nexos-icon-bg)", color: "var(--nexos-blue)", fontWeight: "600",
    fontSize: "12.5px", borderRadius: "999px", padding: "8px 16px",
  },

  bloqueado: {
    background: "rgba(184,134,11,0.06)", border: "1px dashed #b8860b", borderRadius: "14px",
    padding: "28px", textAlign: "center", maxWidth: "440px", fontSize: "13px", color: "var(--nexos-gray)", lineHeight: 1.6,
  },
}

export default PerfilAluno
