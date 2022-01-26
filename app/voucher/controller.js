const req = require('express/lib/request')
const voucherModel = require('./model')
const categoryModel = require('../category/model')
const nominalModel  = require('../nominal/model')
const path = require('path')
const fs = require('fs')
const config = require('../../config')

module.exports ={
    index: async(req,res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = {
                message: alertMessage, status: alertStatus
            }
            const voucher = await voucherModel.find().populate('category').populate('nominals');
            console.log(voucher);
            res.render('admin/voucher/view_voucher', {
                voucher,
                alert,
                name: req.session.user.name,
                title: 'Halaman Dashboard',
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    // Function
    viewCreate : async(req,res) => {
        try {
            const category = await categoryModel.find();
            const nominal = await nominalModel.find();
            res.render('admin/voucher/create', {
                category, nominal
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    viewEdit : async(req,res) => {
        try {
            const { id } = req.params
            const category = await categoryModel.find();
            const nominal = await nominalModel.find();
            const voucher = await voucherModel.findOne({_id: id}).populate('category').populate('nominals');

            res.render('admin/voucher/edit', {
                voucher, category, nominal
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    actionCreate: async(req,res) => {
        try {
            const { name, status, thumbnail, category, nominals, user } = req.body
            let voucher = await voucherModel({ name, status, thumbnail, category, nominals, user   })

            if (req.file) {
                let tmp_path = req.file.path
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
                let filename = req.file.filename + '.' + originalExt
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)
            
                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)
                
                src.pipe(dest)

                src.on('end', async ()=> {

                    try {
                        const voucher = new voucherModel({
                            name, category, nominals, thumbnail: filename
                        })
                        await voucher.save();
                        req.flash('alertMessage', 'Berhasil tambah voucher')
                        req.flash('alertStatus', 'success')
                        res.redirect('/voucher')

                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/voucher')
                    }
                })
            } else {
                const voucher = new voucherModel({
                    name, category, nominals
                })
                await voucher.save();
                req.flash('alertMessage', 'Berhasil tambah voucher')
                req.flash('alertStatus', 'success')
                res.redirect('/voucher')
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    actionEdit: async (req,res) => {
        try {
            const { id } = req.params
            const { name, category, nominals } = req.body

            if (req.file) {
                let tmp_path = req.file.path
                let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
                let filename = req.file.filename + '.' + originalExt
                let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`)
            
                const src = fs.createReadStream(tmp_path)
                const dest = fs.createWriteStream(target_path)
                
                src.pipe(dest)

                src.on('end', async ()=> {
                    try {
                        const voucher = await voucherModel.findOne({_id: id})
                        let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
                        // Delete image in folder uploads
                        if (fs.existsSync(currentImage)) {
                            fs.unlinkSync(currentImage)
                        }

                        await voucherModel.findByIdAndUpdate({
                            _id : id
                        },{
                            name, category, nominals, thumbnail: filename
                        })

                        req.flash('alertMessage', 'Berhasil ubah voucher')
                        req.flash('alertStatus', 'success')
                        res.redirect('/voucher')

                    } catch (error) {
                        req.flash('alertMessage', `${error.message}`)
                        req.flash('alertStatus', 'danger')
                        res.redirect('/voucher')
                    }
                })
            } else {
                await voucherModel.findByIdAndUpdate({
                    _id : id
                },{
                    name, category, nominals
                })

                req.flash('alertMessage', 'Berhasil uabh voucher')
                req.flash('alertStatus', 'success')
                res.redirect('/voucher')
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
    
    actionDelete: async (req, res) => {
        try {
            const {id} = req.params
            const voucher = await voucherModel.findOneAndRemove({_id: id});
            let currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;
            // Delete image in folder uploads
            if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage)
            }

            req.flash('alertMessage', 'Berhasil hapus voucher')
            req.flash('alertStatus', 'success')
            res.redirect('/voucher')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },

    actionStatus: async(req, res) => {
        try {
            const {id} = req.params
            let voucher = await voucherModel.findOne({_id: id})
            let status = voucher.status === 'Y' ? 'N' : 'Y'

            voucher = await voucherModel.findOneAndUpdate({_id: id}, {status})

            req.flash('alertMessage', 'Berhasil update status')
            req.flash('alertStatus', 'success')
            res.redirect('/voucher')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }
    },
}