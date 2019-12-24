import Util from '../../utils/util.js'
import { hexMD5 } from '../../utils/md5.js'
let app = getApp()
let { httpUrl, unionId } = app.globalData
Page({
  data: {
    time: 60,
    disabled: true,
    text: '获取验证码',
    yzm: '',
    phone: '',
    password: '',
    eyy: false,
    eyyImg: 'https://front-images.oss-cn-hangzhou.aliyuncs.com/i4/043f6eee641d17dc4a5a068bab4890d6-40-40.png',
  },
  getValidateCode() {
    let { phone, time } = this.data
    if (time != 60) {
      return
    }
    if (phone.length < 11) {
      Util.toast('请输入正确的手机号码')
      return
    }
    wx.request({
      url: httpUrl + '/user-web/restapi/common/ytUsers/getValidateCode',
      data: { phoneNum: phone, unionId, msgSendScene: '1'},
      success: (res) => {
        let { data, success } = res.data
        let _this = this
        if (success) {
          this.daojishi()
        } else {
          Util.toast(res.data.msg)
        }
      },
      fail: (err) => {
        Util.toast(err.errMsg)
      }
    })
  },
  daojishi() {
    let { time } = this.data
    let t = time - 1
    this.setData({text: t + 's', time: t})
    if (t == 0) {
      this.setData({text: '重新发送', time: 60})
      return 
    }
    setTimeout(() => this.daojishi(), 1000);
  },
  toRegister() {
    let {phone, password, yzm} = this.data
    wx.request({
      url: httpUrl + '/user-web/restapi/common/ytUsers/reg',
      data: { phoneNum: phone, unionId, password: hexMD5(password), valCode: yzm },
      success: (res) => {
        let { data, success } = res.data
        if (success) {
          console.log(data)
          this.toLogin()
        } else {
          Util.toast(res.data.msg)
        }
      },
      fail: (err) => {
        Util.toast(err.errMsg)
      }
    })
  }, 
  toLogin() {
    let { phone, password } = this.data
    this.setData({
      loading: true
    }, () => {
      wx.request({
        url: httpUrl + '/user-web/restapi/common/ytUsers/login',
        data: { phoneNum: phone, password: hexMD5(password), unionId },
        success: (res) => {
          let { data, success } = res.data
          if (success) {
            Util.setStorage('userId', data.userId)
            wx.switchTab({ url: '/pages/home/home' })
          } else {
            Util.toast(res.data.msg)
          }
        },
        fail: (err) => {
          Util.toast(err.errMsg)
          this.setData({ phone: '', password: '', yzm: '', text: '重新发送', disabled: true, loading: false })
        },
      })
    })
  },
  // 暂存手机号
  setPhone(e) {
    let phone = e.detail.value
    this.setData({ phone })
    this.setBtn()
  },
  // 暂存验证码
  setYzm(e) {
    let yzm = e.detail.value
    this.setData({ yzm })
    this.setBtn()
  },
  // 暂存密码
  setPassword(e) {
    let password = e.detail.value
    this.setData({ password }, () => { this.setEyy() })
    this.setBtn()
  },
  // 明文密码切换
  tempEyy() {
    const { eyy } = this.data
    this.setData({ eyy: !eyy }, () => { this.setEyy() })
  },
  // 登录按钮是否可以点击
  setBtn() {
    const { phone, password } = this.data
    this.setData({ disabled: !(phone.length > 0 && password.length > 5) })
  },
  // eyy图标切换
  setEyy() {
    const { eyy } = this.data
    this.setData({ eyyImg: eyy ? this.eyyImgs[0] : this.eyyImgs[1] })
  },
  eyyImgs: [
    'https://front-images.oss-cn-hangzhou.aliyuncs.com/i4/043f6eee641d17dc4a5a068bab4890d6-40-40.png',
    'https://front-images.oss-cn-hangzhou.aliyuncs.com/i4/7384fbedea36b95dd10d12a9a54f0b9e-40-40.png'
  ],
})