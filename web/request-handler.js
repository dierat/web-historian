var path         = require('path');
var archive      = require('../helpers/archive-helpers');
var httpHelpers  = require('./http-helpers.js');
var fs           = require('fs');
var _            = require('../node_modules/underscore/underscore.js');
var request      = require("request");
 

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

      // read list of URLS
      fs.readFile('./archives/sites.txt', {encoding: 'utf-8'}, function(err, data){
        // split data into an array
        var arr = data.split('\n');

        // if dataFile is not in the array
        if ( !(_.contains(arr, dataFile)) ){
          archive.downloadUrls(dataFile);
          
          archive.addUrlToList('./archives/sites.txt', dataFile);

          // this code is happening way before the dependent function are being executed
          httpHelpers.serveAssets(res, __dirname + '/public/loading.html', function(){}, 302);

        // the following code should stay here

        }else{
          httpHelpers.serveAssets(res, './archives/sites/' + dataFile + '.txt', function(){});
        }
      });
    });
  }
  // res.end(archive.paths.list);
};
