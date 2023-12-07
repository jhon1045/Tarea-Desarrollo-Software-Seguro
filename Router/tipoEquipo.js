const {Router} = require('express');
const TipoEquipo = require('../models/TipoEquipo');
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


        let tipoEquipo = new TipoEquipo()
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();

        resp.send(tipoEquipo);

    } catch(error){
        console.log(error)
    }
})

router.get('/', [validarJWT, validarRolAsmin], async function(req, resp){

    try{

        const tipoEquipos = await TipoEquipo.find();
        resp.send(tipoEquipos)

    } catch(error){
        console.log(error)
        resp.status(500).send('Ocurrio un error')
    }
}); 

router.put('/:tipoEquipoId', [validarJWT, validarRolAsmin], [check('nombre', 'invalid.nombre').not().isEmpty(),
check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),], async function(req, resp) {

    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return resp.status(400).json({ mensaje : errors.array()});
        }


        let tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);

        if(!tipoEquipo){
            return resp.status(400).send('Marca No Existe');
        }
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();

        resp.send(tipoEquipo);

    } catch(error) {

        console.log(error)
    }

});
module.exports = router;