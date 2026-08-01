import {
  FileText, ShieldCheck, Clock, BookOpen, TrendingUp, Users,
  ClipboardList, PenSquare, Link2, GraduationCap,
} from "lucide-react"
import Logo from "../components/Logo"

const jornada = [
  { n: "01", label: "Avalie",  Icone: ClipboardList,  texto: "Monte e aplique provas online com segurança e monitoramento em tempo real." },
  { n: "02", label: "Corrija",  Icone: PenSquare,      texto: "Corrija atividades e avaliações de forma rápida e centralizada." },
  { n: "03", label: "Conecte", Icone: Link2,          texto: "Ligue os resultados às turmas e disciplinas certas, sem retrabalho." },
  { n: "04", label: "Eduque",  Icone: GraduationCap,  texto: "Transforme os dados em decisões que melhoram o aprendizado." },
]

function Home({ onIrParaLogin, onIrParaCadastro }) {
  return (
    <div style={s.pagina}>

      {/* Header */}
      <header style={s.header}>
        <div style={s.logo}>
          <Logo dark height={30} />
        </div>

        <div style={s.headerDireita}>
          <nav style={s.nav} className="nexos-header-nav">
            <a href="#professores" style={s.navLink} className="nexos-link">Professor</a>
            <a href="#alunos" style={s.navLink} className="nexos-link">Aluno</a>
          </nav>

          <div style={s.headerBotoes}>
            <button style={s.btnEntrar} className="nexos-btn" onClick={onIrParaLogin}>Entrar</button>
            <button style={s.btnCadastrar} className="nexos-btn" onClick={onIrParaCadastro}>Cadastre-se</button>
          </div>
        </div>
      </header>

      {/* Hero escuro */}
      <section style={s.hero}>
        <div style={s.glowAzul} className="nexos-glow" />
        <div style={s.glowRoxo} className="nexos-glow" />

        <div style={s.heroConteudo}>
          <div style={s.heroTag}>Avalie. Corrija. Conecte. Eduque.</div>
          <h1 style={s.heroTitulo}>
            Todo o ciclo da avaliação,<br />
            <span style={s.heroTituloGradiente}>conectado em um só lugar</span>
          </h1>
          <p style={s.heroSubtitulo}>
            Nexos une aplicação de provas, correção e acompanhamento de
            desempenho numa plataforma só — para professores ganharem tempo
            e alunos entenderem melhor sua própria evolução.
          </p>
          <div style={s.heroBotoes}>
            <button style={s.btnPrimario} className="nexos-btn" onClick={onIrParaCadastro}>Começar agora</button>
            <button style={s.btnSecundario} className="nexos-btn" onClick={onIrParaLogin}>Já tenho conta</button>
          </div>
        </div>

        {/* Jornada — 4 etapas, tipografia grande e ousada */}
        <div style={s.jornada} className="nexos-jornada">
          {jornada.map(({ n, label, Icone, texto }) => (
            <div key={label} style={s.jornadaItem} className="nexos-jornada-item">
              <div style={s.jornadaTopo}>
                <span style={s.jornadaNumero}>{n}</span>
                <Icone size={20} style={s.jornadaIcone} />
              </div>
              <h3 style={s.jornadaLabel}>{label}</h3>
              <p style={s.jornadaTexto}>{texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seção Professor */}
      <section id="professores" style={s.secao}>
        <div style={s.secaoTag}>Para professores</div>
        <h2 style={s.secaoTitulo}>Tenha controle total sobre suas avaliações</h2>
        <div style={s.grid} className="nexos-grid">
          <div style={s.card} className="nexos-card">
            <div style={s.cardIcone}><ShieldCheck size={20} color="var(--nexos-blue)" /></div>
            <h3 style={s.cardTitulo}>Aplicação segura</h3>
            <p style={s.cardTexto}>
                Monitore troca de aba e saída de tela cheia durante a prova, veja quem
                já enviou, horário exato e alertas de comportamento suspeito.
            </p>
          </div>
        <div style={s.card} className="nexos-card">
            <div style={s.cardIcone}><Clock size={20} color="var(--nexos-blue)" /></div>
            <h3 style={s.cardTitulo}>Tempo controlado</h3>
            <p style={s.cardTexto}>
                Defina o tempo limite da prova e acompanhe o envio automático
                assim que o prazo se esgota.
            </p>
          </div>
        <div style={s.card} className="nexos-card">
            <div style={s.cardIcone}><Users size={20} color="var(--nexos-blue)" /></div>
            <h3 style={s.cardTitulo}>Crie turmas</h3>
            <p style={s.cardTexto}>
                Organize suas turmas, associe alunos e gerencie provas de
                forma centralizada para cada disciplina.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Aluno */}
      <section id="alunos" style={{ ...s.secao, background: "var(--nexos-bg-alt)" }}>
        <div style={s.secaoTag}>Para alunos</div>
        <h2 style={s.secaoTitulo}>Realize suas provas com tranquilidade</h2>
        <div style={s.grid} className="nexos-grid">
          <div style={s.card} className="nexos-card">
            <div style={s.cardIcone}><FileText size={20} color="var(--nexos-blue)" /></div>
            <h3 style={s.cardTitulo}>Provas organizadas</h3>
            <p style={s.cardTexto}>
              Visualize todas as suas avaliações disponíveis e acompanhe
              o tempo restante durante a realização.
            </p>
          </div>
          <div style={s.card} className="nexos-card">
            <div style={s.cardIcone}><BookOpen size={20} color="var(--nexos-blue)" /></div>
            <h3 style={s.cardTitulo}>Banco de questões</h3>
            <p style={s.cardTexto}>
              Estude com questões organizadas por disciplina, assunto
              e nível de dificuldade.
            </p>
          </div>
          <div style={s.card} className="nexos-card">
            <div style={s.cardIcone}><TrendingUp size={20} color="var(--nexos-blue)" /></div>
            <h3 style={s.cardTitulo}>Acompanhe seu desempenho</h3>
            <p style={s.cardTexto}>
              Veja sua evolução ao longo do tempo e identifique quais
              tópicos precisam de mais atenção.
            </p>
          </div>
        </div>
      </section>

      {/* Rodapé escuro */}
      <footer style={s.footer}>
        <div style={s.footerLogo}>
          <Logo dark height={22} />
        </div>
        <p style={s.footerTexto}>Avalie. Corrija. Conecte. Eduque. — Projeto acadêmico de Engenharia de Software</p>
      </footer>

    </div>
  )
}

const s = {
  pagina: {
    minHeight: "100vh",
    background: "#ffffff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 48px",
    position: "sticky",
    top: 0,
    background: "rgba(3, 8, 22, 0.85)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    zIndex: 10,
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  headerDireita: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  nav: {
    display: "flex",
    gap: "28px",
  },
  navLink: {
    fontSize: "14px",
    fontWeight: "500",
    color: "rgba(255,255,255,0.65)",
    textDecoration: "none",
    cursor: "pointer",
  },
  headerBotoes: {
    display: "flex",
    gap: "10px",
  },
  btnEntrar: {
    background: "none",
    border: "1.5px solid rgba(255,255,255,0.18)",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    padding: "8px 16px",
    fontFamily: "inherit",
  },
  btnCadastrar: {
    background: "linear-gradient(120deg, var(--nexos-blue), var(--nexos-purple))",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "9px 18px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  hero: {
    position: "relative",
    overflow: "hidden",
    background: "radial-gradient(ellipse 120% 100% at 50% -10%, #0d1a3d 0%, #030814 55%)",
    padding: "100px 24px 64px",
  },
  glowAzul: {
    position: "absolute",
    top: "-160px",
    left: "8%",
    width: "480px",
    height: "480px",
    borderRadius: "50%",
    background: "var(--nexos-cyan)",
    opacity: 0.22,
    filter: "blur(120px)",
    pointerEvents: "none",
  },
  glowRoxo: {
    position: "absolute",
    top: "40px",
    right: "6%",
    width: "440px",
    height: "440px",
    borderRadius: "50%",
    background: "var(--nexos-purple)",
    opacity: 0.24,
    filter: "blur(130px)",
    pointerEvents: "none",
  },
  heroConteudo: {
    position: "relative",
    zIndex: 2,
    maxWidth: "760px",
    margin: "0 auto",
    textAlign: "center",
  },
  heroTag: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--nexos-cyan)",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "20px",
  },
  heroTitulo: {
    fontSize: "clamp(34px, 5.5vw, 56px)",
    fontWeight: "800",
    color: "#ffffff",
    lineHeight: "1.15",
    letterSpacing: "-0.02em",
    margin: "0 0 22px",
  },
  heroTituloGradiente: {
    background: "linear-gradient(100deg, var(--nexos-cyan), var(--nexos-blue) 45%, var(--nexos-purple))",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  },
  heroSubtitulo: {
    fontSize: "17px",
    color: "rgba(255,255,255,0.62)",
    lineHeight: "1.65",
    margin: "0 0 36px",
    maxWidth: "580px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  heroBotoes: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "88px",
  },
  btnPrimario: {
    background: "linear-gradient(120deg, var(--nexos-cyan), var(--nexos-blue) 60%, var(--nexos-purple))",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 8px 28px rgba(16, 94, 220, 0.35)",
  },
  btnSecundario: {
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    border: "1.5px solid rgba(255,255,255,0.18)",
    borderRadius: "10px",
    padding: "14px 28px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  jornada: {
    position: "relative",
    zIndex: 2,
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "1px",
    maxWidth: "1100px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.09)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "16px",
    overflow: "hidden",
  },
  jornadaItem: {
    background: "rgba(6, 12, 30, 0.75)",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
  },
  jornadaTopo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "18px",
  },
  jornadaNumero: {
    fontSize: "34px",
    fontWeight: "800",
    color: "rgba(255,255,255,0.16)",
    letterSpacing: "-0.03em",
  },
  jornadaIcone: {
    color: "var(--nexos-cyan)",
  },
  jornadaLabel: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 8px",
  },
  jornadaTexto: {
    fontSize: "13.5px",
    color: "rgba(255,255,255,0.55)",
    lineHeight: "1.6",
    margin: 0,
  },
  secao: {
    padding: "80px 48px",
  },
  secaoTag: {
  textAlign: "center",
  fontSize: "12px",
  fontWeight: "600",
  color: "var(--nexos-blue)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "12px",
  opacity: 0.85,
  },
  secaoTitulo: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "var(--nexos-navy)",
    margin: "0 0 48px",
    maxWidth: "560px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  grid: {
    gap: "24px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
  background: "#ffffff",
  border: "1px solid var(--nexos-border)",
  borderRadius: "16px",
  padding: "28px",
  boxShadow: "0 1px 3px rgba(5, 20, 51, 0.04)",
  },
  cardIcone: {
  width: "44px",
  height: "44px",
  background: "var(--nexos-icon-bg)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
  },
  cardTitulo: {
    fontSize: "16px",
    fontWeight: "600",
    color: "var(--nexos-navy)",
    margin: "0 0 8px",
  },
  cardTexto: {
    fontSize: "13.5px",
    color: "var(--nexos-gray)",
    lineHeight: "1.6",
    margin: 0,
  },
  footer: {
    padding: "40px 48px 32px",
    background: "#030814",
    textAlign: "center",
  },
  footerLogo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "10px",
  },
  footerTexto: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.5)",
    margin: 0,
  },
}

export default Home
