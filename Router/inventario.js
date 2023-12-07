const {Router} = require('express');
const Inventario = require('../models/Inventario');
const { validarJWT } = require('../middleware/validar-jwt')
const { validarRolAsmin } = require('../middleware/validar-rol-admin')

const { validationResult, check} = require('express-validator');

const router = Router();

router.post('/', [validarJWT, validarRolAsmin],[
    check('serial', 'invalid.serial').not().isEmpty(),
    check('modelo', 'invalid.modelo').not().isEmail(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),
    check('color', 'invalid.color').not().isEmpty(),
    check('foto', 'invalid.foto').not().isEmpty(),
    check('fechaCompra', 'invalid.fechaCompra').not().isEmpty(),
    check('precio', 'invalid.precio').not().not().isEmpty().isFloat({ min: 0 }),
    check('usuario', 'invalid.usuario').not().isEmpty(),
    check('marca', 'invalid.marca').not().isEmpty(),
    check('estadoEquipo', 'invalid.estadoEquipo').not().isEmpty(),
    check('tipoEquipo', 'invalid.tipoEquipo').not().isEmpty(),
    
], async function(req, resp){
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return resp.status(400).json({ mensaje : errors.array()});
        }

        const existeInventarioPorSerial = await Inventario.findOne({ serial: req.body.serial});
        if(existeInventarioPorSerial){
            return resp.status(400).send('Email ya existe');
        }

        let inventario = new Inventario()
        inventario.serial = req.body.serial;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.color = req.body.color;
        inventario.foto = req.body.foto;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.fechaCreacion = new Date();
        inventario.fechaActualizacion = new Date();

        // const salt = bcrypt.genSaltSync()
        // const password = bcrypt.hashSync(req.body.password, salt);
        // inventario.password = password

        // inventario.rol = req.body.rol;
        // inventario.fechaCreacion = new Date();
        // inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();

        resp.send(inventario);

    
    } catch(error){
        console.log(error)
        resp.status(500).send('Ocurrio un error')
    }
});

router.get('/', [validarJWT], async function(req, resp){

    try{

        const inventarios = await Inventario.find().populate([
            {
                path: 'usuario', select: 'nombre email estado', 
            },
            {
                path: 'marca', select: 'nombre estado'
            },
            {
                path: 'estadoEquipo', select: 'nombre estado'
            },
            {
                path: 'tipoEquipo', select: 'nombre estado'
            }
        ]);
        resp.send(inventarios)

    } catch(error){
        console.log(error)
        resp.status(500).send('Ocurrio un error')
    }
});

router.put('/:inventarioId', [validarJWT, validarRolAsmin], [check('modelo', 'invalid.modelo').not().isEmail(),
    check('descripcion', 'invalid.descripcion').not().isEmpty(),], async function(req, resp) {

    try{

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return resp.status(400).json({ mensaje : errors.array()});
        }


        let inventario = await Inventario.findById(req.params.inventarioId);

        if(!inventario){
            return resp.status(400).send('Marca No Existe');
        }
        inventario.serial = req.body.serial;
        inventario.nombre = req.body.nombre;
        inventario.estado = req.body.estado;
        inventario.modelo = req.body.modelo;
        inventario.descripcion = req.body.descripcion;
        inventario.color = req.body.color;
        inventario.foto = req.body.foto;
        inventario.fechaCompra = req.body.fechaCompra;
        inventario.precio = req.body.precio;
        inventario.usuario = req.body.usuario._id;
        inventario.marca = req.body.marca._id;
        inventario.estadoEquipo = req.body.estadoEquipo._id;
        inventario.tipoEquipo = req.body.tipoEquipo._id;
        inventario.fechaActualizacion = new Date();

        inventario = await inventario.save();

        resp.send(inventario);

    } catch(error) {

        console.log(error)
    }

});

module.exports = router;