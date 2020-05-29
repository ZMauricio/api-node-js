const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');

const app = express();

// o morgan serve para monitorar a execução
// do projeto, imprimindo logs do que está
// ocorrendo (ações executadas) no terminal
// Ex: GET /produtos 200 25.431 ms - 55
app.use(morgan('dev'));

// Define uma espécie de "rota" que torna o diretório /uploads público, ou seja, acessível
// Ex: http://localhost:3000/uploads/2020-05-28T21-40-34.528Zarroz.jpg
app.use('/uploads', express.static('uploads'));

// O body-parser é responsável por definir o corpo da entrada da requisição, ou seja, o body
// Logo, usa a propriedade req.body
// Obs: urlencoded({extended: false}) define que são aceitos apenas dados simples
app.use(bodyParser.urlencoded({extended: false}));
// O bodyParser.json() define que são aceitos apenas dados de entrada no formato JSON
app.use(bodyParser.json());

// Define o CORS (Croos Origin Resource Sharing)
app.use((req, res, next)=>{
    // O * define que a requisição de acesso pode vir de qualquer origem (servidor)
    // Caso contrário, deveria ser especificado o servidor. ex: https://www.nomeservidor.com.br
    res.header('Access-Control-Allow-Origin', '*');
    // Define as propriedades de cabeçalho aceitas
    res.header('Access-Control-Allow-Header',
               'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Define os métodos que são permitos para serem requisitados
    if(req.method === 'OPTIONS') {
     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
     return res.status(200).send({});
    }

    next();
});


// Registra as rotas
app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/usuarios', rotaUsuarios);

// Tratamento de erro para quando é acessada uma rota que não existe.
// Essa condição deve ser implementada após o registro das rotas, conforme 
// o definido neste código.
app.use((req, res, next)=>{
 const erro = new Error('Rota não encontrada!');
 erro.status = 404;
 next(erro);
});

app.use((error, req, res, next)=>{
 res.status(error.status || 500);
 return res.send({
    erro: {
     mensagem: error.message
    }
 });
});

// app.use('/teste',(req, res, next)=>{
//     res.status(200).send({
//         mensagem: 'Oi, eu sou Goku!'
//     });
// });

module.exports = app;