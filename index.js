const DynamoDB = require("aws-sdk/clients/dynamodb");
const { v4: uuidv4 } = require("uuid");

exports.handler = async (event) => {

    const dynamo = new DynamoDB({
        apiVersion: '2012-08-10',
        endpoint: 'http://dynamodb:8000',
        region: 'us-west-2',
        credentials: {
            accessKeyId: '2345',
            secretAccessKey: '2345'
        }
    });
    var tableName = "Envios";
    const docClient = new DynamoDB.DocumentClient({
        apiVersion: '2012-08-10',
        service: dynamo
    });

    switch (event.httpMethod) {
        // LISTA DE PENDIENTES : GET /envios/pending
        case "GET":
            const query = {
                TableName: tableName,
                FilterExpression: "el atributo existe (pendiente)",
            };
            return await docClient.scan(query).promise().then((data) => {
                return {
                    statusCode: 200,
                    body: JSON.stringify(data.Items),
                };
            }).catch((err) => {
                console.log(err);
                return {
                    statusCode: 500,
                    body: err.message,
                };
            });
        // CREAR : POST /envios
        case "POST":
            if (event.body) {
                let now = new Date().toISOString()
                const query = {
                    TableName: tableName,
                    Item: {
                        id: uuidv4(),
                        pendiente: now,
                        fechaAlta: now,
                        destino: JSON.parse(event.body).destino,
                        email: JSON.parse(event.body).email,
                    },
                };
                return docClient.put(query).promise().then((data) => {
                    // ignoramos data
                    return {
                        statusCode: 200,
                        body: JSON.stringify(query.Item),
                    };
                }).catch((err) => {
                    console.log(err);
                    return {
                        statusCode: 500,
                        body: JSON.stringify(err.message),
                    };
                });
            } else {
                return {
                    statusCode: 400,
                    body: "Destino y email son requeridos ",
                };
            }
        case "PUT":
            if (event.pathParameters.idEnvio) {
                const query = {
                    TableName: tableName,
                    Key: {
                        id: event.pathParameters.idEnvio
                    },
                    UpdateExpression: "REMOVE pendiente",
                    ReturnValues: "UPDATED_NEW"
                };
                return await docClient.update(query).promise().then((data) => {
                    return {
                        statusCode: 200,
                        body: JSON.stringify(data),
                    };
                }).catch((err) => {
                    console.log(err);
                    return {
                        statusCode: 500,
                        body: err.message,
                    };
                });
            } else {
                return {
                    statusCode: 400,
                    body: "idEnvio se requiere como parametro de ruta !",
                };
            }
        default:
            return {
                statusCode: 405,
                body: "Metodo no compatible !",
            };
    }
};
