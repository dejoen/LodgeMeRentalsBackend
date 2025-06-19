const { Readable } = require("stream");
const { fireStorage } = require("../config/FirebaseConfig");

module.exports = async (imageBase64, folderPath, oldPath) => {
  return new Promise((resolve, reject) => {
    if (!imageBase64) {
      reject("file can not be null");
      return;
    }

    if (oldPath) {
      fireStorage
        .bucket()
        .file(oldPath)
        .delete()
        .then(() => {
          Readable.from(Buffer.from(imageBase64, "base64"))
            .pipe(fireStorage.bucket().file(folderPath).createWriteStream())
            .on("data", () => {})
            .on("finish", () => {
              fireStorage
                .bucket()
                .makePublic()
                .then((result) => {
                  resolve(fireStorage.bucket().file(folderPath).publicUrl());
                })
                .catch((err) => reject(err));
            })
            .on("error", (err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      Readable.from(Buffer.from(imageBase64, "base64"))
        .pipe(fireStorage.bucket().file(folderPath).createWriteStream())
        .on("data", () => {})
        .on("finish", () => {
          fireStorage
            .bucket()
            .makePublic()
            .then((result) => {
              resolve(fireStorage.bucket().file(folderPath).publicUrl());
            })
            .catch((err) => reject(err));
        })
        .on("error", (err) => {
          reject(err);
        });
    }
  });
};
