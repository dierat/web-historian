// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var http = require("http");
var initialize = require("../web/initialize.js");

// Why do you think we have this here?
// HINT:It has to do with what's in .gitignore
initialize();

var port = 3000;
var ip = "127.0.0.1";
var server = http.createServer(function(req, res){
  res.end("I am here to archive your files!");
});
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

