export default {
  setStorage(key, data) {
    wx.setStorage({key, data})
  },
  toast(content) {
    wx.showModal({
      content: content,
      showCancel: false,
      confirmText: '我知道了'
    })
  }
}