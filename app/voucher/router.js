var express = require('express');
var router = express.Router();
const multer = require('multer')
const os = require('os')

const { index, viewCreate, viewEdit , actionCreate, actionEdit,actionDelete, actionStatus } = require('./controller')
const { isLoginAdmin } = require('../middleware/auth')

router.use(isLoginAdmin)
/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', multer({
    dest: os.tmpdir()
}).single('thumbnail') , actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', multer({
    dest: os.tmpdir()
}).single('thumbnail') , actionEdit);
router.delete('/delete/:id', actionDelete);
router.put('/status/:id', actionStatus);


module.exports = router;
