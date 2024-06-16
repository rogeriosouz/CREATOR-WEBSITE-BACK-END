![Captura de Tela (18)](https://github.com/rogeriosouz/CREATOR-WEBSITE/assets/76504596/4335b0bb-8743-44d4-b139-57d549be2dda)

# CREATOR WEBSITE BACK END

## 🚀introdução
O back-end do Creator-Website é a base que suporta as funcionalidades do editor online de páginas web, fornecendo serviços essenciais para salvar, carregar e gerenciar projetos de forma eficiente e segura. Esta API foi desenvolvida para facilitar a comunicação entre o front-end do Creator-Website e o servidor, garantindo uma experiência de usuário

### ⚙️ Pré-requisitos
  * Node js -- https://nodejs.org/en
  * Docker -- https://docs.docker.com/engine/install/
  * yarn -- https://yarnpkg.com/

### 🛠️ Quia de instalação

Etapas para instalação
```
git clone https://github.com/rogeriosouz/CREATOR-WEBSITE-BACK-END.git
```
Passo 2
```
npm i
```
Passo 3
```
Adicionar variáveis ambientes
DATABASE_URL="postgresql://root:root@localhost:5432/creator-website"
PORT=3333
SECRET_AUTH_USER=""
```
Passo 4
```
docker compose up -d
```
Passo 5
```
yarn start:dev
```

### 📦 Tecnologias utilizadas
* [Node js](https://nodejs.org/en)
* [vitest](https://vitest.dev/)
* [Typescript](https://www.typescriptlang.org)
* [fastify](https://fastify.dev)
* [PostgreSQL](https://www.postgresql.org/)
* [zod](https://zod.dev/)

### 👷 Autores / Colaboradores

* **rogeriosouz** - *Criador do projeto*
