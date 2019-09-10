import Author from "models/Author.model"

import parseFormFiles from "helpers/parseFormFiles"
const create = async (req, res, next) => {
  try {
    const [files, fields] = await parseFormFiles(req)
  } catch (err) {
    return res.status(400).json({
      error: err
    })
  }

  let author = new Author(fields)
  author.createdBy = req.profile
  author.save((err, result) => {
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
    req.author && req.auth && req.author.createdBy._id == req.auth._id
  if (!isCreator) {
    return res.status("403").json({
      error: "Author is not authorized"
    })
  }
  next()
}

const remove = (req, res) => {
  let author = req.author
  Author.remove((err, deletedAuthor) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(deletedAuthor)
  })
}

const get_Authors_by_name = (req, res) => {
  const { name } = req.params
  Author.where("name")

    .equals(name)
    .select("")
    .exec(err => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json()
    })
}

const authorByID = (req, res, next, id) => {
  Author.findById(id).exec((err, author) => {
    if (err || !author)
      return res.status("400").json({
        error: "Authornot found"
      })
    req.author = author
    next()
  })
}

const AuthorSignIn = (req, res) => {
  Author.findOne(
    {
      email: req.body.email
    },
    (err, author) => {
      if (err || !author)
        return res.status("401").json({
          error: "Author not found"
        })

      if (!author.authenticate(req.body.password)) {
        return res.status("401").send({
          error: "Email and password don't match."
        })
      }

      const token = jwt.sign(
        {
          _id: author._id
        },
        config.jwtSecret
      )

      res.cookie("t", token, {
        expire: new Date() + 9999
      })

      return res.json({
        token,
        author: {
          _id: author._id,
          name: author.name,
          email: author.email
        }
      })
    }
  )
}

const AuthorSignOut = (req, res) => {
  res.clearCookie("t")
  return res.status("200").json({
    message: "signed out"
  })
}

const AuthorSignUp = (req, res) => {
  Author.exec((err, authors) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(authors)
  })
}

export {
  create,
  isCreator,
  remove,
  get_Authors_by_name,
  authorByID,
  AuthorSignIn,
  AuthorSignOut,
  AuthorSignUp
}
