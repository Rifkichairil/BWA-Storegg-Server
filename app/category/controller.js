const categoryModel = require('./model')

module.exports ={
    index: async(req,res) => {
        try {
            const alertMessage = req.flash("alertMessage")
            const alertStatus = req.flash("alertStatus")

            const alert = {
                message: alertMessage, status: alertStatus
            }
            const category = await categoryModel.find();

            res.render('admin/category/view_category', {
                category,
                alert,
                name: req.session.user.name,
                title: 'Halaman Kategori',
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },

    // Function
    viewCreate : async(req,res) => {
        try {
            res.render('admin/category/create', {
                name: req.session.user.name,
                title: 'Halaman Tambah Kategori',
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },

    viewEdit : async(req,res) => {
        try {
            const { id } = req.params
            const category = await categoryModel.findOne({_id: id})

            res.render('admin/category/edit', {
                category,
                name: req.session.user.name,
                title: 'Halaman Edit Kategori',
            })
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },

    actionCreate: async(req,res) => {
        try {
            const { name } = req.body
            let category = await categoryModel({ name })
            
            await category.save();
            req.flash('alertMessage', 'Berhasil tambah categori')
            req.flash('alertStatus', 'success')
            res.redirect('/category')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },

    actionEdit: async (req,res) => {
        try {
            const { id } = req.params
            const { name } = req.body
            await categoryModel.findOneAndUpdate({
                _id :id 
            }, {name});

            req.flash('alertMessage', 'Berhasil ubah categori')
            req.flash('alertStatus', 'success')
            res.redirect('/category')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    },
    
    actionDelete: async (req, res) => {
        try {
            const {id} = req.params
            await categoryModel.findOneAndRemove({_id: id})

            req.flash('alertMessage', 'Berhasil hapus categori')
            req.flash('alertStatus', 'success')
            res.redirect('/category')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`)
            req.flash('alertStatus', 'danger')
            res.redirect('/category')
        }
    }
}