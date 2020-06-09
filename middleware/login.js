const jwt = require('jsonwebtoken');

exports.obrigatorio = (req, res, next)=>{
 
    try {
     // Exemplo do parâmetro com o token recebido: Bearer string_token
     const tokenHeader = req.headers.authorization.split(' ')[1];
     const decode = jwt.verify(tokenHeader, process.env.JWT_KEY);

     // Antes o token era enviado via form-data com body, mas isso não é uma
     // boa prática, portanto o mesmo será enviado na via headers
     // const decode = jwt.verify(req.body.token, process.env.JWT_KEY);



     // req.usuario cria a varíavel usuario em para armazenar 
     // os dados do usuário que fazem parte do token (id_usuario e email),
     // ou seja, o token decodificado, que foi criado na rota /login do módulo usuários
     // O JavaScript permite a criação de atributos com essa sintaxe.
     // Ex: req.usuario
     // req.usuario.id_usuario
     // req.usuario.email
     req.usuario = decode;
     next();
    } catch (error) {
        return res.status(401).send({
            mensagem: 'Falha na autenticação!'
        });
    }

};

// Verificação que onde não é obrigatório a passagem do token,
// mas que recebe os dados do usuário para usar nas operações do sistema
exports.opcional = (req, res, next)=>{
 
    try {
     const tokenHeader = req.headers.authorization.split(' ')[1];
     const decode = jwt.verify(tokenHeader, process.env.JWT_KEY);
    
     req.usuario = decode;
     next();
    } catch (error) {
        next();
    }

};