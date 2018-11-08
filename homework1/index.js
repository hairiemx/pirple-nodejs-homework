/**
 * Simple RESTful API
 * 
 */

// Dependencies

var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

// HTTP server 
var httpServer = http.createServer(function(req,res){
    // Parse request URL
    var parsedURL = url.parse(req.url,true);

    // Get the path 
    var path = parsedURL.pathname.toLowerCase();

    // Trimm path
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Get the query string as an object 
    var queryStringObject = parsedURL.query;

    // Get the HTTP method
    var method = req.method.toLowerCase();

    // Get the headers as an object 
    var headers = req.headers;
    
    // Get the payload, if any
   var decoder = new StringDecoder('utf-8');
   var buffer = '';
   req.on('data',function(data){
       buffer += decoder.write(data);
   });
   req.on('end',function(){
       buffer += decoder.end();

       // Choose the handlers this request should go. If not found, should go to notFound handler
       var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
       // Construct the data object to send to the handler
       var data = {
           'trimmedPath' : trimmedPath,
           'queryStringObject' : queryStringObject,
           'method' : method,
           'headers' : headers,
           'payload' : buffer
       };
       // Route the request to the handler specified in the router 
       chosenHandler(data, function(statusCode, payload){
           // Use the status code called back by the handler of default
           statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
           // Use the payload called back by the handler of default
           payload = typeof(payload) == 'object' ? payload : {};

           // Convert the payload to a string
           var payloadString = JSON.stringify(payload);

           // Set the content type to JSON
           res.setHeader('Content-Type','application/json');

           // Return the response
           res.writeHead(statusCode);
           


           // Send the response
           res.end(payloadString);

           console.log('Returning this response: ', statusCode, payloadString);
       });
    });
});

httpServer.listen(config.httpPort, function(){
    console.log(`HTTP server currently running on port ${config.httpPort}`);
});
// Define the handlers
var handlers = {};

// Hello handler
handlers.hello = function(data,callback){
    // Callback a http status code, and a payload object
    callback(200,{'message' : 'Welcome to "RESTFul Hello World API"'});
};

//Not Found handler
handlers.notFound = function(data,callback){
    callback(404,{'message' : `No handler found for specified path ${data.trimmedPath}`});
};

// Define a request router

var router = {
    'hello': handlers.hello,
    'notFound': handlers.notFound
};