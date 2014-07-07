/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , nforce = require('nforce');
var util  = require('util');
var fs = require('fs');

var userName = 'hsharma@makepositive.demo';
var pw = 'Demo@1234';

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
 // app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Server listening on port " + app.get('port'));
});

var org;
var oauth;
	

fs.readFile("Settings.json", 'utf8', function (err, data) {
  if (err) {
    console.log('Error: ' + err);
    return;
  }
	data = JSON.parse(data);
	console.log('Creating connection');
   org = nforce.createConnection({
      clientId: data.Settings.clientId,
      clientSecret: data.Settings.clientSecret,
      redirectUri: data.Settings.redirectUri,
      apiVersion: data.Settings.apiVersion,  // optional, defaults to current salesforce API version
      environment: data.Settings.environment,  // optional, salesforce 'sandbox' or 'production', production default
      mode: data.Settings.mode // optional, 'single' or 'multi' user mode, multi default
    });


    org.authenticate({ username: data.Settings.userName, password: data.Settings.password }, function(err, oauth) {
	
		var q = 'SELECT count() FROM Account';
		org.query({ query: q }, function(err, resp){
		  if(err) console.log(err);
		  else console.log(resp);
		});
	
	});
  
  console.log(data);
});