
// /backend/actualQuotedData.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    id: Number,
    name: String,
    percentages: Array,
    // jan: Number,
    // feb: Number,
    // mar: Number,
    // apr: Number,
    // may: Number,
    // jun: Number,
    // jul: Number,
    // aug: Number,
    // sep: Number,
    // oct: Number,
    // nov: Number,
    // dec: Number,
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("actualQuotedData", DataSchema);
