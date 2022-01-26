const bankModel = require('./model')

module.exports ={
    index: async(req,res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = {
                message: alertMessage, status: alertStatus
            }
            const bank = await bankModel.find();

            res.render('admin/bank/view_bank', {
                bank,
                alert,
                name: req.session.user.name,
                title: 'Halaman Bank',
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },

    // Function
    viewCreate : async(req,res) => {
        try {
            res.render('admin/bank/create', {
                name: req.session.user.name,
                title: 'Halaman Tambah Bank',
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },

    viewEdit : async(req,res) => {
        try {
            const { id } = req.params
            const bank = await bankModel.findOne({_id: id})

            res.render('admin/bank/edit', {
                bank,
                name: req.session.user.name,
                title: 'Halaman Edit Bank',
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },

    actionCreate: async(req,res) => {
        try {
            const { name, nameBank, noRekening } = req.body
            let bank = await bankModel({ name, nameBank, noRekening  })
            
            await bank.save();

            req.flash('alertMessage', 'Berhasil tambah bank')
            req.flash('alertStatus', 'success')
            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },

    actionEdit: async (req,res) => {
        try {
            const { id } = req.params
            const { name, nameBank, noRekening } = req.body
            await bankModel.findOneAndUpdate({
                _id :id 
            }, { name, nameBank, noRekening });

            req.flash('alertMessage', 'Berhasil ubah bank')
            req.flash('alertStatus', 'success')
            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    },
    
    actionDelete: async (req, res) => {
        try {
            const {id} = req.params
            await bankModel.findOneAndRemove({_id: id})

            req.flash('alertMessage', 'Berhasil hapus bank')
            req.flash('alertStatus', 'success')
            res.redirect('/bank')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/bank')
        }
    }
}