
var fs    = require('fs');
var _     = require('underscore');
var async = require('async');
var models = require('../models');
/*
 * GET home page.
 */

exports.index = function(req, res){
  var selectedLayout = req.query.layout;
  fs.readdir('./data/', function (err, files) {
    if (err) throw err;
    var layouts = _.map(files,function(file){
                        var name = file.substr(0,file.indexOf('.'));
                        return { name: name.replace('-',' '), id: name}
                      });
    if (!selectedLayout) {
      selectedLayout = layouts[0].id;
    }
    res.render('index', { title: 'RealGIS', layouts: layouts, selectedLayout:  selectedLayout});
  });
};

exports.properties = function(req, res){
  var selectedLayout = req.query.layout;
  models.Layout.find(function(err,layouts){
    if (err) throw err;
    if (!selectedLayout) {
      selectedLayout = layouts[0].id;
    }
    res.render('properties', { title: 'RealGIS', layouts: layouts, selectedLayout:  selectedLayout});
  });
};

exports.layout = function(req, res) {
  var selectedLayout = req.params.layout;
  var layoutFile = selectedLayout.replace(' ','-') + '.json';
  fs.readFile('./data/' + layoutFile, function(err,data){
    if (err) throw err;
    res.send(data);
  });
}

function copyObject(src,dest) {
  for (var key in src) {
      dest[key] = src[key];
  }
  return dest;
}


exports.updatePlot = function(req, res) {
  var plotData = req.body;
  var layout = req.params.layout;
  var plotId = parseInt(req.params.id,10);
  var fileName = './data/' + layout + ".json"
  async.waterfall([
    function(callback) {
      fs.readFile(fileName, callback);
    },
    function(fileData,callback) {
      var data = JSON.parse(fileData);
      _.each(data.features,function(feature) {
        if (feature.properties.id === plotId) {
          copyObject(plotData,feature.properties);    
        }
      })
      fs.writeFile(fileName,JSON.stringify(data),callback);
    }
    ],
    function(err,result) {
      if (err) throw err;
      res.send("success");
    });
}