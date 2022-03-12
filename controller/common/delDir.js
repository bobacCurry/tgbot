const fs = require('fs')

const delDir = (path) => {
  
  const files = []
  
  if (fs.existsSync(path)) {
  
    const files = fs.readdirSync(path)
  
    files.forEach((file) => {
  
      const nextFilePath = `${path}/${file}`
  
      const states = fs.statSync(nextFilePath)
  
      if (states.isDirectory()) {
  
        //recurse
  
        delDir(nextFilePath)
  
      } else {
  
        //delete file
  
        fs.unlinkSync(nextFilePath)
  
      }

    })
    
    fs.rmdirSync(path)
  }
}

module.exports = delDir