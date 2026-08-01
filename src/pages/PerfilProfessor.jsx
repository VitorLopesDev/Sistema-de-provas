import { useState } from "react"
import { Mail, IdCard, Briefcase, Library, GraduationCap, FileText, Clock, Pencil, Check, X } from "lucide-react"
import AvatarSeletor from "../components/AvatarSeletor"

function PerfilProfessor({ usuario, onAtualizarUsuario, disciplinas, turmas, provas }) {
  const [editando, setEditando] = useState(false)
  const [nome, setNome] = useState(usuario.nome)
  const [cargo, setCargo] = useState(usuario.cargo || "")
  const [matricula, setMatricula] = useState(usuario.matricula || "")
  const [departamento, setDepartamento] = useState(usuario.departamento || "")

  function iniciarEdicao() {
    setNome(usuario.nome)
    setCargo(usuario.cargo || "")
    setMatricula(usuario.matricula || "")
    setDepartamento(usuario.departamento || "")
    setEditando(true)
  }

  function salvar() {
    onAtualizarUsuario({
      nome: nome.trim() || usuario.nome,
      cargo: cargo.trim(),
      matricula: matricula.trim(),
      departamento: departamento.trim(),
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
                <Campo label="Cargo">
                  <input style={s.input} value={cargo} onChange={(e) => setCargo(e.target.value)} placeholder="Ex: Professora Adjunta" />
                </Campo>
              </div>
              <div style={s.formRow}>
                <Campo label="Matrícula">
                  <input style={s.input} value={matricula} onChange={(e) => setMatricula(e.target.value)} placeholder="Ex: 20231045" />
                </Campo>
                <Campo label="Departamento">
                  <input style={s.input} value={departamento} onChange={(e) => setDepartamento(e.target.value)} placeholder="Ex: Departamento de Computação" />
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
              <p style={s.cargo}>{usuario.cargo || "Professor(a)"}</p>
              <div style={s.infoRow}>
                <div style={s.infoItem}>
                  <Mail size={13} color="var(--nexos-gray)" />
                  {usuario.email}
                </div>
                <div style={s.infoItem}>
                  <IdCard size={13} color="var(--nexos-gray)" />
                  Matrícula: {usuario.matricula || "—"}
                </div>
                <div style={s.infoItem}>
                  <Briefcase size={13} color="var(--nexos-gray)" />
                  {usuario.departamento || "Corpo docente"}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={s.secao}>
        <div style={s.secaoTitulo}>
          <Library size={17} color="var(--nexos-blue)" />
          <span>Disciplinas ministradas</span>
          <span style={s.contador}>{disciplinas.length}</span>
        </div>
        {disciplinas.length === 0 ? (
          <div style={s.vazio}>Nenhuma disciplina cadastrada ainda.</div>
        ) : (
          <div style={s.grid}>
            {disciplinas.map((d) => (
              <div key={d.id} style={s.card} className="nexos-card">
                <div style={s.cardTitulo}>{d.nome}</div>
                <div style={s.cardInfo}>{d.assuntos.length} {d.assuntos.length === 1 ? "assunto" : "assuntos"}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={s.secao}>
        <div style={s.secaoTitulo}>
          <GraduationCap size={17} color="var(--nexos-blue)" />
          <span>Turmas ministradas</span>
          <span style={s.contador}>{turmas.length}</span>
        </div>
        {turmas.length === 0 ? (
          <div style={s.vazio}>Nenhuma turma cadastrada ainda.</div>
        ) : (
          <div style={s.grid}>
            {turmas.map((t) => (
              <div key={t.id} style={s.card} className="nexos-card">
                <div style={s.cardTitulo}>{t.disciplina}</div>
                <div style={s.cardInfo}>{t.nome}</div>
                <div style={s.cardInfo}>{t.turno} · {t.totalAlunos} alunos</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={s.secao}>
        <div style={s.secaoTitulo}>
          <FileText size={17} color="var(--nexos-blue)" />
          <span>Provas aplicadas e criadas</span>
          <span style={s.contador}>{provas.length}</span>
        </div>
        {provas.length === 0 ? (
          <div style={s.vazio}>Nenhuma prova criada ainda.</div>
        ) : (
          <div style={s.lista}>
            {provas.map((p) => (
              <div key={p.id} style={s.linha} className="nexos-card">
                <div style={s.linhaTitulo}>{p.titulo}</div>
                <div style={s.linhaInfo}>{p.turma}</div>
                <div style={s.linhaInfo}>
                  <Clock size={12} color="var(--nexos-gray)" style={{ marginRight: "5px" }} />
                  {p.dataInicio} → {p.dataFim.split(" ")[1]}
                </div>
                {p.liberada && <span style={s.badgeLiberada}>Liberada</span>}
              </div>
            ))}
          </div>
        )}
      </div>

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
  pagina: { display: "flex", flexDirection: "column", gap: "36px", maxWidth: "1000px" },

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

  vazio: {
    fontSize: "13.5px", color: "var(--nexos-gray)", background: "var(--nexos-bg)",
    border: "1px dashed var(--nexos-border)", borderRadius: "12px", padding: "20px", textAlign: "center",
  },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "14px" },
  card: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px",
    padding: "16px 18px", display: "flex", flexDirection: "column", gap: "5px",
  },
  cardTitulo: { fontSize: "13.5px", fontWeight: "600", color: "var(--nexos-navy)" },
  cardInfo: { fontSize: "12px", color: "var(--nexos-gray)" },

  lista: { display: "flex", flexDirection: "column", gap: "10px" },
  linha: {
    background: "#fff", border: "1px solid var(--nexos-border)", borderRadius: "12px",
    padding: "14px 18px", display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap",
  },
  linhaTitulo: { fontSize: "13.5px", fontWeight: "600", color: "var(--nexos-navy)", flex: 1, minWidth: "180px" },
  linhaInfo: { display: "flex", alignItems: "center", fontSize: "12px", color: "var(--nexos-gray)" },
  badgeLiberada: {
    fontSize: "11px", fontWeight: "600", color: "#1a9c5c", background: "rgba(26,156,92,0.12)",
    padding: "3px 10px", borderRadius: "999px",
  },
}

export default PerfilProfessor
