# oauthproject
Esse projeto foi feito para implementar o Oauth2.0 do google em conjunto com o RBAC, tendo três papeis configurados:
Visitante, Aluno e professor.
## Como rodar
Instale as dependências:
```bash
bun install
```
preencha o .env com os campos:
```
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/callback
```
Para rodar:

```bash
bun --env-file=process.env index.ts   
```
