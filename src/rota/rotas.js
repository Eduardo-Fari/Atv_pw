const http = require('http');
const fs = require('fs').promises;

module.exports = async(req,res)=>{

    const url = req.url;
    const urlCompleta = new URL(req.url, `https://${req.headers.host}`);
    const pathname = urlCompleta.pathname;
    const method = req.method;
    if(url === "/" && method === "GET"){
        try{
            const data = await fs.readFile('./src/public/home.json');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        } catch(error){
            res.statusCode = 500;
            return res.end('Erro Interno do Servidor');
            
        }
    } else if(url === "/sobre" && method === "GET"){
         try{
            const data = await fs.readFile('./src/public/sobre.json');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        } catch(error){
            res.statusCode = 500;
            return res.end('Erro Interno do Servidor');
            
        }
    } else if(url === "/status" && method === "GET"){
         try{
            const data = await fs.readFile('./src/public/status.json');
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(data);
        } catch(error){
            res.statusCode = 500;
            return res.end('Erro Interno do Servidor');
            
        }
    }else if (pathname.startsWith("/alunos/") && metodo === "PUT") {
        
        
        const partes = pathname.split("/");
        const idBuscado = partes[2];

        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', async () => {
            try {
                const dadosRecebidos = JSON.parse(body);
                const { nome, turma } = dadosRecebidos;

                const arquivo = await fs.readFile('./src/public/aluno.json', 'utf8');
                const alunos = JSON.parse(arquivo);

               
                const indiceAluno = alunos.findIndex(aluno => aluno.id == idBuscado);

                if (indiceAluno === -1) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ erro: "Aluno não encontrado." }));
                }

                
                alunos[indiceAluno] = {
                    id: alunos[indiceAluno].id,
                    nome: nome ? nome.trim() : alunos[indiceAluno].nome,
                    turma: turma ? turma.trim() : alunos[indiceAluno].turma
                };

               
                await fs.writeFile('./src/public/aluno.json', JSON.stringify(alunos, null, 2));

                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    mensagem: "Aluno atualizado com sucesso!",
                    aluno: alunos[indiceAluno]
                }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ erro: "Erro ao processar a requisição ou JSON inválido." }));
            }
        });
    }else if (pathname === "/alunos" && metodo === "POST") {
        let body = '';

       
        req.on('data', chunk => {
            body += chunk;
        });

        
        req.on('end', async () => {
            try {
                
                const dadosRecebidos = JSON.parse(body);
                const { nome, turma } = dadosRecebidos;

                
                if (!nome || !turma || nome.trim() === "" || turma.trim() === "") {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ erro: "Os campos 'nome' e 'turma' são obrigatórios e não podem estar vazios." }));
                }

            
                const arquivo = await fs.readFile('./src/public/aluno.json', 'utf8');
                const alunos = JSON.parse(arquivo);

               
                const novoAluno = {
                    id: Date.now(), 
                    nome: nome.trim(),
                    turma: turma.trim()
                };

                
                alunos.push(novoAluno);

               
                await fs.writeFile('./src/public/aluno.json', JSON.stringify(alunos, null, 2));

                
                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ mensagem: "Aluno cadastrado com sucesso!", aluno: novoAluno }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ erro: "Formato JSON inválido no corpo da requisição." }));
            }
        });
    }
    else if (url.startsWith("/alunos") && method === "GET") {
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
    } else if (pathname === "/produtos" && method == "GET") {
        try {
            
            const arquivo = await fs.readFile('./src/public/produtos.json');
            const produtos = JSON.parse(arquivo);

            const categoriaBuscada = urlCompleta.searchParams.get('categoria');

            if (categoriaBuscada) {
                const produtosFiltrados = produtos.filter(produto => 
                    produto.categoria.toLowerCase() === categoriaBuscada.toLowerCase()
                );

                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify(produtosFiltrados));
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(produtos));

        } catch (error) {
            res.statusCode = 500;
            return res.end('Erro Interno do Servidor ao ler produtos');
        }
    } else if (url === "/api" && method === "GET"){
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
