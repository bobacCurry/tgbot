const NodeCache = require('node-cache')

const axios = require('axios')

const config = require('../../config.js')

const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 })

const get_sms = async (zonecode, phone) => { //获取验证码

  const smscode = Math.floor(Math.random()*9000) + 1000

  let api = zonecode === '86' ? config.sms.china.api : config.sms.naion.api

  let mobile = zonecode === '86' ? phone : zonecode + ' ' + phone

  const content = "您的验证码是：" + smscode + "。请不要把验证码泄露给其他人。"

  const account = zonecode === '86' ? config.sms.china.account : config.sms.naion.account

  const password = zonecode === '86' ? config.sms.china.password : config.sms.naion.password

  const format = 'json'

  const params = { account, password, mobile, content, format }

  const { data } = await axios.get(api,{ params })

  if (data.code === 2) {

    return { code:1, msg: data.msg, smscode }
  
  }else{

    return { code:0, msg: data.msg, smscode }
  }
}

const get_key = (zonecode, phone) => {

  return zonecode + phone + 'SMS'
}

module.exports = {
  
  send_sms: async (req, res) => {
  
    const zonecode = req.body.zonecode
  
    const phone = req.body.phone
  
    if (!zonecode || !phone) {
  
      return res.send({ code: 0, msg: '信息不完整' })
    }
  
    const smsKey = get_key(zonecode, phone)

    const { code, msg, smscode } = await get_sms(zonecode, phone)

    if (!code) {

      return res.send({ code, msg })
    }

    const success = myCache.set(smsKey, smscode, 120)
  
    if (success) {
  
      return res.send({ code: 1, msg: '发送成功' })
    }
  },
  verify_sms: (zonecode, phone, smscode) => {
  
    if (!zonecode || !phone || !smscode) {
  
      return { code: 0, msg: '信息不完整' }
    }
    
    const smsKey = get_key(zonecode, phone)
  
    try {
  
      const code = myCache.get(smsKey, true)
  
      if (code != smscode) {
  
        return { code: 0, msg: '验证码错误' }
      }
  
      return { code: 1, msg: 'ok' }
  
    } catch (e) {
  
      return { code: 0, msg: '验证码已失效' }
    }
  },
  reset_sms: (zonecode, phone) => {

    const key = get_key(zonecode, phone)

    myCache.del(key)

    return true
  }
}