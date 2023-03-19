const User = require('../models/user.model')
const jwt = require('jsonwebtoken')

const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const { request } = require('http');
const { default: mongoose } = require('mongoose');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

const register = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      console.log(req.body)
      if (!email || !password) {
          return res.status(400).json({
              message: 'Please provide all values'
          })
      }
  
      const userAlreadyExists = await User.findOne({ email : email });
  
      if (userAlreadyExists) {
          return res.status(409).json({
              message: 'Email already in use'
          })
      }
  
      const user = await User.create(req.body)
      console.log(user)
      const token = signToken(user.id);
  
      return res.status(StatusCodes.CREATED).json({
          message: 'User created successfully',
          token: token,
          user: {
              email: user.email,
              id: user.id,
          }
      });
  
    } catch (error) {
      return next(error);
    }
  }
  

const login = async (req, res,) => {
    const { email, password } = req.body;
    console.log(email, password)
    if (!email || !password) {
        return res.status(403).json({
            message: 'Invalid email or password'
        })
    };

    const user = await User.findOne({ email }).select('+password')
    if (!user) {
        return res.status(403).json({
            message: 'Invalid username'
        })
    }
    const isPassword = await user.comparePassword(password);
    if (!isPassword) {
        return res.status(403).json({
            message : 'Invalid password'
        })
    }

    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
    user.password = undefined;

    return res.status(StatusCodes.OK).json({
        user, token,
    })
}

const profile = async (req, res) => {
    const id = req.params.id;
    const user = await User.findOne({ _id: mongoose.Types.ObjectId(id) })
    const token = jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    )
    res.status(StatusCodes.OK).json({ user,token })
}
const updateProfile = async(req, res) => { 
    try {
        const id = req.params.id
        const user = await User.findOne({ _id: id })
        if(!user){
            res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
                message : 'User not found with id ' + id
            })
        }
        const updateUser = await User.findByIdAndUpdate(id , {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            gender : req.body.gender,
            age  : req.body.age
    
        },  { new : true})
        res.status(StatusCodes.OK).json({updateUser});
    } catch (e) {
        res.status(StatusCodes.EXPECTATION_FAILED).json({
            message : 'Error updating profile'
        })
    }
  
}


module.exports = { login, register, profile,updateProfile }

