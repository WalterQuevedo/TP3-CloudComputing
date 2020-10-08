var params = {
    TableName: "Envios",
    KeySchema: [
        {
            AttributeName: "id",
            KeyType: "HASH",
        },
    ],
    AttributeDefinitions: [
        {
            AttributeName: "id",
            AttributeType: "S",
        },
        {
            AttributeName: "pendiente",
            AttributeType: "S",
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2,
    },
    GlobalSecondaryIndexes: [
        {
            IndexName: "EnviosPendientesIndex",
            KeySchema: [
                {
                    AttributeName: "id",
                    KeyType: "HASH",
                },
                {
                    AttributeName: "pendiente",
                    KeyType: "RANGE",
                },
            ],
            Projection: {
                ProjectionType: "KEYS_ONLY",
            },
            ProvisionedThroughput: {
                ReadCapacityUnits: 2,
                WriteCapacityUnits: 2,
            },
        },
    ],
};
dynamodb.createTable(params, function (err, data) {
    if (err) console.log(err); 
    else console.log(data); 
    console.log("Tabla creada con exito!");
});