const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');
const credentials = require("./credentials/mongodb");

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute = credentials.mongoRoute;
// connects our back end code with the database
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));


/// Trying to laod from MS sql Database 
///
router.post('/initializeData', (req, res) => {
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
        request.query("SELECT ProjectID, ProjectName, ActualHours FROM QuotingDetails WHERE ProjectID > '19-000'", function (err, recordset) {
            var i = 0;
            recordset.recordsets[0].forEach(function (item) {
              let data = new Data();
              data.id = i++;

              data.projectID = item.ProjectID.replace(':', '');
              
              data.name = item.ProjectName;
              data.hours = item.ActualHours;

              console.log(data);
              data.save();
              // data.save((err) => {
              //   if (err) return res.json({ success: false, error: err });
              //   return res.json({ success: true });
              // });
            })

            if (err) console.log(err);



            // // send records as a response
            // res.send(recordset);
            
        });
    });

  // data.save((err) => {
  //   if (err) return res.json({ success: false, error: err });
  //   return res.json({ success: true });
  // });
});
///


// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findByIdAndUpdate(id, update, (err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  //console.log(req);
  //console.log(req.body);
  Data.findByIdAndDelete(id, (err) => {
    
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create method
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let data = new Data();
  const { id, name } = req.body;
  //console.log('wwdwdwd');
  if ((!id && id !== 0) || !name) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS',
    });
  }
  data.name = name;
  data.id = id;
  data.save((err) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
