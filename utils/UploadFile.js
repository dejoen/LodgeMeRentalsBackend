  const {Readable} = require('stream')
   const {fireStorage} = require('../config/Firebase/FirebaseConfig') 
module.exports = async (file,folderPath) => {
   return new Promise((resolve,reject)=>{
      if(!file){
        reject('file can not be null')
        return
      }
     
      Readable.from(Buffer.from(file.base64,'base64')).pipe(fireStorage.bucket().file(`agentVerification/${folderPath}/${file.name}`).createWriteStream()).on('data',()=>{

      }).on('finish',()=>{
         resolve('successfully uploaded')
      }).on('error',(err)=>{
        reject(err)
      })
      
   })
}