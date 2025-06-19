let jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      let token = authHeader.split(" ")[1];

      jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
        if (err) {
          res.status(500).json({
            title: "LodgeMe Authorization Message ",
            status: 500,
            successfull: false,
            message: "error occured",
            error: err.message,
          });
          return;
        }
        /*
          const userExistInDatabase = await Users.findOne({_id:decoded._id})
            
          if(!userExistInDatabase){
            res.status(500).json({
              title:"Authorization Message ",
              status:500,
              successfull:false,
              message:`The user with id= ${decoded._id} is not registered with us or account deleted`,
             
            })
           return
          }*/

        req.user = decoded;
        next();
      });
      return;
    }

    res.status(400).json({
      title: "Authorization message",
      message: "problem with authorization header check and try again",
    });
  } catch (err) {
    res.status(500).json({
      title: "Authorization Message",
      message: "internal server error",
      error: err.message,
    });
  }
};
