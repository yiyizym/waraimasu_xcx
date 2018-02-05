//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    jokes: [{
      id: 1,
      text: 'hi, here you are'
      },
      {
        id: 2,
        text: 'hear me ?'
      },
      {
        id: 3,
        text: 'some times a man'
      }],
    indicatorDots: true,
    onShareAppMessage: function (res) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
        console.log(res.target)
      }
      return {
        title: '自定义转发标题',
        // path: '/page/user?id=123',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
  }
})
