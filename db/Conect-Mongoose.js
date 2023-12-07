const mongoose = require('mongoose');

const getConnection = async () => {

    try{
            
        const url = 'mongodb://Servicios:vwGFNBdwaQzUJvAu@ac-ngidco2-shard-00-00.7eikdxk.mongodb.net:27017,ac-ngidco2-shard-00-01.7eikdxk.mongodb.net:27017,ac-ngidco2-shard-00-02.7eikdxk.mongodb.net:27017/jwt-g34?ssl=true&replicaSet=atlas-c80wk3-shard-0&authSource=admin&retryWrites=true&w=majority';

        await mongoose.connect(url);

        console.log('Conecion exitosa');

    } catch(error) {
        console.log('Fallo en:'+ error)
    }


}
    module.exports = {
        getConnection,
    } 
