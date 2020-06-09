const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysqlDb = require('./../mysql');

exports.cadastrarUsuario = async (req, resp, next)=>{

    try {
     const query = 'SELECT * FROM usuarios WHERE email=?';
     const queryUsuario = 'INSERT INTO usuarios (email, senha) VALUES (?, ?)';

     const resultado = await mysqlDb.execute(query, [req.body.email]);

        if(resultado.length > 0) {
          return resp.status(409).send({
            mensagem: 'Usuário já cadastrado!'
          });
        } else {

            // O segundo parâmetro é o SALT (quanto maior o valor de SALT, maior a segurança, mas também é maior o custo computacional para gerar o hash)
            bcrypt.hash(req.body.senha, 10, async (errorBcrypt, hash) => {
                if(errorBcrypt) {
                  return resp.status(500).send({
                    error: errorBcrypt
                  });
                }

                const resultadoUsuario = await mysqlDb.execute(queryUsuario, [req.body.email, hash]);

                const response = {
                    mensagem: 'Usuário cadastrado com sucesso!',
                    usuarioCriado: {
                        id_usuario: resultadoUsuario.insertId,
                        email: req.body.email
                    }
                };


                return resp.status(201).send(response);
            });

        }
     
    } catch (error) {
        return resp.status(500).send({
            error: error
        });
    }

};

exports.logarUsuario = async (req, resp, next)=>{

    try {
     const query = 'SELECT * FROM usuarios WHERE email=?';
     const resultado = await mysqlDb.execute(query, [req.body.email]);

        if (resultado.length < 1) {
            return resp.status(401).send({
                mensagem: 'Falha na autenticação!'
            });
        }

        bcrypt.compare(req.body.senha, resultado[0].senha, (error, results) => {
            if (error) {
                return resp.status(401).send({
                    mensagem: 'Falha na autenticação!'
                });
            }

            // se a resposta do compare for true
            if (results) {
                const token = jwt.sign({
                                id_usuario: resultado[0].id_usuario,
                                email: resultado[0].email
                              },
                              process.env.JWT_KEY,
                              {
                                expiresIn: '1h'
                              });

                return resp.status(200).send({
                    mensagem: 'Autenticado com sucesso!',
                    token: token
                });
            }

            // Caso o usuário erro a senha
            return resp.status(401).send({
                mensagem: 'Falha na autenticação!'
            });
        });

    } catch (error) {
        return resp.status(500).send({
            error: error
        });
    }

};