import { FileText, LogOut, PanelLeft } from "lucide-react"

const itens = [
  { icone: FileText, label: "Provas", id: "provas" },
]

function Sidebar({ paginaAtiva, onNavegar, usuario, onSair, aberto, onToggle }) {
  const largura = aberto ? "220px" : "64px"

  return (
    <div style={{ ...s.sidebar, width: largura }}>

      <div style={s.logoRow}>
        {aberto && (
          <div style={s.logo}>
            <div style={s.logoIcone}>A</div>
            <span style={s.logoTexto}>AvaliaFácil</span>
          </div>
        )}
        <button onClick={onToggle} style={s.btnToggle}>
          <PanelLeft size={18} color="#6b698a" />
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
              style={{
                ...s.itemNav,
                background: ativo ? "#eef1ff" : "transparent",
                color:      ativo ? "#040220" : "#6b698a",
                borderLeft: ativo ? "3px solid #040220" : "3px solid transparent",
                justifyContent: aberto ? "flex-start" : "center",
                padding: aberto ? "9px 12px" : "9px",
              }}
            >
              <Icone size={16} />
              {aberto && <span style={s.itemLabel}>{label}</span>}
            </button>
          )
        })}
      </nav>

      <div style={{ ...s.rodape, justifyContent: aberto ? "space-between" : "center" }}>
        {aberto && (
          <div style={s.usuarioInfo}>
            <div style={s.avatar}>
              {usuario.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={s.usuarioNome}>{usuario.nome}</div>
              <div style={s.usuarioPerfil}>Professor</div>
            </div>
          </div>
        )}
        {!aberto && (
          <div style={s.avatar} title={usuario.nome}>
            {usuario.nome.charAt(0).toUpperCase()}
          </div>
        )}
        {aberto && (
          <button onClick={onSair} style={s.btnSair} title="Sair">
            <LogOut size={15} />
          </button>
        )}
      </div>

    </div>
  )
}

const s = {
  sidebar: {
    minHeight: "100vh",
    background: "#ffffff",
    borderRight: "1px solid #e2e0f0",
    display: "flex",
    flexDirection: "column",
    padding: "20px 12px",
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    transition: "width 0.2s ease",
    overflow: "hidden",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
    minHeight: "32px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoIcone: {
    width: "28px",
    height: "28px",
    minWidth: "28px",
    background: "linear-gradient(135deg, #040220 0%, #15123c 100%)",
    borderRadius: "7px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
  },
  logoTexto: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#040220",
    whiteSpace: "nowrap",
  },
  btnToggle: {
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px",
    borderRadius: "6px",
    flexShrink: 0,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    flex: 1,
  },
  itemNav: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "500",
    fontFamily: "inherit",
    textAlign: "left",
    transition: "all .2 ease",
    whiteSpace: "nowrap",
    position: "relative",
  },
  itemLabel: {
    fontSize: "13px",
  },
  rodape: {
    display: "flex",
    alignItems: "center",
    padding: "12px 4px",
    borderTop: "1px solid #e2e0f0",
    marginTop: "16px",
    gap: "8px",
  },
  usuarioInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    overflow: "hidden",
  },
  avatar: {
    width: "30px",
    height: "30px",
    minWidth: "30px",
    borderRadius: "50%",
    background: "#f2f0ff",
    color: "#462bff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "default",
  },
  usuarioNome: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#040220",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  usuarioPerfil: {
    fontSize: "11px",
    color: "#6b698a",
  },
  btnSair: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b698a",
    display: "flex",
    alignItems: "center",
    padding: "4px",
    flexShrink: 0,
  },
}

export default Sidebar