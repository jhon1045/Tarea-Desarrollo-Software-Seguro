const jwt = require('jsonwebtoken')

const validarJWT = (req, resp, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return resp.status(401).json({ mensaje: 'error unauthorized' });
    }

    try {

        const payload = jwt.verify(token, '123456');
        req.payload = payload;
        next()

    } catch (error) {
        console.log(error)
        return resp.status(401).json({ mensaje: 'error unauthorized' });
    }
}

module.exports = {
    validarJWT
}