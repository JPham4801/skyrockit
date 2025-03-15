const express = require('express')
const router = express.Router()

const User = require('../models/user')

// Index
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

// Create
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

// Update
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

router.get('/:applicationId/edit', async (req, res, next) =>{
  try {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);

    res.render('applications/edit.ejs', {
      application: application
      // => { application }
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.put('/:applicationId', async (req, res, next) =>{
  try {
    const currentUser = await User.findById(req.session.user._id);
    const application = currentUser.applications.id(req.params.applicationId);

    application.set(req.body)
    await currentUser.save()
    
    res.redirect(
      `/users/${currentUser._id}/applications/${req.params.applicationId}`
    );
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

module.exports = router