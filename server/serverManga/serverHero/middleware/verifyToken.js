const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
       return res.status(404).json({
            message : 'error with this token'
        })
    }
    if(authHeader === undefined){
       return res.status(401).json({ message: 'missing authorization header' })
    }
    const token = authHeader.split(' ')[1]
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET)
  
      req.userId = payload.userId 
      next()
    } catch (error) {
      return  res.status(404).json({
            message : 'error with this token'
        })

    }
  }

module.exports = auth