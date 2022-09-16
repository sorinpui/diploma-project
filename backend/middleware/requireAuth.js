const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  // verifiy authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({errorMessage: "Authorization token is required."});
  }
  
  // example of authorization string "Bearer <tokenString>"
  const token = authorization.split(' ')[1];

  try {
    const { id } = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(id, "email");
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({errorMessage: "Your request is not authorized."});
  }
}

module.exports = requireAuth;
