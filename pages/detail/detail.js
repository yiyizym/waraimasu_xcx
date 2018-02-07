//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    content: '',
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '',
      path: '/pages/detail/detail?content=' + this.data.content,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function (options) {
    let page = this;
    this.setData({
      content: options.content || ''
    });
  }
})
