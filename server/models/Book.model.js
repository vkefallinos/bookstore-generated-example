import mongoose from "mongoose"
const BookSchema = new mongoose.Schema({
  title: {
    type: String
  },
  isbn: {
    required: [true],
    type: "Number"
  }
})

BookSchema.methods = {}
const BookModel = mongoose.model(Book, BookSchema)

export default BookModel
