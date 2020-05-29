const express = require('express');
const UsuariosController = require('./../controllers/usuarios-controller');

const router = express.Router();

router.post('/cadastro', UsuariosController.cadastrarUsuario);

router.post('/login', UsuariosController.logarUsuario);

module.exports = router;