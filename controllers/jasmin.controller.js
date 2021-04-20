const querystring = require('querystring');
const req = require('request');

function getToken(callback) {
    let json = querystring.stringify({
        client_id: '252065-0001',
        client_secret: '07b298cd-56d0-465e-8245-bbd3347e8669',
        grant_type: 'client_credentials',
        scope: 'application'
    });

    let options = {
        headers: {
            'Content-Length': json.length,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        url: `https://identity.primaverabss.com/core/connect/token`,
        body: json
    }
    req.post(options, (err, res) => {
        if (!err && res.statusCode == 200) {
            callback({
                'access_token': JSON.parse(res.body).access_token
            });
        } else {
            callback({
                'statusCode': res.statusCode,
                'body': JSON.parse(res.body)
            });
        }
    })
}

function retornar() {
    getToken((res) => {
    console.log(res.access_token);
    })
}

module.exports = {
    getToken: getToken,
    retornar: retornar
};

