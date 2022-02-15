const playerModel = require('./model')
const voucherModel = require('../voucher/model')
const categoryModel = require('../category/model')
const bankModel = require('../bank/model')
const paymentModel = require('../payment/model')
const nominalModel = require('../nominal/model')
const transactionModel = require('../transaction/model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')
const { json } = require('express')


module.exports = {
    landingPage : async (req, res) => {
        try {
            const voucher = await voucherModel.find()
            .select('_id name status category thumbnail')
            .populate('category')
            
            res.status(200).json({
                data: voucher
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal server error!'
            })
        }
    },

    detailPage : async (req, res) => {
        try {
            const { id } = req.params
            const voucher = await voucherModel.findOne({_id: id})
            .populate('category')
            .populate('nominals')
            .populate('user', '_id name phoneNumber')

            const payment = await paymentModel.find().populate('banks')

            if (!voucher) {
                return res.status(404).json({
                    message: 'Voucher game tidak ditemukan !'
                })
            }
            res.status(200).json({
                data: {
                    detail : voucher,
                    payment
                }
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'Internal server error!'
            })
        }
    },

    category : async ( req,res ) => {
        try {
            const category = await categoryModel.find()

            res.status(200).json({
                data: category
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'internal server error'

            })
        }
    },

    checkout : async (req,res) => {
        try {
            const { accountUser, name, nominal, voucher, payment, bank } = req.body
            
            const res_voucher = await voucherModel.findOne({_id : voucher})
            .select('name category _id thumbnail user')
            .populate('category')
            .populate('user')

            // Voucher
            if (!res_voucher) return res.status(404).json({
                message: ' voucher game tidak ditemukan!'
            })

            const res_nominal = await nominalModel.findOne({
                _id : nominal
            })
            
            // Nominal
            if (!res_nominal) return res.status(404).json({
                message: ' nominal game tidak ditemukan!'
            })

            // Payment
            const res_payment = await paymentModel.findOne({
                _id : payment
            })
            
            if (!res_payment) return res.status(404).json({
                message: ' payment game tidak ditemukan!'
            })

            // Bank
            const res_bank = await bankModel.findOne({
                _id : bank
            })
            
            if (!res_bank) return res.status(404).json({
                message: ' bank game tidak ditemukan!'
            })

            // Tax
            let tax = (10/100) * res_nominal._doc.price;
            let value =res_nominal._doc.price - tax;

            // Payload
            const payload = {
                historyVoucherTopup : {
                    gameName : res_voucher._doc.name,
                    category: res_voucher._doc.category ? res_voucher._doc.category.name : '',
                    thumbnail: res_voucher._doc.thumbnail,
                    coinName: res_nominal._doc.coinName,
                    coinQty: res_nominal._doc.coinQty,
                    price: res_nominal._doc.price,
                },
                historyPayment : {
                    name: res_bank._doc.name,
                    type: res_payment._doc.type,
                    bankName: res_bank._doc.bankName,
                    noRekening:res_bank._doc.noRekening,
                },
                name : name,
                accountUser : accountUser,
                tax : tax,
                value : value,
                player: req.player._id,

                historyUser : {
                    name : res_voucher._doc.user?.name,
                    phoneNumber : res_voucher._doc.user?.phoneNumber
                },

                category: res_voucher._doc.category?._id,
                user : res_voucher._doc.user?._id,
            }

            const transaction = new transactionModel(payload) 

            await transaction.save()

            res.status(201).json({
                data: transaction
            })

        } catch (error) {
            res.status(500).json({
                message: error.message || 'internal server error'

            })
        }
    },

    history : async (req,res) => {
        try {
            const { status = '' } = req.query;
            let criteria = {}

            if (status.length) {
                criteria = {
                    ...criteria,
                    status : { $regex: `${status}`, $options: 'i'}
                }
            } 

            if (req.player._id) {
                criteria = {
                    ...criteria,
                    player : req.player._id
                }
            }

            const history = await transactionModel.find(criteria)

            // Aggregate
            let total = await transactionModel.aggregate([
                {$match : criteria},
                {
                    $group: {
                        _id : null,
                        value : {$sum: "$value"}
                    }
                }
            ])

            res.status(200).json({
                data : history,
                total: total.length ? total[0].value : 0
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'internal server error'

            })
        }
    },

    historyDetail : async (req,res) => {
        try {
            const { id } = req.params
            const history = await transactionModel.findOne({_id : id})

            if (!history) return res.status(404).json({
                message: "History tidak ditemukan"
            })

            res.status(200).json({
                data:history
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'internal server error'

            })
        }
    },

    dashboard : async (req,res ) => {
        try {
            const count = await transactionModel.aggregate([
                {$match: {player : req.player._id}},
                {
                    $group : {
                        _id : '$category',
                        value: {$sum: 'value'}
                    }
                }
            ])

            const category = await categoryModel.find()

            category.forEach(element => {
                count.forEach(data => {
                    if(data._id.toString() === element._id.toString()){
                        data.name = element.name
                    }
                })
            })

            const history = await transactionModel.find({player: req.player._id})
            .populate('category')
            .sort({'updatedAt' : -1})


            res.status(200).json({
                data:count,
                count: count
            })
        } catch (error) {
            
        }
    },

    profile : async (req,res) => {
        try {

            const player = {
                id : req.player._id,
                username : req.player.username,
                email : req.player.email,
                name : req.player.name,
                avatar : req.player.avatar,
                phoneNumber : req.player.phoneNumber,
            }

            res.status(200).json({
                data : player
            })
        } catch (error) {
            res.status(500).json({
                message: error.message || 'internal server error'

            })
        }
    },

    editProfile : async (req, res, next) => {
        try {
            const { name = "", phoneNumber = ""} = req.body

            const payload = {}

            if (name.length) payload.name = name
            if (phoneNumber.length) payload.phoneNumber = phoneNumber

            if (req.file) {

                let tmp_path = req.file.path
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
                let filename = req.file.filename + '.' + originalExt
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)
            
                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)
                
                src.pipe(dest)

                src.on('end', async ()=> {
                        let player = await playerModel.findOne({_id: req.player._id})
                        let currentImage = `${config.rootPath}/public/uploads/${player.avatar}`;
                        // Delete image in folder uploads
                        if (fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage)
                        }

                        player = await playerModel.findByIdAndUpdate({
                            _id : req.player._id
                        },{
                            ...payload,
                            avatar:filename
                        }, {new : true, runValidators:true})

                        res.status(201).json({
                            data : {
                                id: player._id,
                                name: player.name,
                                phoneNumber: player.phoneNumber,
                                avatar: player.avatar,
                            }
                        })
                    })
            
            } else {
                const player = await playerModel.findOneAndUpdate({
                    _id : req.player._id
                }, payload, {new : true, runValidators:true})

                res.status(201).json({
                    data: {
                        
                        id: player._id,
                        name: player.name,
                        phoneNumber: player.phoneNumber,
                        avatar: player.avatar,
                    }
                })
            }

        } catch (error) {
            if (error && error.name === "ValidationError") {
                res.status(422).json({
                    error : 1,
                    message : error.message,
                    fields: error.errors
                })
            }
        }
    }

}