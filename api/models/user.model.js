const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true},
        email: { type: String, required: true, unique: true, lowerCase: true},
        password: { type: String, required: true, minlength: 6},
    },
    { timestamps: true }
);

//.pre "Run this function before saving  document to the database"
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);