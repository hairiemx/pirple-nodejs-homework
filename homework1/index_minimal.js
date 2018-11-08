/**
 * Simple RESTful API
 * As this API does not depends on the payload/request body, request on "data" and "end" were not included. 
 */

// Dependencies

var http = require('http');
var url = require('url');

// HTTP server 
var httpServer = http.createServer(function(req,res){
    // Parse request URL
    var parsedURL = url.parse(req.url,true);

    // Get the path 
    var path = parsedURL.pathname.toLowerCase();

    // Trimm path
    var trimmedPath = path.replace(/^\/+|\/+$/g,'');

    // Choose the handlers this request should go. If not found, should go to notFound handler
    var chosenHandler = typeof(router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;
    
    // Route the request to the handler specified in the router 
    chosenHandler(function(statusCode, payload){
        // Use the status code called back by the handler of default
        statusCode = typeof(statusCode) == "number" ? statusCode : 200;
        // Use the payload called back by the handler of default
        payload = typeof(payload) == "object" ? payload : {};

        // Convert the payload to a string
        var payloadString = JSON.stringify(payload);

        // Set the content type to JSON
        res.setHeader("Content-Type","application/json");

        // Return the response
        res.writeHead(statusCode);
        
        // Send the response
        res.end(payloadString);

        console.log("Returning this response: ", statusCode, payloadString);
    });
    
});

httpServer.listen(3000, function(){
    console.log("HTTP server currently running on port 3000");
});
// Define the handlers
var handlers = {};

// Hello handler
handlers.hello = function(callback){
    // Callback a http status code, and a payload object
    callback(200,{'message' : 'Welcome to "Hello World API!"'});
};

//Not Found handler
handlers.notFound = function(callback){
    callback(404);
};

// Define a request router

var router = {
    "hello": handlers.hello,
    "notFound": handlers.notFound
};