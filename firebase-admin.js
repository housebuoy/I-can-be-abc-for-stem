const admin = require("firebase-admin");
const serviceAccount = require("./i-can-be-abc-for-stem-96094-firebase-adminsdk-cbidy-cb7b5ec482.json"); // Use the downloaded service account file

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
