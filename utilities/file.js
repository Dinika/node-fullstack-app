const fs = require('fs')

exports.deleteFile = (fileUrl) => {
  const filePath = fileUrl.slice(1)
  fs.unlink(filePath, (err) => {
    if (err) {
      throw (err)
    }
  })
}