const http = require('http');
const fs = require('fs').promises;

module.exports = async(req,res)=>{
    const url = req.url;
    let html = "";
    if(url === "/"){
        html = "olá aluno";
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(html);
    } else if(url === "/sobre"){
        html = "Olá, meu nome é Eduardo Faria e essa é a atividade de Api";
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        return res.end(html);
    }else if (url === "/api"){
        try{
            const data = await fs.readFile('./data.json');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(data);
        }catch(error){
            res.statusCode = 500;
            return res.end('Erro Interno do Servidor');
        }
    }else {
        try{
            const data = await fs.readFile('./src/public/erro.html');
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        } catch(error){
            res.statusCode = 500;
            return res.end('Erro Interno do Servidor');
            
        }
    }
}