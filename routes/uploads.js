const multer = require('multer')

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images')
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/files')
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const imageFileFilter = (req, file, cb) => {
  if ((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const pdfFileFilter = (req, file, cb) => {
  if ((file.mimetype).includes('pdf')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const imageUpload = multer({ storage: imageStorage, fileFilter: imageFileFilter })
const pdfUpload = multer({ storage: pdfStorage, fileFilter: pdfFileFilter })

module.exports = {
  imageUpload: imageUpload.single('imageUpload'),
  pdfUpload: pdfUpload.single('pdfUpload')
}
