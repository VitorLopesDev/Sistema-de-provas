# Sistema de Provas

Backend do módulo de provas — Laboratório de Engenharia de Software (UEPB).

## Equipe
- Backend: José Vitor Lopes
- Banco de dados: Edicarlos Januario Sales
- Frontend: Thiago Lustosa

## Stack
- Java 21 + Spring Boot 4.1.0
- Spring Security + JWT
- PostgreSQL (via Docker Compose)
- Maven

## Como rodar o banco de dados localmente

Pré-requisito: Docker instalado e rodando.

```bash
docker compose up -d
```

Isso sobe um container PostgreSQL com:
- Banco: `sistema_provas`
- Usuário/senha: `sistema_provas` / `sistema_provas`
- Porta: `5432`

Para conferir se subiu:
```bash
docker ps
```

Para acessar o banco via terminal:
```bash
docker exec -it sistema-provas-db psql -U sistema_provas -d sistema_provas
```

## Como rodar a aplicação

Com o banco de dados já rodando (passo acima):

```bash
mvn spring-boot:run
```
