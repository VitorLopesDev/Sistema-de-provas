import { AVATAR_PRESETS } from "./avatarPresets"

function AvatarDisplay({ nome, foto, avatarPreset, size = 34, fontSize }) {
  const preset = AVATAR_PRESETS.find((p) => p.id === avatarPreset)
  const tamanhoFonte = fontSize || size * 0.4

  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: foto ? "transparent" : preset ? preset.gradiente : "linear-gradient(135deg, var(--nexos-blue), var(--nexos-purple))",
        color: "#fff",
        fontWeight: "700",
        fontSize: `${tamanhoFonte}px`,
        flexShrink: 0,
      }}
    >
      {foto ? (
        <img src={foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : preset ? (
        <preset.Icone size={size * 0.46} color="#fff" />
      ) : (
        nome.charAt(0).toUpperCase()
      )}
    </div>
  )
}

export default AvatarDisplay
