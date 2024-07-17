const express = require('express')
const router = express.Router()

const User = require('../models/user')

router.get('/', async (req, res, next) =>{
  try {
    const currentUser = await User.findById(req.session.user._id)
    res.render('applications/index.ejs', {
      applications: currentUser.applications
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.get('/new', (req, res, next) =>{
  res.render('applications/new.ejs')
})

router.post('/', async (req, res, next) =>{
  try {
    const currentUser = await User.findById(req.session.user._id)
    // .push is not Array.prototype.push() => it's a mongoose method
    currentUser.applications.push(req.body)
    await currentUser.save()

    res.redirect(`/users/${currentUser._id}/applications`)
  } catch (error) {
    console.log(error)
    red.redirect('/')
  }
})

router.get("/:applicationId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId)
    res.render('applications/show.ejs', {
        application: application
    })
  } catch (error) {
    console.log(error);
    res.redirect("/");
  }
});

router.delete('/:applicationId', async (req, res, next) =>{
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.applications.id(req.params.applicationId).deleteOne()
    await currentUser.save()

    res.redirect(`/users/${currentUser._id}/applications`)
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

module.exports = router