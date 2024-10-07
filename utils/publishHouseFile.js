const {Readable} = require('stream')
const {fireStorage} = require('../config/FirebaseConfig') 



module.exports = async (file,folderPath,type,lodgeUploadId) => {

return new Promise((resolve,reject)=>{
    
   if(!file ){
     reject('file can not be null ')
     return
   }
  
   Readable.from(Buffer.from(file,'base64')).pipe(fireStorage.bucket().file(`publishedHouses/${folderPath}`).createWriteStream()).on('data',()=>{

   }).on('finish',()=>{
    fireStorage.bucket().file(`publishedHouses/${folderPath}`).makePublic().then(result=>{
      resolve(
       {
        lodgeUploadId,
        type,
        url: fireStorage.bucket().file(`publishedHouses/${folderPath}`).publicUrl()
       }
      )
    }).catch(err=>reject(err))
     
   }).on('error',(err)=>{
     reject(err)
   })
   
})
}