const req = require('express/lib/request')
const paymentModel = require('./model')
const bankModel = require('../bank/model')

module.exports ={
    index: async(req,res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = {
                message: alertMessage, status: alertStatus
            }
            const payment = await paymentModel.find().populate('banks');
            // console.log(payment);

            res.render('admin/payment/view_payment', {
                payment,
                alert,
                name: req.session.user.name,
                title: 'Halaman Pembayaran',
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },

    // Function
    viewCreate : async(req,res) => {
        try {
            const banks = await bankModel.find();
            res.render('admin/payment/create', {
                banks
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },

    viewEdit : async(req,res) => {
        try {
            const { id } = req.params
            const payment = await paymentModel.findOne({_id: id}).populate('banks');
            const bank = await bankModel.find();

            res.render('admin/payment/edit', {
                payment, bank
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },

    actionCreate: async(req,res) => {
        try {
            const { type, banks } = req.body
            let bank = await paymentModel({ type, banks })

            await bank.save();

            req.flash('alertMessage', 'Data Tipe Pembayaran berhasil ditambahkan')
            req.flash('alertStatus', 'success')
            res.redirect('/payment')

        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/voucher')
        }

    },

    actionEdit: async (req,res) => {
        try {
            const { id } = req.params
            const { type, banks } = req.body
            
            await paymentModel.findByIdAndUpdate({
                _id : id
            },{
                type, banks
            })
            req.flash('alertMessage', 'Data Tipe Pembayaran berhasil diubah')
            req.flash('alertStatus', 'success')
            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
    
    actionDelete: async (req, res) => {
        try {
            const {id} = req.params
            const payment = await paymentModel.findOneAndRemove({_id: id});
           
            req.flash('alertMessage', 'Berhasil hapus payment')
            req.flash('alertStatus', 'success')
            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },

    actionStatus: async(req, res) => {
        try {
            const {id} = req.params
            let payment = await paymentModel.findOne({_id: id})
            let status = payment.status === 'Y' ? 'N' : 'Y'

            payment = await paymentModel.findOneAndUpdate({_id: id}, {status})

            req.flash('alertMessage', 'Berhasil update status')
            req.flash('alertStatus', 'success')
            res.redirect('/payment')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/payment')
        }
    },
}