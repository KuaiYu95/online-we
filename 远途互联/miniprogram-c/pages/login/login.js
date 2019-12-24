import Util from '../../utils/util.js'
import { hexMD5 } from '../../utils/md5.js'
let app = getApp()
let { httpUrl, unionId } = app.globalData
Page({
  data: {
    disabled: true,
    loading: false,
    eyy: true,
    phone: '',
    password: '',
    eyyImg: 'https://front-images.oss-cn-hangzhou.aliyuncs.com/i4/a5afc904a7dbd1cbadb22ff6edef1cb7-56-56.png',
  },
  toLogin() {
    let {phone, password} = this.data
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
        },
        complete: () => {
          this.setData({ phone: '', password: '', disabled: true, loading: false })
        }
      })
    })
  },
  // 暂存手机号
  setPhone(e) {
    let phone = e.detail.value
    this.setData({ phone })
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
    const { password, eyy } = this.data
    if (password.length == 0) {
      eyy ? this.setData({ eyyImg: this.eyyImgs[0] }) : this.setData({ eyyImg: this.eyyImgs[2] })
    } else {
      eyy ? this.setData({ eyyImg: this.eyyImgs[1] }) : this.setData({ eyyImg: this.eyyImgs[3] })
    }
  },
  // eyy图标
  eyyImgs: [
    'https://front-images.oss-cn-hangzhou.aliyuncs.com/i4/a5afc904a7dbd1cbadb22ff6edef1cb7-56-56.png',
    'https://front-images.oss-cn-hangzhou.aliyuncs.com/i4/cae5cacab2932ac7f6da4a8e20fe76d0-56-56.png',
    'https://front-images.oss-cn-hangzhou.aliyuncs.com/i4/39ec0a62a56c06206a3653a73b5d07bc-56-56.png',
    'https://front-images.oss-cn-hangzhou.aliyuncs.com/i4/b59713281a6e015febcbfdfd2f94b0a0-56-56.png'
  ],
})