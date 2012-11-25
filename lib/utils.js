var models = require('../models');
var fs     = require('fs');
var _      = require('underscore');
var async  = require('async');
var i      = require('util').inspect;

exports.loadFile = function(layoutId,layoutName,fileName,callback) {
  fs.readFile(fileName, function(err,data){
    if (err) {callback(err,null)} else {
      var plots = JSON.parse(data);
      console.log("plots: " + plots.features.length);
      async.waterfall([
        function(callback) {
          console.log("finding layout " + layoutId);
          models.Layout.findOne({_id: layoutId},function(err,result){
            if (err) {console.log("failed" + err);callback(err,null);}else {
              console.log("success" + result);callback(null,result);
            }
          });
        },
        function(layout,callback) {
          console.log("layout: " + layout);
          if (!layout) {
            console.log("creating new layout");
            new models.Layout({_id: layoutId,name: layoutName}).save(loggingCallback(callback));  
          } else {
            console.log("found layout" + layout);
            callback(null,layout);
          }
        }
      ],

      function(err,result) {
        if (err) {callback(err,result)} else {
          var number = 1;
          async.map(plots.features,function(plot,callback){
            plot.properties.number = number;
            number = number + 1;
            var plotParams = {layout: layoutId, 
              props: plot.properties, geometry: plot.geometry};
            console.log("creating plot: " + i(plotParams));
            new models.Plot(plotParams)
            .save(loggingCallback(callback));
          },callback);
        }
      }
      );
    } 
  });
}

function loggingCallback(callback){
  return function(err,result) {
    if (err) {console.log("failed" + err);callback(err,null);}else {
      console.log("success" + result);callback(null,result);
  }
}
}