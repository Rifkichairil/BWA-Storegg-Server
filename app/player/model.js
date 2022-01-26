// variabkle 
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const HASH_ROUND = 10

let playerSchema = mongoose.Schema({
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
        default: 'user',
    },
    avatar: {
        type: String
    },
    fileName: {
        type: String
    },
    phoneNumber: {
        type: String,
        require: [true, 'Nomor Telpon harus diisi'],
    },
    favorite: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true})

playerSchema.path('email').validate(async function (value){
    try {
        const count = await this.model('Player').countDocuments({
            email: value
        })
        return !count;
    } catch (error) {
        throw error
    }
}, attr => `${attr.value} sudah terdaftar`)

playerSchema.pre('save', function (next)  {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND)
    next()
})

module.exports = mongoose.model('Player', playerSchema)