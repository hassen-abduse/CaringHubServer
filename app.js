const createError = require('http-errors')

const express = require('express')
const path = require('path')
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')
const auth = require('./routes/auth')
const { userImageUpload, volImageUpload, volResumeUpload, orgLogoUpload, projectImageUpload, uploadMultiple } = require('./routes/uploads')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const projectsRouter = require('./routes/projectsRouter')
const orgsRouter = require('./routes/organizationsRouter')
const appsRouter = require('./routes/applicationsRouter')
const helpsRouter = require('./routes/helpRequestsRouter')
const volsRouter = require('./routes/volunteersRouter')
const causesRouter = require('./routes/causesRouter')
const skillsRouter = require('./routes/skillsRouter')
const { approveApp, approveOrg } = require('./routes/approval')
const { multiPartUpload, getItem } = require('./routes/cos')

//getBucketContents('caringhub')
// multiPartUpload('caringhub', 'uploads.js', './routes/uploads.js')

const dbUrl = process.env.MONGODB_URI
//const connect = mongoose.connect(dbUrl)

// connect.then((db) => {
//   console.log('Succesfully Connected to the DB Server.')
// }, (err) => console.log(err))

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors());

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '/public')))
app.use(passport.initialize())
app.use('/public/images', express.static(path.join(__dirname, 'public/images')))
app.use('/public/files', express.static(path.join(__dirname, 'public/files')))
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/volunteers', volsRouter)
app.use('/orgs', orgsRouter)
app.use('/causes', causesRouter)
app.use('/skills', skillsRouter)
app.use('/applications', appsRouter)
app.use('/helps', helpsRouter)
app.use('/projects', projectsRouter)
app.use('/uploadVolImage', volImageUpload)
app.use('/uploadVolResume', volResumeUpload)
app.use('/uploadOrgLogo', orgLogoUpload)
app.use('/uploadUserImage', userImageUpload)
app.use('/projectImageUpload', projectImageUpload)
app.use('/approveOrg', approveOrg)
app.use('/approveApp', approveApp)

app.post('/testCos', uploadMultiple.single('up'), (req, res, next) => {
  multiPartUpload('caringhub', req.file.filename, 'public/images/' + req.file.filename)
  res.send(req.file)
})

app.get('/testCos', (req, res, next) => {
  getItem('caringhub', 'Profile.pdf').then((data) => {
    res.json(data)
  })
})



app.get('/login', (req, res) => {
  res.render('index', { title: 'Express' })
})

app.post('/login', (req, res, next) => {
  passport.authenticate(['user-local', 'vol-local', 'org-local'], (err, user, info) => {
    const error = err || info
    if (error) return res.json(401, error)
    req.logIn(user, (err) => {
      if (err) return res.send(err)
      const token = auth.getToken({ _id: req.user._id, role: req.user.role })
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json({ success: true, token: token, status: 'Login Success!' })
    })
  })(req, res, next)
})

app.get('/logout', (req, res, next) => {

})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app