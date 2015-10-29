# MeteorJS
[MeteorJS](www.meteorjs.com) is a JavaScript web application framework using Node.js. It integrates MongoDB and uses
publish-subscription patter to automatically propagate data changes to clients without requiring the developer to write
any synchronization code.

Meteor sample code are placed under the `meteor` directory.
Sample code used is taken from a marketing planning web application project.

## Codes
* `collections\` directory contains models used to connect to the MongoDB database.
* `methods.js` are methods used to invoke from the client.
* `publications.js` is a list of publications that the client can subscribe from MongoDB collections.
* `search_campaigns.feature` is an Gherkin feature file for the searching campaigns specification.
* `campaign_steps.js` is a companion step definitions related to campaign specifications.