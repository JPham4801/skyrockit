const passUserToView = (req, res, next) =>{
  // questions first- req.session.user ? => true or false
  // if true req.session.user
  // if false null
  res.locals.user = req.session.user ? req.session.user : null
  next()
}

module.exports = passUserToView