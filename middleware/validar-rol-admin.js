const jwt = require('jsonwebtoken')

const validarRolAsmin = (req, resp, next) => {

    if (req.payload.rol != 'Admin') {
        return resp.status(401).json({ mensaje: 'error unauthorized' });
    }
    next()
}

module.exports = {
    validarRolAsmin
}