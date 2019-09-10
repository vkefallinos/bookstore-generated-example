import Book from "models/Book.model"

import parseFormFiles from "helpers/parseFormFiles"
const create = async (req, res, next) => {
  try {
    const [files, fields] = await parseFormFiles(req)
  } catch (err) {
    return res.status(400).json({
      error: err
    })
  }

  let book = new Book(fields)
  book.createdBy = req.profile
  book.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(result)
  })
}

const isCreator = (req, res, next) => {
  let isCreator = req.book && req.auth && req.book.createdBy._id == req.auth._id
  if (!isCreator) {
    return res.status("403").json({
      error: "Book is not authorized"
    })
  }
  next()
}

const remove = (req, res) => {
  let book = req.book
  Book.remove((err, deletedBook) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(deletedBook)
  })
}

const BookById = (req, res) => {
  const { id } = req.params
  Book.findById(id)
  .exec(err => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json()
  })
}

const allBooks = (req, res) => {
  Book.select("").exec(err => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json()
  })
}

const get_Books_by_title = (req, res) => {
  const { title } = req.params
  Book.where("title")

    .equals(title)
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

const get_Books_by_isbnWithValue = (req, res) => {
  const { isbn } = req.params
  Book.where("isbn")

    .equals(isbn)
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

const bookByID = (req, res, next, id) => {
  Book.findById(id)
    .populate("author")
    .exec((err, book) => {
      if (err || !book)
        return res.status("400").json({
          error: "Booknot found"
        })
      req.book = book
      next()
    })
}

const removeBookById = (req, res) => {
  const { id } = req.body
  Book.exec((err, books) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(books)
  })
}

const createBook = (req, res) => {
  Book.exec((err, books) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
    res.json(books)
  })
}

const set_isbn = (req, res) => {
  const { id, new_isbn } = req.body
  Book.findById(id)

    .update({
      $set: {
        isbn: new_isbn
      }
    })
    .exec((err, books) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(books)
    })
}

const unset_isbn = (req, res) => {
  const { id } = req.body
  Book.findById(id)

    .update({
      $unset: {
        isbn: ""
      }
    })
    .exec((err, books) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(books)
    })
}

const increase_isbn = (req, res) => {
  const { id, increaseBy } = req.body
  Book.findById(id)

    .update({
      $inc: {
        isbn: increaseBy
      }
    })
    .exec((err, books) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(books)
    })
}

const decrease_isbn = (req, res) => {
  const { id, decreaseBy } = req.body
  Book.findById(id)

    .update({
      $dec: {
        isbn: decreaseBy
      }
    })
    .exec((err, books) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err)
        })
      }
      res.json(books)
    })
}

export {
  create,
  isCreator,
  remove,
  BookById,
  allBooks,
  get_Books_by_title,
  get_Books_by_isbnWithValue,
  bookByID,
  removeBookById,
  createBook,
  set_isbn,
  unset_isbn,
  increase_isbn,
  decrease_isbn
}
