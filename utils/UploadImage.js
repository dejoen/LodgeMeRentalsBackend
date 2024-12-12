const { Readable } = require("stream");
const { fireStorage } = require("../config/FirebaseConfig");

module.exports = async (imageBase64, folderPath) => {
  return new Promise((resolve, reject) => {
    if (!imageBase64) {
      reject("file can not be null");
      return;
    }

    Readable.from(Buffer.from(imageBase64, "base64"))
      .pipe(fireStorage.bucket().file(folderPath).createWriteStream())
      .on("data", () => {})
      .on("finish", () => {
        fireStorage
          .bucket()
          .makePublic()
          .then(result => {
            
            resolve(fireStorage.bucket().file(folderPath).publicUrl());
          })
          .catch(err => reject(err));
      })
      .on("error", err => {
        reject(err);
      });
  });
};
