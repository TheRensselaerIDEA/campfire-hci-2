const RemoteClient = require("./RemoteClient.js");

var REQ_URL = "https://google.com";

console.log("Running remote test...");
console.log(`Opening URL to ${REQ_URL}`)
//RemoteClient.setURL(REQ_URL);
RemoteClient.closeVC();