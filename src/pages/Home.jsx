import { FileText, ShieldCheck, BarChart3, Clock, BookOpen, TrendingUp, Users } from "lucide-react"

function Home({ onIrParaLogin, onIrParaCadastro }) {
  return (
    <div style={s.pagina}>

      {/* Header */}
      <header style={s.header}>
        <div style={s.logo}>
          <div style={s.logoIcone}>A</div>
          <span style={s.logoTexto}>AvaliaFácil</span>
        </div>

        <div style={s.headerDireita}>
          <nav style={s.nav}>
            <a href="#professores" style={s.navLink}>Professor</a>
            <a href="#alunos" style={s.navLink}>Aluno</a>
          </nav>

          <div style={s.headerBotoes}>
            <button style={s.btnEntrar} onClick={onIrParaLogin}>Entrar</button>
            <button style={s.btnCadastrar} onClick={onIrParaCadastro}>Cadastre-se</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={s.hero}>
        <h1 style={s.heroTitulo}>
          Aplique e corrija provas<br />com segurança
        </h1>
        <p style={s.heroSubtitulo}>
          Uma plataforma completa para professores aplicarem avaliações online
          com monitoramento em tempo real, e para alunos acompanharem seu
          desempenho de forma clara e organizada.
        </p>
        <div style={s.heroBotoes}>
          <button style={s.btnPrimario} onClick={onIrParaCadastro}>Começar agora</button>
          <button style={s.btnSecundario} onClick={onIrParaLogin}>Já tenho conta</button>
        </div>
      </section>

      {/* Seção Professor */}
      <section id="professores" style={s.secao}>
        <div style={s.secaoTag}>Para professores</div>
        <h2 style={s.secaoTitulo}>Tenha controle total sobre suas avaliações</h2>
        <div style={s.grid}>
          <div style={s.card}>
            <div style={s.cardIcone}><ShieldCheck size={20} color="#1F5C6B" /></div>
            <h3 style={s.cardTitulo}>Aplicação segura</h3>
            <p style={s.cardTexto}>
                Monitore troca de aba e saída de tela cheia durante a prova, veja quem
                já enviou, horário exato e alertas de comportamento suspeito.
            </p>
          </div>
        <div style={s.card}>
            <div style={s.cardIcone}><Clock size={20} color="#1F5C6B" /></div>
            <h3 style={s.cardTitulo}>Tempo controlado</h3>
            <p style={s.cardTexto}>
                Defina o tempo limite da prova e acompanhe o envio automático
                assim que o prazo se esgota.
            </p>
          </div>
        <div style={s.card}>
            <div style={s.cardIcone}><Users size={20} color="#1F5C6B" /></div>
            <h3 style={s.cardTitulo}>Crie turmas</h3>
            <p style={s.cardTexto}>
                Organize suas turmas, associe alunos e gerencie provas de
                forma centralizada para cada disciplina.
            </p>
          </div>
        </div>
      </section>

      {/* Seção Aluno */}
      <section id="alunos" style={{ ...s.secao, background: "#f7f6f2" }}>
        <div style={s.secaoTag}>Para alunos</div>
        <h2 style={s.secaoTitulo}>Realize suas provas com tranquilidade</h2>
        <div style={s.grid}>
          <div style={s.card}>
            <div style={s.cardIcone}><FileText size={20} color="#1F5C6B" /></div>
            <h3 style={s.cardTitulo}>Provas organizadas</h3>
            <p style={s.cardTexto}>
              Visualize todas as suas avaliações disponíveis e acompanhe
              o tempo restante durante a realização.
            </p>
          </div>
          <div style={s.card}>
            <div style={s.cardIcone}><BookOpen size={20} color="#1F5C6B" /></div>
            <h3 style={s.cardTitulo}>Banco de questões</h3>
            <p style={s.cardTexto}>
              Estude com questões organizadas por disciplina, assunto
              e nível de dificuldade.
            </p>
          </div>
          <div style={s.card}>
            <div style={s.cardIcone}><TrendingUp size={20} color="#1F5C6B" /></div>
            <h3 style={s.cardTitulo}>Acompanhe seu desempenho</h3>
            <p style={s.cardTexto}>
              Veja sua evolução ao longo do tempo e identifique quais
              tópicos precisam de mais atenção.
            </p>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer style={s.footer}>
        <p style={s.footerTexto}>AvaliaFácil — Projeto acadêmico de Engenharia de Software</p>
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
    borderBottom: "1px solid #E4E2D9",
    position: "sticky",
    top: 0,
    background: "#ffffff",
    zIndex: 10,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoIcone: {
    width: "32px",
    height: "32px",
    background: "#040220",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: "16px",
  },
  logoTexto: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#040220",
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
    color: "#5F5E5A",
    textDecoration: "none",
    cursor: "pointer",
  },
  headerBotoes: {
    display: "flex",
    gap: "10px",
  },
  btnEntrar: {
  background: "none",
  border: "1.5px solid #E4E2D9",
  borderRadius: "8px",
  color: "#040220",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  padding: "8px 16px",
  fontFamily: "inherit",
  },
  btnCadastrar: {
    background: "#1F5C6B",
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
    maxWidth: "720px",
    margin: "0 auto",
    minHeight: "calc(100vh - 73px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "24px",
    textAlign: "center",
  },
  heroTitulo: {
    fontSize: "44px",
    fontWeight: "700",
    color: "#040220",
    lineHeight: "1.2",
    margin: "0 0 20px",
  },
  heroSubtitulo: {
    fontSize: "16px",
    color: "#5F5E5A",
    lineHeight: "1.6",
    margin: "0 0 32px",
  },
  heroBotoes: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  btnPrimario: {
    background: "#1F5C6B",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "13px 26px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnSecundario: {
    background: "#fff",
    color: "#040220",
    border: "1.5px solid #E4E2D9",
    borderRadius: "10px",
    padding: "13px 26px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  secao: {
    padding: "80px 48px",
  },
  secaoTag: {
  textAlign: "center",
  fontSize: "12px",
  fontWeight: "600",
  color: "#1F5C6B",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: "12px",
  opacity: 0.85,
  },
  secaoTitulo: {
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "700",
    color: "#040220",
    margin: "0 0 48px",
    maxWidth: "560px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
  background: "#ffffff",
  border: "1px solid #E4E2D9",
  borderRadius: "16px",
  padding: "28px",
  boxShadow: "0 1px 3px rgba(4, 2, 32, 0.04)",
  },
  cardIcone: {
  width: "44px",
  height: "44px",
  background: "#D6E7EA",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "16px",
  },
  cardTitulo: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#040220",
    margin: "0 0 8px",
  },
  cardTexto: {
    fontSize: "13.5px",
    color: "#5F5E5A",
    lineHeight: "1.6",
    margin: 0,
  },
  footer: {
    padding: "32px 48px",
    borderTop: "1px solid #E4E2D9",
    textAlign: "center",
  },
  footerTexto: {
    fontSize: "13px",
    color: "#5F5E5A",
    margin: 0,
  },
}

export default Home