import formidable from "formidable"
export default req => {
  return new Promise((resolve, reject) => {
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err)
      }
      resolve([files, fields])
    })
  })
}
