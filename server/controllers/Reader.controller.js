import Reader from "models/Reader.model"

import parseFormFiles from "helpers/parseFormFiles"
const create = async (req, res, next) => {
  try {
    const [files, fields] = await parseFormFiles(req)
  } catch (err) {
    return res.status(400).json({
      error: err
    })
  }

  let reader = new Reader(fields)
  reader.createdBy = req.profile
  reader.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(result)
  })
}

const isCreator = (req, res, next) => {
  let isCreator =
    req.reader && req.auth && req.reader.createdBy._id == req.auth._id
  if (!isCreator) {
    return res.status("403").json({
      error: "Reader is not authorized"
    })
  }
  next()
}

const remove = (req, res) => {
  let reader = req.reader
  Reader.remove((err, deletedReader) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(deletedReader)
  })
}

const readerByID = (req, res, next, id) => {
  Reader.findById(id)
    .populate("favouriteBooks")
    .exec((err, reader) => {
      if (err || !reader)
        return res.status("400").json({
          error: "Readernot found"
        })
      req.reader = reader
      next()
    })
}

const ReaderSignIn = (req, res) => {
  Reader.findOne(
    {
      email: req.body.email
    },
    (err, reader) => {
      if (err || !reader)
        return res.status("401").json({
          error: "Reader not found"
        })

      if (!reader.authenticate(req.body.password)) {
        return res.status("401").send({
          error: "Email and password don't match."
        })
      }

      const token = jwt.sign(
        {
          _id: reader._id
        },
        config.jwtSecret
      )

      res.cookie("t", token, {
        expire: new Date() + 9999
      })

      return res.json({
        token,
        reader: {
          _id: reader._id,
          name: reader.name,
          email: reader.email
        }
      })
    }
  )
}

const ReaderSignOut = (req, res) => {
  res.clearCookie("t")
  return res.status("200").json({
    message: "signed out"
  })
}

const ReaderSignUp = (req, res) => {
  Reader.exec((err, readers) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(readers)
  })
}

export {
  create,
  isCreator,
  remove,
  readerByID,
  ReaderSignIn,
  ReaderSignOut,
  ReaderSignUp
}
