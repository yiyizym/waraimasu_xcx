import { request } from '../../utils/http.js'

const app = getApp()

let retry_count = 15;

Page({
  data: {
    jokes: [],
    fetchDone: null,
    currentJokeIndex: 0,
    indicatorDots: true
  },
  onShareAppMessage: function (res) {
    return {
      title: '',
      path: '/pages/detail/detail?content=' + this.data.jokes[this.data.currentJokeIndex]['content'],
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onShow: function (options) {
    let page = this;
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType === 'none') {
          wx.showToast({
            title: '当前无网络，请检查网络',
            icon: 'none'
          })
          return;
        }
        page.checkLoginAndFetchData()
      },
      fail: function () {
        wx.showToast({
          title: '网络出错，请重试',
          icon: 'none'
        })
      }
    })
  },
  checkLoginAndFetchData: function(){
    if (retry_count <= 0){
      console.log('retry times over limit');
      return;
    }
    let page = this;
    if (app.globalData.userIsLogin === null) {
      setTimeout(() => {
        retry_count -= 1;
        page.checkLoginAndFetchData()
      }, 200)
    } else if (app.globalData.userIsLogin === true) {
      page.fetchData();
    } else {
      wx.showToast({
        title: '获取用户失败，请重试',
        icon: 'none'
      })
    }
  },
  fetchData: function () {
    let page = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    request({
      url: 'https://waraimasu.com/favorites/list',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (Number(res.data.return_code) !== 0) {
          console.log('return code not equal 0 ', res.data);
          return;
        }
        page.setData({
          jokes: res.data.jokes,
          fetchDone: true
        })
      },
      complete: function () {
        wx.hideLoading();
      }

    })
  },
  setCurrentJoke: function (item) {
    this.setData({
      currentJokeIndex: item.detail.current
    });
  }
})
