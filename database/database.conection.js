const mongoose = require('mongoose');

const dbconnection = async() => {

    try {

        await mongoose.connect(process.env.DATABASE_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('DB is connected');

    } catch (error) {
        console.log(error);
        throw new Error('error when initializing the db')
    }

}

module.exports = {
    dbconnection
}