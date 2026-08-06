import iconLight from "../assets/logo-nexos.png"
import iconDark from "../assets/logo-nexos-dark.png"
import wordmark from "../assets/nexos-wordmark.png"

/**
 * Marca Nexos (ícone + wordmark) com espaçamento consistente em todo o site.
 * `dark` = true quando usada sobre fundo escuro (header/rodapé da Home).
 */
function Logo({ dark = false, height = 30, showWordmark = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: `${height * 0.34}px` }}>
      <img
        src={dark ? iconDark : iconLight}
        alt=""
        style={{ height: `${height}px`, width: "auto", objectFit: "contain", display: "block", flexShrink: 0 }}
      />
      {showWordmark && (
        <img
          src={wordmark}
          alt="Nexos"
          style={{
            height: `${height * 0.58}px`,
            width: "auto",
            objectFit: "contain",
            display: "block",
            filter: dark ? "brightness(0) invert(1)" : "none",
          }}
        />
      )}
    </div>
  )
}

export default Logo
