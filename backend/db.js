const mssql = require("mssql");
// config for your database
var config = {
    user: 'sa',
    password: '()Test123?()',
    server: '192.168.23.11', 
    database: 'Rombald2018' 
};

var connection = mssql.connect(config, function (err) {
    if (err) console.log(err);
});

module.exports = mssql; 
