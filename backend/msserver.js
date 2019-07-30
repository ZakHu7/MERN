var express = require('express');
var app = express();

app.get('/', function (req, res) {
   
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'sa',
        password: '()Test123?()',
        server: '192.168.23.11', 
        database: 'Rombald2018' 
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query("SELECT ProjectID, ProjectName, ActualHours FROM QuotingDetails WHERE ProjectID > '19-200'", function (err, recordset) {

            recordset.recordsets[0].forEach(function (item) {
              const id = item.ProjectID;
              const name = item.ProjectName;
              const hours = item.ActualHours;

              console.log(id + name + hours);
            })
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
        });
    });

});

var server = app.listen(5000, function () {
    console.log('Server is running..');
});