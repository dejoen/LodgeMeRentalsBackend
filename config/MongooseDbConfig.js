  const moongoose = require('mongoose')

   const  DatabaseConfig = async () =>{
   return await moongoose.connect(process.env.STAGING_DB_URL)
 }

 module.exports = DatabaseConfig