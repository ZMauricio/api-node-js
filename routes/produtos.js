const express = require('express');
const multer = require('multer');
const login = require('./../middleware/login');
const ProdutosController = require('./../controllers/produtos-controller');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (req, file, callback) {
        // Date().toISOString() é usado para evitar sobrescrita de arquivos
        callback(null, new Date().toISOString().replace(/:/g,'-') + file.originalname);
    }
});

const fileFilter = (req, file, callback)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
     callback(null, true);
    } else {
        callback(null, false);
    }
};

const upload = multer({
                storage: storage,
                limits: {
                    fileSize: 1024*1024*5 // 5MB
                },
                fileFilter: fileFilter
              });

// Retorna todos os produtos
router.get('/', ProdutosController.getProdutos);

// Insere um produto
// Obs: login é passado como parâmetro depois de upload.single() pois o token é só 
// capturado após o carregamento da imagem. Caso ele seja passado primeiro como parâmetro o 
// o token não é capturado pois mesmo assim a imagem é carregada antes.
// Isso ocorre pois os dados são enviados via form-data.
router.post('/', upload.single('produto_imagem'), login.obrigatorio, ProdutosController.postProduto);

// Retorna os dados de um produto específico pelo id_produto
router.get('/:id_produto', ProdutosController.getProduto);


// Atualiza os dados de um produto
router.patch('/', login.obrigatorio, ProdutosController.patchProduto);


// Deleta os dados de um produto pelo id_produto
router.delete('/', login.obrigatorio, ProdutosController.deleteProduto);

module.exports = router;