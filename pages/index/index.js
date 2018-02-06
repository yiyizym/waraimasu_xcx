//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    jokes: [],
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
    },
  },
  onLoad: function (options) {
    let page = this;
    wx.getNetworkType({
      success: function(res){
        if (res.networkType === 'none'){
          wx.showToast({
            title: '当前无网络，请检查网络',
            icon: 'none'
          })
          return;
        }
        page.fetchData();
      },
      fail: function(){
        wx.showToast({
          title: '网络出错，请重试',
          icon: 'none'
        })
      }
    })
  },
  fetchData: function () {
    let page = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    wx.request({
      url: 'https://waraimasu.com/jokes/list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (Number(res.data.return_code) !== 0) {
          console.log('return code not equal 0 ', res.data);
          return;
        }
        page.setData({
          jokes: res.data.jokes
        })
      },
      complete: function () {
        wx.hideLoading();
      }

    })
  }
})
