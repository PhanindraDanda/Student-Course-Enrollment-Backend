const admin = require("firebase-admin");
const serviceAccount = require("./ServiceAccount.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

console.log("Initialising firebase Admin");
module.exports = admin.auth();
