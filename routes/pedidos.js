const express = require('express');
const login = require('./../middleware/login');

const PedidosController = require('./../controllers/pedidos-controller');
const router = express.Router();


// Retorna todos os pedidos
router.get('/', PedidosController.getPedidos);

// Insere um pedido
router.post('/', login.obrigatorio, PedidosController.postPedidos);

// Retorna os dados de um pedido específico pelo id_pedido
router.get('/:id_pedido', PedidosController.getPedido);

// Deleta os dados de um pedido pelo id_pedido
router.delete('/', login.obrigatorio, PedidosController.deletePedido);

module.exports = router;