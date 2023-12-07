const {Router} = require('express');
const Marca = require('../models/Marca');
const { validationResult, check} = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt')
const { validarRolAsmin } = require('../middleware/validar-rol-admin')

const router = Router();

router.post('/', [validarJWT, validarRolAsmin], [
    check('nombre', 'invalid.nombre').not().isEmpty(),
    check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),
    
], async function(req, resp){

    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return resp.status(400).json({ mensaje : errors.array()});
        }


        let marca = new Marca()
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaCreacion = new Date();
        marca.fechaActualizacion = new Date();

        marca = await marca.save();

        resp.send(marca);

    } catch(error){
        console.log(error)
    }
})

router.get('/', [validarJWT, validarRolAsmin], async function(req, resp){

    try{

        const marcas = await Marca.find();
        resp.send(marcas)

    } catch(error){
        console.log(error)
        resp.status(500).send('Ocurrio un error')
    }
});

router.put('/:marcaId', [validarJWT, validarRolAsmin], [check('nombre', 'invalid.nombre').not().isEmpty(),
check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),], async function(req, resp) {

    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return resp.status(400).json({ mensaje : errors.array()});
        }


        let marca = await Marca.findById(req.params.marcaId);

        if(!marca){
            return resp.status(400).send('Marca No Existe');
        }
        marca.nombre = req.body.nombre;
        marca.estado = req.body.estado;
        marca.fechaActualizacion = new Date();

        marca = await marca.save();

        resp.send(marca);

    } catch(error) {

        console.log(error)
    }

});

module.exports = router;