const {Router} = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { validationResult, check} = require('express-validator');
const { validarJWT } = require('../middleware/validar-jwt')
const { validarRolAsmin } = require('../middleware/validar-rol-admin')

const router = Router();

router.post('/', [validarJWT, validarRolAsmin], [
    check('email', 'invalid.email').isEmail(),
    check('password', 'invalid.password').not().isEmpty(),
    
], async function(req, resp){
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return resp.status(400).json({ mensaje : error.array()});
        }

        const existeUsuario = await Usuario.findOne({ email: req.body.email});
        if(existeUsuario){
            return resp.status(400).send('Email ya existe');
        }

        let usuario = new Usuario()
        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;

        const salt = bcrypt.genSaltSync()
        const password = bcrypt.hashSync(req.body.password, salt);
        usuario.password = password

        usuario.rol = req.body.rol;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();

        resp.send(usuario);

    } catch(error){
        console.log(error)
    }
})

router.get('/', [validarJWT, validarRolAsmin], async function(req, resp){

    try{

        const usuario = await Usuario.find();
        resp.send(usuario)

    } catch(error){
        console.log(error)
        resp.status(500).send('Ocurrio un error')
    }
}); 

router.put('/:usuarioId', [validarJWT, validarRolAsmin], [check('nombre', 'invalid.nombre').not().isEmpty(),
check('estado', 'invalid.estado').isIn(['Activo', 'Inactivo']),], async function(req, resp) {

    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return resp.status(400).json({ mensaje : errors.array()});
        }


        let usuario = await Usuario.findById(req.params.usuarioId);

        if(!usuario){
            return resp.status(400).send('Marca No Existe');
        }
        usuario.nombre = req.body.nombre;
        usuario.estado = req.body.estado;
        usuario.email = req.body.email;
        usuario.rol = req.body.rol;
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();

        resp.send(usuario);

    } catch(error) {

        console.log(error)
    }

});

module.exports = router;