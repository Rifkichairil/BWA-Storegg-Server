const nominalModel = require('./model')

module.exports ={
    index: async(req,res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = {
                message: alertMessage, status: alertStatus
            }
            const nominal = await nominalModel.find();

            res.render('admin/nominal/view_nominal', {
                nominal,
                alert
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },

    // Function
    viewCreate : async(req,res) => {
        try {
            res.render('admin/nominal/create')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },

    viewEdit : async(req,res) => {
        try {
            const { id } = req.params
            const nominal = await nominalModel.findOne({_id: id})

            res.render('admin/nominal/edit', {
                nominal
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },

    actionCreate: async(req,res) => {
        try {
            const { coinName, coinQty, price } = req.body
            let nominal = await nominalModel({ coinName, coinQty, price  })
            
            await nominal.save();
            req.flash('alertMessage', 'Berhasil tambah nominal')
            req.flash('alertStatus', 'success')
            res.redirect('/nominal')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },

    actionEdit: async (req,res) => {
        try {
            const { id } = req.params
            const { coinName, coinQty, price } = req.body
            await nominalModel.findOneAndUpdate({
                _id :id 
            }, { coinName, coinQty, price });

            req.flash('alertMessage', 'Berhasil ubah nominal')
            req.flash('alertStatus', 'success')
            res.redirect('/nominal')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    },
    
    actionDelete: async (req, res) => {
        try {
            const {id} = req.params
            await nominalModel.findOneAndRemove({_id: id})

            req.flash('alertMessage', 'Berhasil hapus nominal')
            req.flash('alertStatus', 'success')
            res.redirect('/nominal')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/nominal')
        }
    }
}