
# Projeto Food Explorer-api

O Food Explorer é o projeto final do curso Explorer da Rocketseat, tratando-se de um sistema de pedidos de comida, semelhante ao iFood. 

O projeto abrange diversas funcionalidades, cadastro, login, utilizando tokens para autenticação, inclusão de itens no pedido em quantidade desejada, opção de favoritar o prato, lista de favoritos, página de confirmação dos itens e finalização do pedindo com pagamento (é importante ressaltar que essa funcionalidade é apenas uma representação e não efetua transações reais), além de conter uma pagina com a lista de todos os pedidos realizados, e na página detalhada do pedido já feito, o opção de acompanhar o estatus do pedido EM TEMPO REAL.

É relevante notar que o sistema possui dois tipos de usuários: o administrador (admin) e o usuário (user), cada um com permissões distintas e acesso a recursos específicos.

O administrador possui a capacidade de adicionar novos pratos, editar os já existentes ou excluí-los, também possui a funcionalidade de favoritar pratos, além de ser o responsável por atualizar o estatus dos pedidos, desde a confirmação e entrega do pedido, para o cancelamento do mesmo.


## Tecnologias e Principais bibliotecas
- Node.js
- TypeScript
- SQlite (database)
- Express (lib)
- Zod (lib)
- Knex (lib)

## Execução

Clone the project

```bash
  git git@github.com:larissapeixotoac/project-food-explorer-api.git
```

Go to the project directory

```bash
  cd food-explorer-api
```

Install dependencies

```bash
  npm install
```

Generate a database and apply the migrations

```bash
  npm run migrate
```

Start the server

```bash
  npm run dev  
```
The server will initialize in http://localhost:3333 
