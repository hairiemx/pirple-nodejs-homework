// Define environments container

/**
 * Creating and export configuration variables
 * 
 * 
 */

 // Create environments container
 var environments = {};

 // Staging environment (default)
 environments.staging = {
     "httpPort": 3000,
     "envName": "staging"
 };

 // Production environment
 environments.production = {
    "httpPort": 5000,
    "envName": "production"
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == "string" ? process.env.NODE_ENV:"";
console.log(currentEnvironment);
// Check that the current environment is one of the environment above. If not, default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == "object" ? environments[currentEnvironment]:environments.staging;
 

// Export the module
module.exports = environmentToExport;