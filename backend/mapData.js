
// /backend/actualQuotedData.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    id: Number,
    projectCode: String,
    projectStreet: String,
    projectCity: String,
    projectState: String,
    projectZip: String,
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("mapData", DataSchema);
