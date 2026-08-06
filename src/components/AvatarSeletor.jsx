import { useRef, useState } from "react"
import { Camera, Upload, X, Trash2 } from "lucide-react"
import { AVATAR_PRESETS } from "./avatarPresets"
import AvatarDisplay from "./AvatarDisplay"

function AvatarSeletor({ nome, foto, avatarPreset, onAtualizar, size = 84 }) {
  const [modalAberto, setModalAberto] = useState(false)
  const fileRef = useRef(null)

  function handleArquivo(e) {
    const arquivo = e.target.files[0]
    if (!arquivo) return
    if (!["image/png", "image/jpeg"].includes(arquivo.type)) {
      window.alert("Envie apenas arquivos PNG ou JPEG.")
      return
    }
    const leitor = new FileReader()
    leitor.onload = () => {
      onAtualizar({ foto: leitor.result, avatarPreset: null })
      setModalAberto(false)
    }
    leitor.readAsDataURL(arquivo)
    e.target.value = ""
  }

  function escolherPreset(id) {
    onAtualizar({ foto: null, avatarPreset: id })
    setModalAberto(false)
  }

  function remover() {
    onAtualizar({ foto: null, avatarPreset: null })
    setModalAberto(false)
  }

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <AvatarDisplay nome={nome} foto={foto} avatarPreset={avatarPreset} size={size} />

      <button
        style={s.btnCamera}
        className="nexos-icon-btn"
        onClick={() => setModalAberto(true)}
        title="Alterar foto"
      >
        <Camera size={13} color="var(--nexos-blue)" />
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg"
        style={{ display: "none" }}
        onChange={handleArquivo}
      />

      {modalAberto && (
        <div style={s.overlay} onClick={() => setModalAberto(false)}>
          <div style={s.modal} className="nexos-card" onClick={(e) => e.stopPropagation()}>
            <div style={s.cabecalho}>
              <h3 style={s.titulo}>Alterar foto</h3>
              <button style={s.btnFechar} className="nexos-icon-btn" onClick={() => setModalAberto(false)}>
                <X size={16} color="var(--nexos-gray)" />
              </button>
            </div>

            <button style={s.btnUpload} className="nexos-btn" onClick={() => fileRef.current.click()}>
              <Upload size={15} /> Enviar foto (PNG ou JPEG)
            </button>

            <div style={s.divisorLinha}>
              <span style={s.divisorTexto}>ou escolha um avatar</span>
            </div>

            <div style={s.presetsGrid}>
              {AVATAR_PRESETS.map((p) => (
                <button
                  key={p.id}
                  style={{
                    ...s.presetBtn,
                    background: p.gradiente,
                    outline: avatarPreset === p.id ? "2.5px solid var(--nexos-navy)" : "none",
                    outlineOffset: "2px",
                  }}
                  onClick={() => escolherPreset(p.id)}
                  title="Usar este avatar"
                >
                  <p.Icone size={20} color="#fff" />
                </button>
              ))}
            </div>

            {(foto || avatarPreset) && (
              <button style={s.btnRemover} className="nexos-link" onClick={remover}>
                <Trash2 size={13} /> Remover e usar a inicial do nome
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  btnCamera: {
    position: "absolute",
    bottom: "-2px",
    right: "-2px",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#fff",
    border: "2.5px solid var(--nexos-bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 3px 10px rgba(5,20,51,0.2)",
  },

  overlay: {
    position: "fixed", inset: 0, background: "rgba(5,10,26,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 200, backdropFilter: "blur(2px)",
  },
  modal: {
    background: "#fff", borderRadius: "16px", padding: "24px", width: "320px",
    display: "flex", flexDirection: "column", gap: "16px",
    boxShadow: "0 24px 60px rgba(5,20,51,0.25)",
  },
  cabecalho: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  titulo: { fontSize: "15px", fontWeight: "700", color: "var(--nexos-navy)", margin: 0 },
  btnFechar: { background: "none", border: "none", cursor: "pointer", borderRadius: "8px", padding: "4px" },

  btnUpload: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
    background: "var(--nexos-bg)", color: "var(--nexos-navy)", border: "1.5px solid var(--nexos-border)",
    borderRadius: "10px", padding: "11px", fontSize: "13px", fontWeight: "600",
    cursor: "pointer", fontFamily: "inherit",
  },

  divisorLinha: { display: "flex", alignItems: "center", gap: "10px" },
  divisorTexto: { fontSize: "11.5px", color: "var(--nexos-gray)", margin: "0 auto" },

  presetsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  presetBtn: {
    width: "100%", aspectRatio: "1", borderRadius: "50%", border: "none",
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },

  btnRemover: {
    display: "flex", alignItems: "center", gap: "6px", justifyContent: "center",
    background: "none", border: "none", color: "var(--nexos-error)", fontSize: "12px",
    fontWeight: "600", cursor: "pointer", fontFamily: "inherit", padding: 0,
  },
}

export default AvatarSeletor
