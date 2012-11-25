
var mongoose = require('mongoose')
  ,Schema = mongoose.Schema
  ,ObjectId = Schema.ObjectId;

mongoose.connect('mongodb://localhost/real-gis');

var layoutSchema = new Schema({
    _id : String,
    name: String,
    bounds: []
});

var plotSchema = new Schema({
    _id : ObjectId,
    layout: {type: String, ref: "Layouts"},
    props: {
      number: String,
      status: String,
      size: String,
      area: String,
      direction: String,
      owner: String
     },
    geometry: {
      type: String,
      coordinates: []
    } 
});

module.exports = {
  Layout: mongoose.model('Layouts', layoutSchema),
  Plot: mongoose.model('Plots', layoutSchema)
} 