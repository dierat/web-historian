var path         = require('path');
var archive      = require('../helpers/archive-helpers');
var httpHelpers  = require('./http-helpers.js');
var fs           = require('fs');
var _            = require('../node_modules/underscore/underscore.js');
var request      = require("request");
 

exports.handleRequest = function (req, res) {


  if(req.method === 'GET'){
    if (req.url === '/'){
      req.url += 'index.html';
    }
    console.log("returning ",__dirname + '/public' + req.url);
    httpHelpers.serveAssets(res, __dirname + '/public' + req.url, function(){});
  }
  if(req.method === 'POST'){
    var dataFile = '';
    req.on('data', function(chunk){
      dataFile += chunk;
    });
    req.on('end', function(){ //cached level 1
      //will need to account for www
      //e.g. when the user types google.com when we have cached www.google.com
      dataFile = dataFile.slice(4);
      //cached level 2
      fs.readFile('./archives/sites.txt', {encoding: 'utf-8'}, function(err, data){
        // split data into an array
        var arr = data.split('\n');

        // if dataFile is not in the array
        if ( !(_.contains(arr, dataFile)) ){
          // use append to add this string to the end of 
          // the file with '\n' at the end
          // archive the actual website

          //cache level 3?
          request("http://" + dataFile, function(err, response, body) {
            // write file for this site, adding body to it (should create file is doesn't exist)

            //cache level 4
            fs.writeFile('./archives/sites/' + dataFile + '.txt', body, function(err){ console.log('error');});
          });
          fs.appendFile('./archives/sites.txt', dataFile + '\n', function(err){
            if(err) throw err;
            //
            httpHelpers.serveAssets(res, __dirname + '/public/loading.html', function(){}, 302);
          });
        }else{
          httpHelpers.serveAssets(res, './archives/sites/' + dataFile + '.txt', function(){});
        }
      });
    });
  }
  // res.end(archive.paths.list);
};
