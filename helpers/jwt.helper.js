const jwt = require('jsonwebtoken');

const generateJWT = (id) => {

    return new Promise((resolve, reject) => {

        const payload = {
            id
        }

        jwt.sign(payload, process.env.SECRET_KEY_JWT, {
            expiresIn: '24h'
        }, (err, token) => {

            if (err) {

                console.log(err);
                reject("jwt could not be created");

            } else {

                resolve(token);

            }
        })

    })

}

module.exports = {
    generateJWT
}