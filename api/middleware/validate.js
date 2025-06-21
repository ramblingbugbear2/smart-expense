module.exports = schema => (req,res,next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err){
        res.status(400).json({
            msg:'Validation error', issues:err.errors
        })
    }
};