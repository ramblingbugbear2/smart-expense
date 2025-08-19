const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');

const genTokens = (userId) => {
    const access = jwt.sign({ userId}, process.env.JWT_ACCESS_SECRET,{expiresIn: '59m'});
    const refresh = jwt.sign({ userId}, process.env.JWT_REFRESH_SECRET,{expiresIn: '7d'});
    return {access,refresh};
};

exports.signup = async(req,res) => {
    const {name,email,password} = req.body;
    const exists = await User.findOne({email});
    if(exists) return res.status(400).json({msg: 'Email already registered'});

    const user = await User.create({name,email,password});
    const {access,refresh} = genTokens(user._id);

    res
        .cookie('refreshToken', refresh, {httpOnly: true, sameSite: 'strict', maxAge: 7 * 864e5})
        .status(201)
        .json({access});
};

exports.login = async(req,res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user || !(await user.matchPassword(password)))
        return res.status(401).json({msg: 'Invalid credentials'});

    const {access, refresh} = genTokens(user._id);
    res
        .cookie('refreshToken', refresh, {httpOnly: true, sameSite: 'strict', maxAge: 7 * 864e5})
        .json({access});
};

exports.refresh= (req,res) => {
    const token = req.cookies.refreshToken;
    if(!token) return res.status(401).json({msg: 'No refresh token'});

    try{
        const payload = jwt.verify(token,process.env.JWT_REFRESH_SECRET);
        const access = jwt.sign({userId: payload.userId}, process.env.JWT_ACCESS_SECRET, {expiresIn:'15m'});
        res.json({access});
    } catch  {
        res.status(401).json({msg: 'Refresh token invalid'});
    }
};
