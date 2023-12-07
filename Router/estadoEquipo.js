const {Router} = require('express');
const EstadoEquipo = require('../models/EstadoEquipo');
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
            return resp.status(400).json({ mensaje : error.array()});
        }


        let estadoEquipo = new EstadoEquipo()
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaCreacion = new Date();
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();

        resp.send(estadoEquipo);

    } catch(error){
        console.log(error)
    }
})

router.get('/', [validarJWT, validarRolAsmin], async function(req, resp){

    try{

        const estadoEquipos = await EstadoEquipo.find();
        resp.send(estadoEquipos)

    } catch(error){
        console.log(error)
        resp.status(500).send('Ocurrio un error')
    }
});

router.put('/:estadoEquipoId', [validarJWT, validarRolAsmin], [check('nombre', 'invalid.nombre').not().isEmpty(),
check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),], async function(req, resp) {

    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return resp.status(400).json({ mensaje : errors.array()});
        }


        let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);

        if(!estadoEquipo){
            return resp.status(400).send('Marca No Existe');
        }
        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        estadoEquipo.fechaActualizacion = new Date();

        estadoEquipo = await estadoEquipo.save();

        resp.send(estadoEquipo);

    } catch(error) {

        console.log(error)
    }

});
module.exports = router;