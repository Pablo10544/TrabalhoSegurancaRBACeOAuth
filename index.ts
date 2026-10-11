import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import session from "express-session";

dotenv.config();
const app = express();
app.use( session({
    secret: "segredo-para-desenvolvimento",
    resave: false,
    saveUninitialized: false,
  }));
const PORT = 3000;
const client = new OAuth2Client(
process.env.GOOGLE_CLIENT_ID,
process.env.GOOGLE_CLIENT_SECRET,
process.env.GOOGLE_REDIRECT_URI
);
app.get('/', (req, res) => {
const url = client.generateAuthUrl({
access_type: 'offline',
scope: ['email', 'profile', 'openid'],
});
res.send(`<a href=${url}>Login com Google</a>`);
});
app.get('/callback', async (req, res) => {
try {
const { code } = req.query;
const { tokens } = await client.getToken(code);
client.setCredentials(tokens);
const ticket = await client.verifyIdToken({
idToken: tokens.id_token,
audience: process.env.GOOGLE_CLIENT_ID,
});
const payload = ticket.getPayload();
const name = encodeURIComponent(payload.name);
const email = encodeURIComponent(payload.email);
req.session.role= 'visitor';
if(payload.email.includes('estudante.ufjf.br')){
req.session.role = 'aluno';
}
//paper = encodeURIComponent(paper);
// Redireciona para a página de boas-vindas com parâmetros
res.redirect(`/welcome?name=${name}&email=${email}`);
} catch (error) {
console.error('Erro na autenticação:', error);
res.status(500).send('Erro ao autenticar com o Google.');
}
});
app.get('/welcome', (req, res) => {
const { name, email } = req.query;
const role = req.session.role;

if(role=="aluno"){
res.send(`
<h1>Bem-vindo, ${name}!</h1>
<p>Você é um aluno da ufjf de email: ${email}!</p>
<p>Seja bem vindo ao painel do aluno.</p>
`);

}else{

res.send(`
<h1>Usuário ${name} não autorizado a ver painel do aluno!</h1>
`);}
});
app.listen(PORT, () => {
console.log(`Servidor rodando em http://localhost:${PORT}`);
});