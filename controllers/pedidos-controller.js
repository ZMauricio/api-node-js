const mysqlDb = require('./../mysql').pool;


exports.getPedidos = (req, resp, next)=>{
    mysqlDb.getConnection((error, conn)=>{
        if(error) {
         return resp.status(500).send({
           error: error
         });
        }

        conn.query(
             // 'SELECT * FROM pedidos;',
            `SELECT pedidos.id_pedido,
                    pedidos.quantidade,
                    produtos.id_produto,
                    produtos.nome, 
                    produtos.preco 
                    FROM pedidos
                    INNER JOIN produtos ON produtos.id_produto = pedidos.id_produto;`,
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
                 // quantidade: resultado.length,
                 pedidos: resultado.map(ped=>{
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
                            url: 'http://localhost:3000/pedidos/'+ped.id_pedido
                        }
                    }
                 })
                };

                return resp.status(201).send({response});
            }
        );
    });
};


exports.postPedidos = (req, resp, next)=>{
    mysqlDb.getConnection((error, conn)=>{
     if(error) {
         return resp.status(500).send({
            error: error
         });
     }
 
     conn.query('SELECT * FROM produtos WHERE id_produto=?',
         [req.body.id_produto],
         (error, resultado, fields)=>{
 
             if(error) {
              return resp.status(500).send({
               error: error
              });
             }
 
             if(resultado.length == 0) {
              conn.release();
 
              return resp.status(404).send({
               mensagem: 'Não foi encontrado nenhum produto com este ID!'
              });
             }
 
             conn.query(
                 'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)', [req.body.id_produto, req.body.quantidade],
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
                         mensagem: 'Pedido criado com sucesso!',
                         pedidoCriado: {
                             id_pedido: resultado.id_pedido,
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
                 }
             );
         }
     );
 
    });
 
     /*
     mysqlDb.getConnection((error, conn)=>{
         if(error) {
          return resp.status(500).send({
             error: error
          });
         }
 
         conn.query(
             'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)', [req.body.id_produto, req.body.quantidade],
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
                     mensagem: 'Pedido criado com sucesso!',
                     pedidoCriado: {
                         id_pedido: resultado.id_pedido,
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
             }
         );
     });
     */
};

exports.getPedido = (req, resp, next)=>{

    mysqlDb.getConnection((error, conn)=>{
        if(error) {
         return resp.status(500).send({
           error: error
         });
        }

        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido=?;',
            [req.params.id_pedido],
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
            }
        );
    });
  
};

exports.deletePedido = (req, resp, next)=>{
    mysqlDb.getConnection((error, conn)=>{
        if(error) {
         return resp.status(500).send({
            error: error
         });
        }
        conn.query(
            'DELETE FROM pedidos WHERE id_pedido=?',
            [req.body.id_pedido],
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
            }
        );
    });
};