const querystring = require('querystring');
const req = require('request');
const connect = require('./../config/dbConnection');





function retornar() {
    // getToken((res) => {
    //     console.log(res.access_token);
    //     })
    // getCompany((res) => {
    //         console.log(res);
    //     })
    // getProducts((res) => {
    //              console.log(res);
    //     })
    // getCategory((res) => {
    //         console.log(res);
    //      })
    // getProducts((res) => {
    //     console.log(res.body);
    // })
    // getPurchases((res) => {
    //     console.log(res);
    //  })
    // getNextNumber((res) => {
    //     console.log(res);
    // // // // //  })
    // insertClient("293820317", "CLIENTPOSTMAN", "nada");
    getCustomers((res) => {
        console.log(res);
    })


}

function getPDFLink(document_id, callback) {
    getCompany((res) => {
        if (res.company_id) {
            const company_id = res.company_id;
            const access_token = res.access_token;

            let json = querystring.stringify({
                company_id: 181093,
                document_id: 405767757
            });
            let options = {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: `https://api.moloni.pt/v1/documents/getPDFLink/?access_token=${access_token}`,
                body: json
            }
            req.post(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    console.log(res.body);
                    callback({
                        'statusCode': res.statusCode,
                        'body': res.body
                    });
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
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


// function insertReceipt(customer_id, status, callback) {
//     getNextNumber((res) => {
//         // console.log(res);
//         if (res.company_id) {
//             const company_id = res.company_id;
//             const access_token = res.access_token;
//             const next_number = res.next_number;
//             let productsF = [];

//             productsF.push({
//                 'product_id': 86211844,
//                 'name': 'ServiçoWtransnet',
//                 'summary': '',
//                 'qty': 1,
//                 'price': 25,
//                 'discount': 0,
//                 'deduction_id': 0,
//                 'order': 0,
//                 'exemption_reason': '',
//                 'taxes': [{
//                     'tax_id': 2194883,
//                     'value': 5.75,
//                     'order': 1,
//                     'cumulative': 0
//                 }]
//             });


//             let json = {
//                 'company_id': company_id,
//                 'date': new Date().toISOString(),
//                 'expiration_date': new Date().toISOString(),
//                 'maturity_date_id': 0,
//                 'document_set_id': 402498,
//                 'customer_id': customer_id,
//                 'alternate_address_id': 0,
//                 'our_reference': 'Nossa referência',
//                 'your_reference': 'Referência Cliente',
//                 'financial_discount': 0,
//                 'eac_id': 0,
//                 'salesman_id': 0,
//                 'salesman_commision': 0,
//                 'special_discount': 0,
//                 'exchange_currency_id': 0,
//                 'exchange_rate': 0,
//                 'notes': '',
//                 'status': status,
//                 'net_value': 0,
//                 'products': productsF
//             };

//             if (json.status == 1) {
//                 let total = 0;
//                 for (let i = 0; i < productsF.length; i++) {
//                     total += (productsF[i].qty * (productsF[i].price + products[i].taxes[0].value)).toFixed(2);
//                 }
//                 json.payments = [{
//                     'payment_method_id': 820244,
//                     'date': new Date().toISOString(),
//                     'value': total
//                 }]
//             }


//             let options = {
//                 headers: {
//                     'Content-Type': 'application/json; charset=utf-8'
//                 },
//                 url: `https://api.moloni.pt/v1/invoiceReceipts/insert/?access_token=${access_token}&json=true`,
//                 body: JSON.stringify(json)
//             }
//             req.post(options, (err, res) => {
//                 if (!err && res.statusCode == 200) {
//                     callback({
//                         'statusCode': res.statusCode,
//                         'body': {
//                             'message': 'Purchase inserted with success'
//                         }
//                     });
//                 } else {
//                     callback({
//                         'statusCode': res.statusCode,
//                         'body': res.body
//                     });
//                 }
//             })
//         } else {
//             callback({
//                 'statusCode': res.statusCode,
//                 'body': res.body
//             });
//         }
//     })
// }

function getCostumerID(callback) {
    getNextNumber((res) => {
        if (res.company_id) {

            let json = querystring.stringify({
                company_id: res.company_id,
            });
            const access_token = res.access_token;
            let options = {
                headers: {
                    'Content-Length': json.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: `https://api.moloni.pt/v1/customers/getAll/?access_token=${access_token}`,
                body: json
            }
            req.post(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    let resp = JSON.parse(res.body);
                    console.log(resp);
                    callback({
                        'customers': resp,
                        'company_id': company_id,
                        // 'customer_id': customer_id,
                        'access_token': access_token
                    });
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
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

function insertInvoice(request, response) {
    const costumer_id = request.body.costumer_id;

    getNextNumber((res) => {
        // console.log(res.customer_id);
        if (res.company_id) {
            // let resBody = JSON.parse(res.body);
            // let customer_id = -1;
            // for (let i = 0; i < resBody.length; i++) {
            //     if (resBody[i].name == nome) {
            //         customer_id = resBody[i].customer_id
            //         //console.log("CATEGORY ID: " + category_id)
            //     }
            // }
            // console.log(customer_id);

            const company_id = res.company_id;
            const access_token = res.access_token;
            const next_number = res.next_number;
            // let productsF = [];

            // productsF.push({
            //     'product_id': 86211844,
            //     'name': 'ServiçoWtransnet',
            //     'summary': '',
            //     'qty': 1,
            //     'price': 25,
            //     'discount': 0,
            //     'deduction_id': 0,
            //     'order': 0,
            //     'exemption_reason': '',
            //     'taxes': [{
            //         'tax_id': 2194883,
            //         'value': 5.75,
            //         'order': 1,
            //         'cumulative': 0
            //     }]
            // });


            // const json = {
            //     'company_id': company_id,
            //     'date': new Date().toISOString(),
            //     'expiration_date': new Date().toISOString(),
            //     'maturity_date_id': 0,
            //     'document_set_id': 402498,
            //     'customer_id': customer_id,
            //     'alternate_address_id': 0,
            //     'our_reference': 'Nossa referência',
            //     'your_reference': 'Referência Cliente',
            //     'financial_discount': 0,
            //     'eac_id': 0,
            //     'salesman_id': 0,
            //     'salesman_commision': 0,
            //     'special_discount': 0,
            //     'products': productsF,
            //     'exchange_currency_id': 0,
            //     'exchange_rate': 0,
            //     'notes': ''
            // };



            const json1 = querystring.stringify({
                'company_id': 181093,
                'date': new Date().toISOString(),
                'expiration_date': new Date().toISOString(),
                'document_set_id': 402498,
                'customer_id': costumer_id,
                'products[0][product_id]': 86211844,
                'products[0][name]': 'ServiçoWtransnet',
                'products[0][qty]': 1.0,
                'products[0][price]': 25,
                'products[0][taxes][0][tax_id]': 2194883,
                'products[0][taxes][0][value]': 5.75,
                'products[0][taxes][0][order]': 1,
                'products[0][taxes][0][cumulative]': 0,
                'status': 1

            })

            // console.log(json1);
            // console.log(json1.products)

            let options = {
                headers: {
                    'Content-Length': json1.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: `https://api.moloni.pt/v1/invoices/insert/?access_token=${access_token}`,
                body: json1
            }

            // console.log(options);

            req.post(options, (err, result) => {
                if (!err && result.statusCode == 200) {
                    response.status(200).send(JSON.parse(result.body))
                } else {
                    response.status(400).send("erro");
                }
            })
        } else {
            response.status(400).send("erro");
        }
    })
}



function insertProduct(nome, callback) {
    const post = {
        criador: nome.body.user_id,
        origem: nome.body.origem,
        destino: nome.body.destino,
        especialidade: nome.body.especialidade,
        peso: nome.body.peso
    }
    connect.query('INSERT INTO transporte SET ?', post, (err, rows, fields) => {
        if (!err) {
            connect.query(`SELECT * FROM transporte WHERE criador=${nome.body.user_id} AND origem="${nome.body.origem}" AND destino="${nome.body.destino}" AND especialidade="${nome.body.especialidade}" AND peso="${nome.body.peso}"`, async (err, rows, fields) => {
                const carga = rows[0];
                console.log(carga.idtransporte);
                getNextNumber((res) => {
                    console.log(res);
                    if (res.company_id) {
                        const company_id = res.company_id;
                        const category_id = 3700122;
                        const type = 1;
                        const access_token = res.access_token;


                        const json = querystring.stringify({
                            company_id: company_id,
                            category_id: category_id,
                            type: type,
                            name: carga.idtransporte,
                            reference: carga.idtransporte,
                            price: 0.0,
                            unit_id: 1578589,
                            has_stock: 0,
                            stock: 0,
                            exemption_reason: 0
                        })

                        console.log(json);
                        let options = {
                            headers: {
                                'Content-Length': json.length,
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            url: `https://api.moloni.pt/v1/products/insert/?access_token=${access_token}`,
                            body: json
                        }
                        req.post(options, (err, res) => {
                            if (!err && res.statusCode == 200) {
                                console.log(res.statusCode);
                                callback.status(200).send({
                                    'result': 'criado',
                                    'body': JSON.parse(res.body)
                                })
                                //console.log(JSON.parse(res.body).customer_id);
                            } else {
                                callback.status(400).send({
                                    'result': 'erro moloni',
                                    'body': JSON.parse(res.body)
                                })
                            }
                        })
                    } else {
                        callback.status(400).send({
                            'result': 'erro bd',
                            'body': res.body
                        });
                    }
                })

            })
        } else {
            callback.status(400).send({
                'body': err
            });
        }
    })
}








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
                language_id: 1,
                address: '',
                zip_code: '',
                city: '',
                country_id: 1,
                email: email,
                website: '',
                phone: '',
                fax: '',
                contact_name: '',
                contact_email: '',
                contact_phone: '',
                notes: '',
                salesman_id: 0,
                price_class_id: 0,
                maturity_date_id: 0,
                payment_day: 1,
                discount: 0,
                credit_limit: 0,
                payment_method_id: 0,
                delivery_method_id: 0,
                field_notes: '',
                document_type_id: 1,
                copies: 1
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
                    console.log(res.body);
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

function getNextNumber(callback) {
    getCompany((res) => {
        if (res.company_id) {
            const company_id = res.company_id;
            const access_token = res.access_token;

            const json = querystring.stringify({
                company_id: company_id
            })
            let options = {
                headers: {
                    'Content-Length': json.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: `https://api.moloni.pt/v1/customers/getNextNumber/?access_token=${access_token}`,
                body: json
            }

            req.post(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    callback({
                        'company_id': company_id,
                        'access_token': access_token,
                        'next_number': JSON.parse(res.body).number
                    });
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
                }
            })
        }
    })
}

function getPurchases(customer_id, callback) {
    getCompany((res) => {
        if (res.company_id) {
            const company_id = res.company_id;
            const access_token = res.access_token;

            let json = querystring.stringify({
                company_id: company_id,
                qty: 0,
                offset: 0,
                customer_id: customer_id,
                supplier_id: 0,
                salesman_id: 0,
                document_set_id: 0,
                number: 0,
                date: '',
                expiration_date: '',
                year: 0,
                your_reference: '',
                our_reference: ''
            });

            let options = {
                headers: {
                    'Content-Length': json.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: `https://api.moloni.pt/v1/invoiceReceipts/getAll/?access_token=${access_token}`,
                body: json
            }
            req.post(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    let invoices = JSON.parse(res.body);
                    console.log(invoices);
                    let invoicesF = [];
                    for (let i = 0; i < invoices.length; i++) {
                        if (invoices[i].status == 1) {
                            invoicesF.push(invoices[i]);
                        }
                    }

                    callback({
                        'statusCode': res.statusCode,
                        'body': invoicesF
                    });
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
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

function getCustomers(callback) {
    getCategory((res) => {
        if (res.category_id) {
            const access_token = res.access_token;
            const company_id = res.company_id;
            const category_id = res.category_id;

            let json = querystring.stringify({
                company_id: company_id,
            });
            let options = {
                headers: {
                    'Content-Length': json.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: `https://api.moloni.pt/v1/customers/getAll/?access_token=${access_token}`,
                body: json
            }
            req.post(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    let resp = JSON.parse(res.body);
                    console.log(resp);
                    callback({
                        'customers': resp,
                        'company_id': company_id,
                        // 'customer_id': customer_id,
                        'access_token': access_token
                    });
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
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


function getProducts(callback) {
    getCategory((res) => {
        if (res.category_id) {
            const access_token = res.access_token;
            const company_id = res.company_id;
            const category_id = res.category_id;
            let json = querystring.stringify({
                company_id: company_id,
                category_id: category_id,
                qty: 0,
                offset: 0,
                with_invisible: 0
            });
            let options = {
                headers: {
                    'Content-Length': json.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: `https://api.moloni.pt/v1/products/getAll/?access_token=${access_token}`,
                body: json
            }
            req.post(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    let resp = JSON.parse(res.body);
                    console.log(resp);
                    // console.log(resp[0].child_products);
                    // callback({
                    //     'products': resp,
                    //     'company_id': company_id,
                    //     'access_token': access_token
                    // });
                } else {
                    // callback({
                    //     'statusCode': res.statusCode,
                    //     'body': JSON.parse(res.body)
                    // });
                }
            })
        } else {
            // callback({
            //     'statusCode': res.statusCode,
            //     'body': res.body
            // });
        }
    })
}

function getCategory(callback) {
    getCompany((res) => {
        if (res.company_id) {
            let access_token = res.access_token;
            let company_id = res.company_id;
            let nameC;
            let json = querystring.stringify({
                company_id: company_id,
                parent_id: 0
            });
            let options = {
                headers: {
                    'Content-Length': json.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: `https://api.moloni.pt/v1/productCategories/getAll/?access_token=${access_token}`,
                body: json
            }
            req.post(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    let resBody = JSON.parse(res.body);
                    let category_id = -1;
                    for (let i = 0; i < resBody.length; i++) {
                        if (resBody[i].name == 'Serviço') {
                            category_id = resBody[i].category_id,
                                nameC = resBody[i].name
                            // console.log(category_id);
                        }
                    }
                    callback({
                        'company_id': company_id,
                        'access_token': access_token,
                        'category_id': category_id,
                        'name': nameC
                    });
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
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

function getCompany(callback) {
    getToken((res) => {
        if (res.access_token) {
            const access_token = res.access_token;
            let options = {
                url: `https://api.moloni.pt/v1/companies/getAll/?access_token=${access_token}`
            }
            req.get(options, (err, res) => {
                if (!err && res.statusCode == 200) {
                    let resBody = JSON.parse(res.body);
                    let company_id = -1;
                    for (let i = 0; i < resBody.length; i++) {
                        if (resBody[i].email == process.env.EMAIL_USERNAME) {
                            company_id = resBody[i].company_id;
                        }
                    }
                    if (company_id != -1) {
                        callback({
                            'company_id': company_id,
                            'access_token': access_token
                        });
                    } else {
                        callback({
                            'statusCode': 404,
                            'body': {
                                'message': 'Company not found'
                            }
                        });
                    }
                } else {
                    callback({
                        'statusCode': res.statusCode,
                        'body': JSON.parse(res.body)
                    });
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

function getToken(callback) {
    let options = {
        url: `https://api.moloni.pt/v1/grant/?grant_type=password&client_id=${process.env.MOLONI_CLIENTID}&client_secret=${process.env.MOLONI_SECRET}&username=${process.env.EMAIL_USERNAME}&password=${process.env.MOLONI_PASSWORD}`
    }
    req.get(options, (err, res) => {
        console.log(res.body);
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

module.exports = {
    getToken: getToken,
    retornar: retornar,
    getProducts: getProducts,
    getCompany: getCompany,
    getCategory: getCategory,
    getPurchases: getPurchases,
    insertClientM: insertClient,
    insertProduct: insertProduct,
    insertInvoice: insertInvoice,
    // insertReceipt: insertReceipt,
    getPDFLink: getPDFLink,
    getCostumerID: getCostumerID
};