const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cors = require('cors')
const logger = require('morgan')
const config = require('./config')
const mongoose = require('mongoose')
const passport = require('passport')
const auth = require('./routes/auth')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const projectsRouter = require('./routes/projectsRouter')
const orgsRouter = require('./routes/organizationsRouter')
const appsRouter = require('./routes/applicationsRouter')
const helpsRouter = require('./routes/helpRequestsRouter')
const volsRouter = require('./routes/volunteersRouter')
const causesRouter = require('./routes/causesRouter')
const skillsRouter = require('./routes/skillsRouter')


const dbUrl = process.env.MONGODB_URI
const connect = mongoose.connect(dbUrl)

connect.then((db) => {
  console.log('Succesfully Connected to the DB Server.')
}, (err) => console.log(err))

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(passport.initialize())
app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/volunteers', volsRouter)
app.use('/orgs', orgsRouter)
app.use('/causes', causesRouter)
app.use('/skills', skillsRouter)
app.use('/applications', appsRouter)
app.use('/helps', helpsRouter)
app.use('/projects', projectsRouter)

app.get('/login', (req, res) => {
  res.render('index', { title: 'Express' })
})

app.post('/login', (req, res, next) => {
  passport.authenticate(['user-local', 'vol-local', 'org-local'], (err, user, info) => {
    const error = err || info
    if (error) return res.json(401, error)
    req.logIn(user, (err) => {
      if (err) return res.send(err)
      const token = auth.getToken({ _id: req.user._id })
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json({ success: true, token: token, Role: req.user.role, userId: req.user._id, status: 'Login Success!' })
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
