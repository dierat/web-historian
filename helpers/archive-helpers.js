var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require("request");

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!
exports.readListOfUrls = function(fileLocation, func){
  var arr;
  fs.readFile(fileLocation, {encoding: 'utf-8'}, function(err, data){
    arr = data.split('\n');
    func(arr);
  });
};

exports.isUrlInList = function(arr, dataFile){
  return _.contains(arr, dataFile);
};

exports.addUrlToList = function(fileLocation, dataFile){
  fs.appendFile(fileLocation, dataFile + '\n', function(err){
    if(err) throw err;
  });
};

exports.isURLArchived = function(){
};

exports.downloadUrls = function(dataFile){
  // console.log("downloadUrls calling!");
  request("http://" + dataFile, function(err, response, body) {
    fs.writeFile('../web/archives/sites/' + dataFile + '.txt', 
      body, function(err){ 
        if(err){console.log('error');}});
  });
};
