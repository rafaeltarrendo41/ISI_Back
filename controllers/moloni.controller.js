const querystring = require('querystring');
const req = require('request');

function insertClient(nif, nome, email, callback) {
    getNextNumber((res) => {
        if (res.company_id) {
            const company_id = res.company_id;
            const access_token = res.access_token;
            const next_number = res.next_number;

            const json = querystring.stringify({
                company_id: company_id,
                vat: nif,
                number: next_number,
                name: nome,
                address: '',
                zip_code: '',
                city: '',
                country_id: 1,
                email: email,
                phone: '',
                fax: '',
                contact_name: '',
                contact_email: '',
                contact_phone: '',
                notes: '',
                payment_method_id: 0,
                delivery_method_id: 0,
                field_notes: ''
            })

            let options = {
                headers: {
                    'Content-Length': json.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: `https://api.moloni.pt/v1/customers/insert/?access_token=${access_token}`,
                body: json
            }
            req.post(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    callback({
                        'statusCode': res.statusCode,
                        'body': {
                            customer_id: JSON.parse(res.body).customer_id
                        }
                    })
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    })
                }
            })
        } else {
            callback({
                'statusCode': res.statusCode,
                'body': res.body
            });
        }
    })
}



module.exports = {
    getProducts: getProducts,
    getPurchases: getPurchases,
    insertPurchase: insertPurchase,
    insertClient: insertClient,
};