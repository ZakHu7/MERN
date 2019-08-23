const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const credentials = require("./credentials/mongodb");
var mssql = require("./db"); 
var makeQueries = require('./makequeries');

const Data = require('./data');
const EmployeeData = require('./employeeData');
const AnnualRevenueData = require('./annualRevenueData');
const ActualQuotedData = require('./actualQuotedData');
const BillableData = require('./billableData');
const HitRateData = require('./hitRateData');
const HitRateRevData = require('./hitRateRevData');
const MapData = require('./mapData');
const LatLngData = require('./latLngData');

//const API_PORT = process.env.PORT || 3001;
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


/// Get the data for the main page.
/// Initialize means to get the data from the local database and pushing it to MongoDB Atlas
router.post('/initializeData', (req, res) => {
    db.db.dropCollection('datas', function(err, result) {if (err) console.log('could not delete collection')});

    var request = new mssql.Request();
    
    // query to the database and get the records
    request.query("SELECT ProjectID, ProjectName, ActualHours, QuotedAmt, BuildingType, Area1 FROM QuotingDetails WHERE ProjectID > '17-000'", function (err, recordset) {
        var i = 0;
        recordset.recordsets[0].forEach(function (item) {
          let data = new Data();
          data.id = i++;

          data.projectID = item.ProjectID.replace(':', '');
          data.name = item.ProjectName;
          data.hours = item.ActualHours;
          data.quotedAmt = item.QuotedAmt;
          data.buildingType = item.BuildingType;
          data.area = item.Area1 == null ? null : parseInt(item.Area1.replace(/\D/g,''));

          //console.log(item.Area1);
          //console.log(data.quotedAmt);

          data.save();
        })
        if (err) console.log(err);
    });
});
///

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
  //console.log(req.query.area);

  const [sizeMin, sizeMax] = makeQueries.getProjectSize(req.query.projectSize);

  const buildingTypeQuery = makeQueries.getBuildingTypes(req.query.buildingTypes);
  const searchQuery = makeQueries.getSearch(req.query.search);
  const [areaMin, areaMax] = makeQueries.getArea(req.query.area);
  
  const query = {
    $and: [
      {hours: { $gt: sizeMin, $lt: sizeMax }},
      
      {$or: 
        [{area: { $gt: areaMin, $lt: areaMax }}, {area: null}]
      },

      //{id: {$exists: true}},
      {$or: buildingTypeQuery},
      {$or: searchQuery},
    ]
    //$or: [ { buildingType: / /} ]
  };
  
  const { id, update } = req.body;
  //console.log(req);
  //console.log(req.query.projectSize);
  Data.find(query, (err, data) => {
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

// Initializing and getting data for the charts below

/// Getting information from the local database
/// Retrieves info about employees and pushes to employeedatas
/// Note: this deletes what is currently in the cloud DB and pushes a new selection instead
router.post('/initializeEmployeeData', (req, res) => {
  db.db.dropCollection('employeedatas', function(err, result) {if (err) console.log('could not delete collection')});

  var request = new mssql.Request();
  
  const queryString = `
  SELECT
    EmployeeID,
    EmpFName,
    EmpLName,
    EmpTitle
    FROM Rombald2018.dbo.Employee
  WHERE 
    Status = 'active'
    AND EmpTitle IS NOT NULL`;
  // query to the database and get the records
  request.query(queryString, function (err, recordset) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("employee worked");
    }
    var i = 0;
    recordset.recordsets[0].forEach(function (item) {
      let data = new EmployeeData();
      data.id = i++;
      data.employeeID = item.EmployeeID;
      data.name = item.EmpFName + " " + item.EmpLName;
      data.empTitle = item.EmpTitle;
      data.save();
    })
      
  });

  //return res.json({ success: true});

});

// Get method for employeeData
router.get('/getEmployeeData', (req, res) => {

  const query = {};
  const { id, update } = req.body;
  //console.log(req);
  //console.log(req.query.projectSize);
  EmployeeData.find(query, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

/// Getting information from the local database
/// Retrieves info about employees and pushes to annualrevenuedatas
/// Note: this deletes what is currently in the cloud DB and pushes a new selection instead
router.post('/initializeAnnualRevenueData', (req, res) => {
  db.db.dropCollection('annualrevenuedatas', function(err, result) {if (err) console.log('could not delete collection')});

  var request = new mssql.Request();
  
  var queryString = `
  SELECT Years, SUM(PayAmt) AS 'Revenue'
    FROM
  (
    SELECT YEAR(PayDate) AS 'Years', PayAmt
      FROM [Rombald2018].[dbo].[Payment]
  ) AS Tmp

  GROUP BY Years
  ORDER BY Years DESC`;
  // query to the database and get the records
  request.query(queryString, function (err, recordset) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("annualrev worked");
    }
      var i = 0;
      recordset.recordsets[0].forEach(function (item) {
        let data = new AnnualRevenueData();
        data.id = i++;

        data.year = item.Years;
        data.revenue = item.Revenue;
        data.save();
      })
      if (err) console.log(err);
  });

  //return res.json({ success: true});

});

// Get method for annualRevenueData
router.get('/getAnnualRevenueData', (req, res) => {

  const query = {};
  const { id, update } = req.body;
  //console.log(req);
  //console.log(req.query.projectSize);
  AnnualRevenueData.find(query, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

/// Getting information from the local database
/// Retrieves info about employees and pushes to actualquoteddatas
/// Note: this deletes what is currently in the cloud DB and pushes a new selection instead
router.post('/initializeActualQuotedData', (req, res) => {
  db.db.dropCollection('actualquoteddatas', function(err, result) {if (err) console.log('could not delete collection')});

  var request = new mssql.Request();
  
  var queryString = `
  --Temporary table for what year is to be used
  DECLARE @ChartTmp TABLE (
      ProjectID NVARCHAR(65) NOT NULL,
      ProjMonth INT,
      PrimaryManager NVARCHAR(65),
      SecondaryManager NVARCHAR(65),
      ActualMonthlyTotal FLOAT,
    ActualAmt FLOAT,
    BillAmt FLOAT,
    PercentageUsed FLOAT
  );
  
  INSERT INTO @ChartTmp
  SELECT ProjectID
    ,ProjMonth
    ,PrimaryManager
    ,SecondaryManager
    ,SUM(EntryAmt) AS ActualMonthlyTotal
    ,ActualAmt
    ,BillAmt
    ,ActualAmt/BillAmt AS PercentageUsed
  FROM Rombald2018.dbo.ProfitabilityChart1
  WHERE 1=1 --#year# --#excluded#
  GROUP BY ProjectID, PrimaryManager, SecondaryManager, ProjMonth, ActualAmt, BillAmt
  ORDER BY ProjectID DESC
  
  --Temporary table for the pivot of 12 months
  DECLARE @ChartTmp2 TABLE (
      ProjectID NVARCHAR(65) NOT NULL,
      PrimaryManager NVARCHAR(65),
      SecondaryManager NVARCHAR(65),
    ActualAmt FLOAT,
    BillAmt FLOAT,
    PercentageUsed FLOAT,
    [12] FLOAT,
    [11] FLOAT,
    [10] FLOAT,
    [9] FLOAT,
    [8] FLOAT,
    [7] FLOAT,
    [6] FLOAT,
    [5] FLOAT,
    [4] FLOAT,
    [3] FLOAT,
    [2] FLOAT,
    [1] FLOAT
  );
  
  INSERT INTO @ChartTmp2
  SELECT *
  FROM @ChartTmp
  PIVOT(SUM(ActualMonthlyTotal)
        FOR ProjMonth IN ([12], [11], [10], [9], [8], [7], [6], [5], [4], [3], [2], [1])) PIV
  ORDER BY ProjectID DESC
  
  
  SELECT
    ISNULL(SUM([1] * PercentageUsed) / SUM([1]) * 100, NULL) AS Percentage1
    ,ISNULL(SUM([2] * PercentageUsed) / SUM([2]) * 100, NULL) AS Percentage2
    ,ISNULL(SUM([3] * PercentageUsed) / SUM([3]) * 100, NULL) AS Percentage3
    ,ISNULL(SUM([4] * PercentageUsed) / SUM([4]) * 100, NULL) AS Percentage4
    ,ISNULL(SUM([5] * PercentageUsed) / SUM([5]) * 100, NULL) AS Percentage5
    ,ISNULL(SUM([6] * PercentageUsed) / SUM([6]) * 100, NULL) AS Percentage6
    ,ISNULL(SUM([7] * PercentageUsed) / SUM([7]) * 100, NULL) AS Percentage7
    ,ISNULL(SUM([8] * PercentageUsed) / SUM([8]) * 100, NULL) AS Percentage8
    ,ISNULL(SUM([9] * PercentageUsed) / SUM([9]) * 100, NULL) AS Percentage9
    ,ISNULL(SUM([10] * PercentageUsed) / SUM([10]) * 100, NULL) AS Percentage10
    ,ISNULL(SUM([11] * PercentageUsed) / SUM([11]) * 100, NULL) AS Percentage11
    ,ISNULL(SUM([12] * PercentageUsed) / SUM([12]) * 100, NULL) AS Percentage12
  FROM @ChartTmp2
  WHERE 1=1 --#user#`;

  var date = new Date();
  var year = date.getFullYear();
  queryString = queryString.replace("--#year#", "AND ProjYear = " + year.toString());

  //console.log(queryString);
  // query to the database and get the records
  request.query(queryString, function (err, recordset) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("actualvsquoted worked");
    }
      var i = 0;
      recordset.recordsets[0].forEach(function (item) {
        let data = new ActualQuotedData();
        data.id = i++;
        data.percentages = Object.values(item);

        // data.jan = item.Years;
        // data.revenue = item.Revenue;
        data.save();
      })
      if (err) console.log(err);
  });

  //return res.json({ success: true});

});

// Get method for actualQuotedData
router.get('/getActualQuotedData', (req, res) => {

  const query = {};
  const { id, update } = req.body;
  //console.log(req);
  //console.log(req.query.projectSize);
  ActualQuotedData.find(query, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

/// Getting information from the local database
/// Retrieves info about employees and pushes to billabledatas
/// Note: this deletes what is currently in the cloud DB and pushes a new selection instead
router.post('/initializeBillableData', (req, res) => {
  db.db.dropCollection('billabledatas', function(err, result) {if (err) console.log('could not delete collection')});

  var request = new mssql.Request();
  
  var queryString = `
SELECT 
	[EmployeeID]
	,SUM([TEHours]) AS Hours
	,[Year]
	,[Month]
    ,[TEBill]
FROM (
SELECT 
      [EmployeeID]
      ,[TEHours]
      ,YEAR([TEDate]) AS 'Year'
      ,MONTH([TEDate]) AS 'Month'
      ,[TEBill]
FROM [Rombald2018].[dbo].[TimeEntry]
WHERE ActivityId NOT IN ('060 General:1.1', '060 General:1.2', '060 General:1.4', '060 General:1.5')
) AS Tmp
WHERE [Year] = --#year#
GROUP BY EmployeeID, [Year], [Month], [TEBill]
ORDER BY [YEAR] DESC, [MONTH], EmployeeID
`;

  var date = new Date();
  var year = date.getFullYear();
  queryString = queryString.replace("--#year#", "'" + year.toString() + "'");

  //console.log(queryString);
  // query to the database and get the records
  request.query(queryString, function (err, recordset) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("billable worked");
    }
      var i = 0;
      recordset.recordsets[0].forEach(function (item) {
        let data = new BillableData();
        data.id = i++;
        data.employeeID = item.EmployeeID;
        data.hours = item.Hours;
        data.year = item.Year;
        data.month = item.Month;
        data.billable = item.TEBill == 0 ? false : true;

        // data.jan = item.Years;
        // data.revenue = item.Revenue;
        data.save();
      })
      if (err) console.log(err);
  });

  //return res.json({ success: true});

});

// Get method for billableData
router.get('/getBillableData', (req, res) => {

  const query = {};
  const { id, update } = req.body;
  //console.log(req);
  //console.log(req.query.projectSize);
  BillableData.find(query, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


/// Getting information from the local database
/// Retrieves info about employees and pushes to hitratedatas
/// Note: this deletes what is currently in the cloud DB and pushes a new selection instead
router.post('/initializeHitRateData', (req, res) => {
  db.db.dropCollection('hitratedatas', function(err, result) {if (err) console.log('could not delete collection')});

  var request = new mssql.Request();
  
  var queryString = `
DECLARE @tmp TABLE (
  ProjectID NVARCHAR(65) NULL,
  [ProjectName] NVARCHAR(100) NULL,
  [Year] FLOAT NULL,
  [Month] FLOAT NULL,
  ProjectStatus NVARCHAR(30) NULL,
  ProjectConType NVARCHAR(30) NULL
);

INSERT INTO @tmp
SELECT
  [ProjectID]
  ,[ProjectName]

  ,YEAR([ProjectStartDate]) AS 'Year'
  ,MONTH([ProjectStartDate]) AS 'Month'
  ,[ProjectStatus]
  ,ProjectConType
  
FROM [Rombald2018].[dbo].[Project]
WHERE ProjectConType = 'Fixed'

DECLARE @tmp2 TABLE (
  [Year] FLOAT NULL,
  [Month] FLOAT NULL,
  [Status] NVARCHAR(30) NULL,
  [Count] INT NULL
);

INSERT INTO @tmp2
SELECT
  [Year]
  ,[Month]
  ,'Received' AS 'Status'
  ,COUNT(ProjectStatus) AS 'Count'
FROM @tmp
WHERE ProjectStatus IN ('Active', 'Completed', 'Hold')
GROUP BY [Year], [Month]
UNION
SELECT
  [Year]
  ,[Month]
  ,'Total' AS 'Status'
  ,COUNT(ProjectStatus) AS 'Count'
FROM @tmp
GROUP BY [Year], [Month]
ORDER BY [Year] DESC, [Month]

SELECT 
  A.[Year]
  ,A.[Month]
  ,A.[Count] AS 'Received'
  ,B.[Count] AS 'Total'
FROM @tmp2 A, @tmp2 B
WHERE 
  A.[Status] < B.[Status]
  AND A.[Year] = B.[Year]
  AND A.[Month] = B.[Month]
  AND YEAR(GETDATE()) - 5 < A.[Year]
ORDER BY A.[Year] DESC, A.[Month];
`;

  // var date = new Date();
  // var year = date.getFullYear();
  // queryString = queryString.replace("--#year#", "'" + year.toString() + "'");

  //console.log(queryString);
  // query to the database and get the records
  request.query(queryString, function (err, recordset) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("hitrate worked");
    }
      var i = 0;
      recordset.recordsets[0].forEach(function (item) {
        let data = new HitRateData();
        data.id = i++;
        data.year = item.Year;
        data.month = item.Month;
        data.received = item.Received;
        data.total = item.Total;

        data.save();
      })
      if (err) console.log(err);
  });

  //return res.json({ success: true});

});

// Get method for hitratedata
router.get('/getHitRateData', (req, res) => {

  const query = {};
  const { id, update } = req.body;
  //console.log(req);
  //console.log(req.query.projectSize);
  HitRateData.find(query, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  }).sort( { id: 1 } );
});


/// Getting information from the local database
/// Retrieves info about employees and pushes to hitraterevdatas
/// Note: this deletes what is currently in the cloud DB and pushes a new selection instead
router.post('/initializeHitRateRevData', (req, res) => {
  db.db.dropCollection('hitraterevdatas', function(err, result) {if (err) console.log('could not delete collection')});

  var request = new mssql.Request();
  
  var queryString = `
  DECLARE @tmp TABLE (
    ProjectID NVARCHAR(65) NULL,
    [ProjectName] NVARCHAR(100) NULL,
    [Year] FLOAT NULL,
    [Month] FLOAT NULL,
    ProjectStatus NVARCHAR(30) NULL,
    [ProjectConAmt] INT NULL,
    ProjectConType NVARCHAR(30) NULL
  );
  
  INSERT INTO @tmp
  SELECT
    [ProjectID]
    ,[ProjectName]
  
    ,YEAR([ProjectStartDate]) AS 'Year'
    ,MONTH([ProjectStartDate]) AS 'Month'
    ,[ProjectStatus]
    ,ProjectConAmt
    ,ProjectConType
    
  FROM [Rombald2018].[dbo].[Project]
  WHERE ProjectConType = 'Fixed'
  
  DECLARE @tmp2 TABLE (
    [Year] FLOAT NULL,
    [Month] FLOAT NULL,
    [Status] NVARCHAR(30) NULL,
    Total INT NULL
  );
  
  INSERT INTO @tmp2
  SELECT
    [Year]
    ,[Month]
    ,'Received' AS 'Status'
    ,SUM(ProjectConAmt) AS 'Total'
  FROM @tmp
  WHERE ProjectStatus IN ('Active', 'Completed', 'Hold')
  GROUP BY [Year], [Month]
  UNION
  SELECT
    [Year]
    ,[Month]
    ,'Total' AS 'Status'
    ,SUM(ProjectConAmt) AS 'Total'
  FROM @tmp
  GROUP BY [Year], [Month]
  ORDER BY [Year] DESC, [Month]

  
  SELECT 
    A.[Year]
    ,A.[Month]
    ,A.[Total] AS 'Received'
    ,B.[Total] AS 'Total'
  FROM @tmp2 A, @tmp2 B
  WHERE 
    A.[Status] < B.[Status]
    AND A.[Year] = B.[Year]
    AND A.[Month] = B.[Month]
    AND YEAR(GETDATE()) - 5 < A.[Year]
  ORDER BY A.[Year] DESC, A.[Month];
`;

  // var date = new Date();
  // var year = date.getFullYear();
  // queryString = queryString.replace("--#year#", "'" + year.toString() + "'");

  //console.log(queryString);
  // query to the database and get the records
  request.query(queryString, function (err, recordset) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log("hitraterev worked");
    }
      var i = 0;
      recordset.recordsets[0].forEach(function (item) {
        let data = new HitRateRevData();
        data.id = i++;
        data.year = item.Year;
        data.month = item.Month;
        data.received = item.Received;
        data.total = item.Total;

        data.save();
      })
      if (err) console.log(err);
  });

  //return res.json({ success: true});

});

// Get method for hitratedata
router.get('/getHitRateRevData', (req, res) => {

  const query = {};
  const { id, update } = req.body;
  //console.log(req);
  //console.log(req.query.projectSize);
  HitRateRevData.find(query, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  }).sort( { id: 1 } );
});


/// Getting information from the local database
/// Retrieves info about employees and pushes to hitratedatas
/// Note: this deletes what is currently in the cloud DB and pushes a new selection instead
router.post('/initializeMapData', (req, res) => {
  db.db.dropCollection('mapdatas', function(err, result) {if (err) console.log('could not delete collection')});

  var request = new mssql.Request();
  
  var queryString = `
SELECT
  [ProjectCode]
  ,(CASE
		WHEN [ProjectStreet] LIKE '%&%'
			THEN NULL
		ELSE
			[ProjectStreet]
	END) AS 'ProjectStreet'
  ,[ProjectCity]
  ,[ProjectState]
  ,[ProjectZip]
FROM [Rombald2018].[dbo].[Project]
WHERE (ProjectStatus = 'Active'
  OR ProjectStatus = 'Completed')
  AND ProjectCode LIKE '%-%'
  AND ProjectCode > '16-000'
GROUP BY 
[ProjectCode]
,[ProjectStreet]
,[ProjectCity]
,[ProjectState]
,[ProjectZip]
ORDER BY ProjectCode DESC
`;

  // var date = new Date();
  // var year = date.getFullYear();
  // queryString = queryString.replace("--#year#", "'" + year.toString() + "'");

  //console.log(queryString);
  // query to the database and get the records
  request.query(queryString, function (err, recordset) {
    if (err) {
      console.log(err);
    } else {
      console.log("map worked");
    }
    var i = 0;
    recordset.recordsets[0].forEach(function (item) {
      let allNull = item.ProjectStreet || item.ProjectCity || item.ProjectState || item.ProjectZip;
      //console.log(item.ProjectCode + ": " + allNull)
      if (allNull) {
        let data = new MapData();
        data.id = i++;
        data.projectCode = item.ProjectCode;
        data.projectStreet = item.ProjectStreet;
        data.projectCity = item.ProjectCity;

        data.projectState = item.ProjectState;
        data.projectZip = item.ProjectZip;


        data.save();
      }
  })
  //return res.json({ success: true});
  });
});

// Get method for hitratedata
router.get('/getMapData', (req, res) => {

  const query = {};
  const { id, update } = req.body;
  //console.log(req);
  //console.log(req.query.projectSize);
  MapData.find(query, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  }).sort( { id: 1 } );
});

/// Save info grom geocode so it doesn't reach the quota
router.post('/saveLatLngData', (req, res) => {
  db.db.dropCollection('latlngdatas', function(err, result) {if (err) console.log('could not delete collection')});

  //console.log(JSON.stringify(req.body));

  const { data } = req.body;
  if(data === undefined || data === null) {
    return res.json({ success: false});
  }


  data.forEach(function (item, i) {
    let data = new LatLngData();
    data.id = i;
    data.projectCode = item.projectCode;
    data.lat = item.latitude;
    data.lng = item.longitude;

    data.save();
  })
  //return res.json({ success: true});

});

// Get method for hitratedata
router.get('/getLatLngData', (req, res) => {

  const query = {};
  const { id, update } = req.body;
  //console.log(req);
  //console.log(req.query.projectSize);
  LatLngData.find(query, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  }).sort( { id: 1 } );
});
// append /api for our http requests
app.use('/api', router);


// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
