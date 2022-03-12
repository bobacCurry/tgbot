const fs = require('fs')

const path = require('path')

const config = require('../../config.js')

const COMMONPATH = 'static'

const exist_or_build = dir => {
  // 文件夹不存在则创建
  if (!fs.existsSync(dir)) {
    
    fs.mkdirSync(dir)
  }
}

module.exports = {
  
  upload_file: (req, res) => {
    
    let file_stream = req.body.image

    if (!file_stream || !file_stream.trim()) {
    
      return res.send({ success: false, msg: '没有接收到文件流' })
    
    }

    file_stream = file_stream.replace(/^data:image\/\w+;base64,/, '')

    const file_buffer = new Buffer(file_stream, 'base64')

    const filename = req.user._id + '_' + new Date().getTime() + '.jpeg'

    const file_path = path.resolve(process.cwd(), COMMONPATH, filename)

    exist_or_build(path.resolve(process.cwd(), COMMONPATH))

    return fs.writeFile(file_path, file_buffer, function(err) {
      
      if (err) {
        
        return res.send({ success: false, msg: err })
      
      } else {
      
        let pic_url = '/static' + '/' + filename

        return res.send({ success: true, msg: pic_url })
      }
    })
  }
}