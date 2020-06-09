const mysqlDb = require('./../mysql');


exports.getPedidos = async (req, resp, next)=>{
    try {
        const query =  `SELECT pedidos.id_pedido,
                        pedidos.quantidade,
                        produtos.id_produto,
                        produtos.nome, 
                        produtos.preco 
                        FROM pedidos
                        INNER JOIN produtos ON produtos.id_produto = pedidos.id_produto;`;

        const resultado = await mysqlDb.execute(query);

        const response = {
            // quantidade: resultado.length,
            pedidos: resultado.map(ped => {
                return {
                    id_pedido: ped.id_pedido,
                    quantidade: ped.quantidade,
                    produto: {
                        id_produto: ped.id_produto,
                        nome: ped.nome,
                        preco: ped.preco
                    },
                    request: {
                        // OBS: os dados descrevem a request e não o a função da rota em si
                        tipo: 'GET',
                        descricao: 'Retorna os detalhes de um pedido específico',
                        url: 'http://localhost:3000/pedidos/' + ped.id_pedido
                    }
                }
            })
        };

        return resp.status(201).send({ response });
    } catch (error) {
        return resp.status(500).send({
            error: error
        });
    }
};


exports.postPedidos = async (req, resp, next)=>{
    try {
        const query = 'SELECT * FROM produtos WHERE id_produto=?';
        const queryPedido = 'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)';
        
        const resultado = await mysqlDb.execute(query, [req.body.id_produto]);
        
        if(resultado.length == 0) {
            return resp.status(404).send({
             mensagem: 'Não foi encontrado nenhum produto com este ID!'
            });
        }

        const resultadoPedido = await mysqlDb.execute(queryPedido, [
            req.body.id_produto, 
            req.body.quantidade
        ]);

        const response = {
            mensagem: 'Pedido criado com sucesso!',
            pedidoCriado: {
                id_pedido: resultadoPedido.id_pedido,
                id_produto: req.body.id_produto,
                quantidade: req.body.quantidade,
                request: {
                    // OBS: os dados descrevem a request e não o a função da rota em si
                    tipo: 'GET',
                    descricao: 'Retorna todos os pedidos',
                    url: 'http://localhost:3000/pedidos/'
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


exports.getPedido = async (req, resp, next)=>{

    try {
      const query = 'SELECT * FROM pedidos WHERE id_pedido=?;';
      const resultado = await mysqlDb.execute(query, [req.params.id_pedido]);
      

        if (resultado.length == 0) {
            return resp.status(404).send({
                mensagem: 'Pedido com este ID não foi encontrado!'
            });
        }

        const response = {
            pedido: {
                id_pedido: resultado[0].id_pedido,
                id_produto: resultado[0].id_produto,
                quantidade: resultado[0].quantidade,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os pedidos',
                    url: 'http://localhost:3000/pedidos'
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


exports.deletePedido = async (req, resp, next)=>{
    try {
     const query = 'DELETE FROM pedidos WHERE id_pedido=?';
     const resultado = await mysqlDb.execute(query, [req.body.id_pedido]);

     const response = {
        mensagem: 'Pedido removido com sucesso!',
        request: {
            tipo: 'POST',
            descricao: 'Insere um novo pedido!',
            url: 'http://localhost:3000/pedidos',
            body: {
                id_produto: 'Number',
                quantidade: 'Number'
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