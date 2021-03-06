import crypto from "crypto"
const AuthorSchema = new mongoose.Schema({
  hashed_password: {
    type: String,
    required: [true, "Password is required"]
  },
  salt: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
    trim: true,
    match: /.+@.+..+/
  },
  name: {
    type: String,
    required: [true, "Please set your name"]
  }
})

AuthorSchema.virtual("password")
  .get(function() {
    return this._password
  })
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })

AuthorSchema.path("hashed_password").validate([
  {
    validator: function checkPassword(v) {
      if (this._password && this._password.length < 6) {
        this.invalidate("password", "Password must be at least 6 characters.")
      }
      if (this.isNew && !this._password) {
        this.invalidate("password", "Password is required")
      }
    },
    msg: ""
  }
])

AuthorSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  makeSalt: function() {
    return Math.round(new Date().valueOf() * Math.random()) + ""
  },
  encryptPassword: function(password) {
    if (!password) return ""
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex")
    } catch (err) {
      return ""
    }
  }
}
const AuthorModel = mongoose.model(Author, AuthorSchema)

export default AuthorModel
