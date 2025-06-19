//const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
} = require("firebase/storage");
const { getAuth } = require("firebase/auth");
const admin = require("firebase-admin/app");
const storage = require("firebase-admin/storage");
const fs = require("fs");
const { Readable } = require("stream");

const firebaseApp = admin.initializeApp({
  credential: admin.cert({
    type: process.env.Type,
    project_id: process.env.ProjectId,
    private_key_id: process.env.PrivateKeyId,
    private_key: process.env.PrivateKey.replace(/\\n/gm, "\n"),
    client_email: process.env.ClientEmail,
    client_id: process.env.ClientId,
    auth_uri: process.env.AuthUri,
    token_uri: process.env.TokenUri,
    auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.client_x509_cert_url,
    universe_domain: process.env.universe_domain,
  }),
  storageBucket: "lodgeme-2470e.appspot.com",
});

const fireStorage = storage.getStorage(firebaseApp);

module.exports = { firebaseApp, fireStorage };
