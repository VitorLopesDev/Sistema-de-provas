# Guia de Commits — Sistema de Provas

Este projeto segue o padrão **Conventional Commits**.

## Formato

```
tipo(escopo): descrição curta no imperativo
```

## Tipos (tags)

| Tag        | Quando usar                                             |
|------------|----------------------------------------------------------|
| `feat`     | Nova funcionalidade                                       |
| `fix`      | Correção de bug                                           |
| `refactor` | Reorganização de código sem mudar comportamento           |
| `docs`     | Documentação (README, comentários, guias)                 |
| `test`     | Testes automatizados                                      |
| `style`    | Formatação, espaçamento — sem mudança de lógica            |
| `chore`    | Tarefas de manutenção, configs, dependências               |
| `build`    | Mudanças no build (Maven, npm)                             |

## Escopos sugeridos

`auth`, `prova`, `questao`, `usuario`, `dashboard`, `docker`, `db`, `frontend`

## Regras

1. Descrição sempre no imperativo: "adiciona", não "adicionado" ou "adicionando".
2. Um commit = uma mudança lógica. Evitar commits gigantes com várias mudanças não relacionadas.
3. Se o commit fechar uma tarefa do Trello, referenciar no corpo do commit (ex.: `Refs #T04`).

## Exemplos reais do projeto

```
feat(auth): adiciona endpoint de login
fix(prova): corrige cálculo do tempo restante
docs: atualiza instruções de setup do Docker
chore(docker): configura docker-compose do postgres
refactor(security): extrai lógica de geração de JWT para service
test(auth): adiciona teste do endpoint de login
```
