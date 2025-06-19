const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const auth = req.headers.authorization;
    if(!auth || !auth.startsWith('Bearer '))
        return res.status(401).json({msg: 'Not authorized'})

    try {
        const token = auth.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        
        req.userId = payload.userId;
        next();
    } catch {
        res.status(401).json({msg: 'Token invalid or expired'})
    }
};