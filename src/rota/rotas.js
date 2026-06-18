const http = require('http');
const fs = require('fs').promises;

module.exports = async(req,res)=>{
    const url = req.url;
    let html = "";
    if(url === "/"){
        try{
            const data = await fs.readFile('./src/public/home.json');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        } catch(error){
            res.statusCode = 500;
            return res.end('Erro Interno do Servidor');
            
        }
    } else if(url === "/sobre"){
         try{
            const data = await fs.readFile('./src/public/sobre.json');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        } catch(error){
            res.statusCode = 500;
            return res.end('Erro Interno do Servidor');
            
        }
    } else if(url === "/status"){
         try{
            const data = await fs.readFile('./src/public/status.json');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        } catch(error){
            res.statusCode = 500;
            return res.end('Erro Interno do Servidor');
            
        }
    if (url.startsWith("/alunos")) {
        try {
            const arquivo = await fs.readFile('./src/public/aluno.json');
            const alunos = JSON.parse(arquivo);
            
            const partes = url.split("/"); 
            const id = partes[2]; 

            if (id) {
                const alunoEncontrado = alunos.find(aluno => aluno.id == id);
                
                if (alunoEncontrado) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify(alunoEncontrado));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ erro: "Aluno nao encontrado" }));
                }
            } 
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(alunos));

        } catch (error) {
            res.statusCode = 500;
            return res.end('Erro Interno do Servidor');
        }
    } else if (url === "/api"){
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
}