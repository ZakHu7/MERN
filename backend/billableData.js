
// /backend/actualQuotedData.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    id: Number,
    employeeID: String,
    hours: Number,
    year: Number,
    month: Number,
    billable: Boolean,

    
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("billableData", DataSchema);
