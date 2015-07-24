// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var http = require("http");
var initialize = require("../web/initialize.js");
var archive = require('../helpers/archive-helpers');
var CronJob = require('cron').CronJob;
// Why do you think we have this here?
// HINT:It has to do with what's in .gitignore
initialize();
var croned = false;

exports.job = new CronJob({
  cronTime: '00 * * * * *',
  onTick: function() {
    if(!croned){
      console.log("I AM THE LIZARD CRON");
      croned = true;
    }
    // read the list of archives sites, which returns an array
    archive.readListOfUrls('../web/archives/sites.txt', function(arr){
      // loop over array of sites to archive
      for (var i=0; i<arr.length; i++){
        // create function with unique scope
        function MyFunc(){
          var url = arr[i];
          console.log("url = ", url);
          archive.isUrlArchived(url, function(bool){
            if (!bool){
              console.log('url not logged: ' + url)
              // call download method on it
              archive.downloadUrls(url);
              // add it to the archivedSites text file
              archive.addUrlToList('../web/archives/archivedSites.txt', url);
            }// if statement
          });// isUrlArchived
        };// anonymous function
        MyFunc();
      }// for loop
    });// readListOfUrls
  },
  start: true,
  timeZone: 'America/Los_Angeles'
});

exports.job.start();
