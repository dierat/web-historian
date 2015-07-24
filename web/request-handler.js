var path         = require('path');
var archive      = require('../helpers/archive-helpers');
var httpHelpers  = require('./http-helpers.js');
var fs           = require('fs');
var _            = require('../node_modules/underscore/underscore.js');
var request      = require("request");
var htmlFetcher  = require("../workers/htmlfetcher.js");
 

exports.handleRequest = function (req, res) {

  console.log("Getting ", req.method, " request from ", req.url);

  if(req.method === 'GET'){
    if (req.url === '/'){
      req.url += 'index.html';
    }
    // console.log("returning ",__dirname + '/public' + req.url);
    httpHelpers.serveAssets(res, __dirname + '/public' + req.url, function(){});
  }
  if(req.method === 'POST'){
    var dataFile = '';
    req.on('data', function(chunk){
      dataFile += chunk;
    });
    req.on('end', function(){ 
      //will need to account for www
      //e.g. when the user types google.com when we have cached www.google.com
      dataFile = dataFile.slice(4);

      archive.readListOfUrls('./archives/sites.txt', function(arr){
        // if dataFile is not in the array
        if ( !( archive.isUrlInList(arr, dataFile) ) ){

          // archive.downloadUrls(dataFile);

          archive.addUrlToList('./archives/sites.txt', dataFile);

          // this code is happening way before the dependent function are being executed
          httpHelpers.serveAssets(res, __dirname + '/public/loading.html', function(){}, 302);

        }else{
          // if it has already been archived
          archive.isUrlArchived(dataFile, function(isURLArchived){
            if ( isURLArchived ) {
              // send back the archived site
              httpHelpers.serveAssets(res, './archives/sites/' + dataFile + '.txt', function(){});
            // else
            } else {
              // send back the loading screen
              httpHelpers.serveAssets(res, __dirname + '/public/loading.html', function(){}, 302);
            }
          }); //ends archive.isUrlArchived()
        }
      });//ended fs.readFile
    });//req.on('end')
  }//if POST
  // res.end(archive.paths.list);
};
