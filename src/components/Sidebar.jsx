import { Home, Library, BookOpen, FileText, GraduationCap, ClipboardList, LogOut, PanelLeft } from "lucide-react"
import Logo from "../components/Logo"
import AvatarDisplay from "./AvatarDisplay"

const ITENS_PROFESSOR = [
  { icone: Home, label: "Home", id: "home" },
  { icone: Library, label: "Minhas Disciplinas", id: "disciplinas" },
  { icone: BookOpen, label: "Banco de Questões", id: "questoes" },
  { icone: FileText, label: "Provas", id: "provas" },
  { icone: GraduationCap, label: "Turmas", id: "turmas" },
]

const ITENS_ALUNO = [
  { icone: Home, label: "Home", id: "home" },
  { icone: GraduationCap, label: "Minhas turmas", id: "turmas" },
  { icone: FileText, label: "Minhas provas", id: "provas" },
  { icone: ClipboardList, label: "Minhas atividades", id: "atividades" },
]

function Sidebar({ paginaAtiva, onNavegar, usuario, onSair, aberto, onToggle, onAbrirPerfil }) {
  const largura = aberto ? "220px" : "64px"
  const ehProfessor = usuario.perfil === "PROFESSOR"
  const itens = ehProfessor ? ITENS_PROFESSOR : ITENS_ALUNO
  const rotuloPerfil = ehProfessor ? "Professor" : "Aluno"

  return (
    <div style={{ ...s.sidebar, width: largura }}>

      <div style={s.logoRow}>
        {aberto && (
          <div style={s.logo}>
            <Logo dark height={26} />
          </div>
        )}

        <button style={s.btnToggle} className="nexos-icon-btn" onClick={onToggle}>
          <PanelLeft size={18} color="rgba(255,255,255,0.55)" />
        </button>
      </div>

      <nav style={s.nav}>
        {itens.map(({ icone: Icone, label, id }) => {
          const ativo = paginaAtiva === id

          return (
            <button
              key={id}
              onClick={() => onNavegar(id)}
              title={!aberto ? label : undefined}
              className={ativo ? "" : "nexos-nav-item"}
              style={{
                ...s.itemNav,
                ...(ativo ? s.itemNavAtivo : s.itemNavInativo),
                justifyContent: aberto ? "flex-start" : "center",
                padding: aberto ? "10px 14px" : "10px",
              }}
            >
              <Icone size={17} />
              {aberto && <span style={s.itemLabel}>{label}</span>}
            </button>
          )
        })}
      </nav>

      <div
        style={{
          ...s.rodape,
          justifyContent: aberto ? "space-between" : "center",
        }}
      >
        {aberto ? (
          <>
            <button style={s.usuarioInfo} className="nexos-icon-btn" onClick={onAbrirPerfil} title="Ver perfil">
              <AvatarDisplay nome={usuario.nome} foto={usuario.foto} avatarPreset={usuario.avatarPreset} size={34} />

              <div>
                <div style={s.usuarioNome}>{usuario.nome}</div>
                <div style={s.usuarioPerfil}>{rotuloPerfil}</div>
              </div>
            </button>

            <button
              onClick={onSair}
              style={s.btnSair}
              className="nexos-icon-btn"
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <button style={s.avatarBtn} className="nexos-icon-btn" onClick={onAbrirPerfil} title="Ver perfil">
            <AvatarDisplay nome={usuario.nome} foto={usuario.foto} avatarPreset={usuario.avatarPreset} size={34} />
          </button>
        )}
      </div>

    </div>
  )
}

const s = {

  sidebar: {
    minHeight: "100vh",
    background: "rgba(4, 9, 24, 0.92)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRight: "1px solid rgba(255,255,255,0.07)",
    display: "flex",
    flexDirection: "column",
    padding: "20px 12px",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    overflow: "hidden",
    transition: "width .25s ease",
  },

  logoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "28px",
    minHeight: "34px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
  },

  btnToggle: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    borderRadius: "8px",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },

  itemNav: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color .25s ease, color .25s ease, box-shadow .25s ease, transform .15s ease",
    whiteSpace: "nowrap",
  },

  itemNavAtivo: {
    background: "var(--nexos-blue)",
    color: "#FFFFFF",
    boxShadow: "0 4px 16px rgba(16, 94, 220, 0.45)",
  },

  itemNavInativo: {
    background: "transparent",
    color: "rgba(255,255,255,0.55)",
  },

  itemLabel: {
    fontSize: "14px",
  },

  rodape: {
    display: "flex",
    alignItems: "center",
    padding: "14px 6px",
    borderTop: "1px solid rgba(255,255,255,0.07)",
    marginTop: "18px",
    gap: "8px",
  },

  usuarioInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    overflow: "hidden",
    background: "none",
    border: "none",
    padding: "4px",
    borderRadius: "10px",
    cursor: "pointer",
    fontFamily: "inherit",
    textAlign: "left",
    flex: 1,
    minWidth: 0,
  },

  avatarBtn: {
    background: "none",
    border: "none",
    padding: 0,
    borderRadius: "50%",
    cursor: "pointer",
  },

  usuarioNome: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#ffffff",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  usuarioPerfil: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.5)",
  },

  btnSair: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "rgba(255,255,255,0.55)",
    borderRadius: "8px",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .2s ease",
  },

}

export default Sidebar
