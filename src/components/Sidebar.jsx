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

        <button style={s.btnToggle} onClick={onToggle}>
          <PanelLeft size={18} color="#5F5E5A" />
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
            <div style={s.usuarioInfo}>
              <div style={s.avatar}>
                {usuario.nome.charAt(0).toUpperCase()}
              </div>

              <div>
                <div style={s.usuarioNome}>{usuario.nome}</div>
                <div style={s.usuarioPerfil}>Professor</div>
              </div>
            </div>

            <button
              onClick={onSair}
              style={s.btnSair}
              title="Sair"
            >
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div style={s.avatar} title={usuario.nome}>
            {usuario.nome.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

    </div>
  )
}

const s = {

  sidebar: {
    minHeight: "100vh",
    background: "rgba(255,255,255,.65)",
    backdropFilter: "blur(24px)",
    WebkitBackdropFilter: "blur(24px)",
    borderRight: "1px solid #E4E2D9",
    boxShadow: "0 8px 32px rgba(31,92,107,.08)",
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
    minHeight: "36px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  logoIcone: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    background: "#040220",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
  },

  logoTexto: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#040220",
    whiteSpace: "nowrap",
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
    transition: "all .2s ease",
    whiteSpace: "nowrap",
  },

  itemNavAtivo: {
    background: "#1F5C6B",
    color: "#FFFFFF",
  },

  itemNavInativo: {
    background: "transparent",
    color: "#5F5E5A",
  },

  itemLabel: {
    fontSize: "14px",
  },

  rodape: {
    display: "flex",
    alignItems: "center",
    padding: "14px 6px",
    borderTop: "1px solid #E4E2D9",
    marginTop: "18px",
    gap: "8px",
  },

  usuarioInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    overflow: "hidden",
  },

  avatar: {
    width: "34px",
    height: "34px",
    minWidth: "34px",
    borderRadius: "50%",
    background: "#1F5C6B",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
  },

  usuarioNome: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#040220",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  usuarioPerfil: {
    fontSize: "12px",
    color: "#5F5E5A",
  },

  btnSair: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#5F5E5A",
    borderRadius: "8px",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all .2s ease",
  },

}

export default Sidebar