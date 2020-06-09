const mysqlDb = require('./../mysql');

// Versão melhorada com promises e async/await(evitar problemas de sincronização e callbacks aninhados)
exports.getProdutos = async (req, resp, next)=>{
    try {
        const query = 'SELECT * FROM produtos;';
        const resultado = await mysqlDb.execute(query);
        const response = {
            quantidade: resultado.length,
            produtos: resultado.map(prod => {
                return {
                    id_produto: prod.id_produto,
                    nome: prod.nome,
                    preco: prod.preco,
                    imagem_produto: prod.imagem_produto,
                    request: {
                        // OBS: os dados descrevem a request e não o a função da rota em si
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um produto específico',
                        url: 'http://localhost:3000/produtos/' + prod.id_produto
                    }
                }
            })
        };

        return resp.status(201).send({ response });

    } catch(error) {
        return resp.status(500).send({
            error: error
        });
    }
};

exports.postProduto = async (req, resp, next)=>{
    try {
        const query = 'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)';
        const resultado = await mysqlDb.execute(query, [
            req.body.nome,
            req.body.preco, 
            req.file.path
        ]);

        const response = {
            mensagem: 'Produto criado com sucesso!',
            produtoCriado: {
                id_produto: resultado.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                imagem_produto: req.file.path,
                request: {
                    // OBS: os dados descrevem a request e não o a função da rota em si
                    tipo: 'GET',
                    descricao: 'Retorna todos os produtos',
                    url: 'http://localhost:3000/produtos/'
                }
            }
        };

        return resp.status(201).send(response);
    } catch (error) {
        return resp.status(500).send({
            error: error
        });
    }
};



exports.getProduto = async (req, resp, next)=>{
    try {
        const query = 'SELECT * FROM produtos WHERE id_produto=?;';
        const resultado = await mysqlDb.execute(query, [req.params.id_produto]);

        if(resultado.length == 0) {
            return resp.status(404).send({
               mensagem: 'Produto com este ID não foi encontrado!'
            });
        }

        const response = {
            produto: {
                id_produto: resultado[0].id_produto,
                nome: resultado[0].nome,
                preco: resultado[0].preco,
                imagem_produto: resultado[0].imagem_produto,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os produtos',
                    url: 'http://localhost:3000/produtos'
                }
            }
        };

        return resp.status(200).send(response);
    } catch (error) {
        return resp.status(500).send({
            error: error
        });
    }    
};


exports.patchProduto = async (req, resp, next)=>{
    try {
        const query =  `UPDATE produtos
                        SET   nome      =?,
                            preco     =?
                        WHERE id_produto=?`;
        const resultado = await mysqlDb.execute(query, [
            req.body.nome, 
            req.body.preco, 
            req.body.id_produto
        ]);

        const response = {
            mensagem: 'Produto atualizado com sucesso!',
            produtoAtualizado: {
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                    // OBS: os dados descrevem a request e não o a função da rota em si
                    tipo: 'GET',
                    descricao: 'Retorna os detalhes de um produto específico',
                    url: 'http://localhost:3000/produtos/' + req.body.id_produto
                }
            }
        };

        return resp.status(202).send(response);

    } catch (error) {
        return resp.status(500).send({
            error: error
        });
    }
};


exports.deleteProduto = async (req, resp, next)=>{
    try {
        const query= 'DELETE FROM produtos WHERE id_produto=?';
        const resultado = await mysqlDb.execute(query, [req.body.id_produto]);

        const response = {
            mensagem: 'Produto removido com sucesso!',
            request: {
                tipo: 'POST',
                descricao: 'Insere um novo produto!',
                url: 'http://localhost:3000/produtos',
                body: {
                    nome: 'String',
                    preco: 'Number'
                }
            }
        };

        return resp.status(202).send(response);
    } catch (error) {
        return resp.status(500).send({
            error: error
        });
    }
};

//===========================================================================
/*
Versão melhorada sem async/await, apenas com promises
exports.getProdutos = (req, resp, next)=>{
    mysqlDb.execute('SELECT * FROM produtos;').then((resultado)=>{

        const response = {
            quantidade: resultado.length,
            produtos: resultado.map(prod => {
                return {
                    id_produto: prod.id_produto,
                    nome: prod.nome,
                    preco: prod.preco,
                    imagem_produto: prod.imagem_produto,
                    request: {
                        // OBS: os dados descrevem a request e não o a função da rota em si
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um produto específico',
                        url: 'http://localhost:3000/produtos/' + prod.id_produto
                    }
                }
            })
        };

        return resp.status(201).send({ response });
    }).catch((error)=>{
        return resp.status(500).send({
            error: error
        });
    });
};
*/

/*
exports.getProdutos = (req, resp, next)=>{
    mysqlDb.getConnection((error, conn)=>{
        if(error) {
         return resp.status(500).send({
           error: error
         });
        }

        conn.query(
            'SELECT * FROM produtos;',
            (error, resultado, fields)=>{
                // conn.release() libera a conexão
                // deve ser SEMPRE feito para evitar que se atinja 
                // o número limite de conexões abertas e assim trave a API
                conn.release();

                if(error) {
                 return resp.status(500).send({
                    error: error,
                    response: null
                 });
                }

                const response = {
                 quantidade: resultado.length,
                 produtos: resultado.map(prod=>{
                    return {
                        id_produto: prod.id_produto,
                        nome: prod.nome,
                        preco: prod.preco,
                        imagem_produto: prod.imagem_produto,
                        request: {
                            // OBS: os dados descrevem a request e não o a função da rota em si
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produto específico',
                            url: 'http://localhost:3000/produtos/'+prod.id_produto
                        }
                    }
                 })
                };

                return resp.status(201).send({response});
            }
        );
    });

};
*/

/*
exports.postProduto = (req, resp, next)=>{
    console.log(req.file);

    mysqlDb.getConnection((error, conn)=>{
        if(error) {
         return resp.status(500).send({
            error: error
         });
        }
        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)', [req.body.nome, req.body.preco, req.file.path],
            (error, resultado, fields)=>{
                // conn.release() libera a conexão
                // deve ser SEMPRE feito para evitar que se atinja 
                // o número limite de conexões abertas e assim trave a API
                conn.release();

                if(error) {
                 return resp.status(500).send({
                    error: error,
                    response: null
                 });
                }

                const response = {
                    mensagem: 'Produto criado com sucesso!',
                    produtoCriado: {
                        id_produto: resultado.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
                        request: {
                            // OBS: os dados descrevem a request e não o a função da rota em si
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos/'
                        }
                    }
                };

                return resp.status(201).send(response);

                // Antes era:
                // resp.status(201).send({
                //     // Em resultado.insertId, insertId é o id do produto cadastrado
                //     mensagem: 'Produto criado com sucesso!',
                //     id_produto: resultado.insertId
                // });

            }
        );
    });

};
*/

/*
exports.getProduto = (req, resp, next)=>{
    // const id = req.params.id_produto;

    // if (id === 'especial') {
    //     resp.status(200).send({
    //         mensagem: 'O GET obteve um id especial',
    //         id: id
    //     });
    // } else {
    //     resp.status(200).send({
    //         // mensagem: `Usando o GET e obtendo o id_produto: ${id}`
    //         mensagem: `Usando o GET e obtendo o id_produto`,
    //         id: id
    //     });
    // }
    mysqlDb.getConnection((error, conn)=>{
        if(error) {
         return resp.status(500).send({
           error: error
         });
        }

        conn.query(
            'SELECT * FROM produtos WHERE id_produto=?;',
            [req.params.id_produto],
            (error, resultado, fields)=>{
                // conn.release() libera a conexão
                // deve ser SEMPRE feito para evitar que se atinja 
                // o número limite de conexões abertas e assim trave a API
                conn.release();

                if(error) {
                 return resp.status(500).send({
                    error: error,
                    response: null
                 });
                }

                if(resultado.length == 0) {
                 return resp.status(404).send({
                    mensagem: 'Produto com este ID não foi encontrado!'
                 });
                }

                const response = {
                    produto: {
                        id_produto: resultado[0].id_produto,
                        nome: resultado[0].nome,
                        preco: resultado[0].preco,
                        imagem_produto: resultado[0].imagem_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                };

               return resp.status(200).send(response);
            }
        );
    });
    
};
*/

/*
exports.patchProduto = (req, resp, next)=>{
    
    mysqlDb.getConnection((error, conn)=>{
        if(error) {
         return resp.status(500).send({
            error: error
         });
        }
        conn.query(
            `UPDATE produtos
             SET   nome      =?,
                   preco     =?
             WHERE id_produto=?`,
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, resultado, fields)=>{
                // conn.release() libera a conexão
                // deve ser SEMPRE feito para evitar que se atinja 
                // o número limite de conexões abertas e assim trave a API
                conn.release();

                if(error) {
                 return resp.status(500).send({
                    error: error,
                    response: null
                 });
                }

                const response = {
                    mensagem: 'Produto atualizado com sucesso!',
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            // OBS: os dados descrevem a request e não o a função da rota em si
                            tipo: 'GET',
                            descricao: 'Retorna os detalhes de um produto específico',
                            url: 'http://localhost:3000/produtos/'+req.body.id_produto
                        }
                    }
                };


              return resp.status(202).send(response);
            }
        );
    });
};
*/

/*
exports.deleteProduto = (req, resp, next)=>{
   
    mysqlDb.getConnection((error, conn)=>{
        if(error) {
         return resp.status(500).send({
            error: error
         });
        }
        conn.query(
            'DELETE FROM produtos WHERE id_produto=?',
            [req.body.id_produto],
            (error, resultado, fields)=>{
                // conn.release() libera a conexão
                // deve ser SEMPRE feito para evitar que se atinja 
                // o número limite de conexões abertas e assim trave a API
                conn.release();

                if(error) {
                 return resp.status(500).send({
                    error: error,
                    response: null
                 });
                }

                const response = {
                 mensagem: 'Produto removido com sucesso!',
                 request: {
                     tipo: 'POST',
                     descricao: 'Insere um novo produto!',
                     url: 'http://localhost:3000/produtos',
                     body: {
                         nome: 'String',
                         preco: 'Number'
                     }
                 }
                };

                return resp.status(202).send(response);
            }
        );
    });
};
*/