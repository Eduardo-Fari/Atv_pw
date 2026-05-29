const http = require('http');
const fs = require('fs').promises;
const rotas = require('./src/rota/rotas.js');

const server = http.createServer(async(req,res)=>{
await rotas(req,res);
});

server.listen(3000, ()=>{
    console.log("rodando em: http://localhost:3000")
});
