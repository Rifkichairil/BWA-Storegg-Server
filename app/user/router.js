var express = require('express');
var router = express.Router();
const { viewSignin, actionSignin, actionLogout } = require('./controller')

/* GET home page. */
router.get('/', viewSignin);
router.post('/', actionSignin);
router.get('/logout', actionLogout);
// router.get('/create', viewCreate);
// router.post('/create', actionCreate);
// router.get('/edit/:id', viewEdit);
// router.put('/edit/:id', actionEdit);
// router.delete('/delete/:id', actionDelete);


module.exports = router;
