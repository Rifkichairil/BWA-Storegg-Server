// variabkle 
const mongoose = require('mongoose')
let userSchema = mongoose.Schema({
    email: {
        type: String,
        require: [true, 'Email harus diisi'],
    },
    name: {
        type: String,
        require: [true, 'Name harus diisi'],
    },
    password: {
        type: String,
        require: [true, 'Katasandi harus diisi'],
    },
    status:{
        type: String,
        enum: ['Y', 'N'],
        default: 'Y',
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'admin',
    },
    phoneNumber: {
        type: String,
        require: [true, 'Nomor Telpon harus diisi'],
    }
}, { timestamps: true})

module.exports = mongoose.model('User', userSchema)