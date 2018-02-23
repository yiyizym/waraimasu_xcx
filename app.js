//app.js
import { request } from 'utils/http.js'
App({
  onLaunch: function () {
    console.log('onLaunch')
    let self = this;
    wx.checkSession({
      success: function () {
        console.log('session valid')
        self.globalData.userIsLogin = true;
      },
      fail: function () {
        console.log('session expires, login')
        self.login()
      }
    })
  },
  login: function() {
    wx.login({
      success: function (resp) {
        if (resp.code) {
          request({
            url: 'https://waraimasu.com/xcx/login',
            data: {
              code: resp.code
            },
            success: function (res) {
              if (Number(res.data.return_code) !== 0) {
                console.log('login failed! ', res.data);
                self.globalData.userIsLogin = false;
                return;
              }
              self.globalData.userIsLogin = true;
              console.log('login success, res: ', res)
            },
            complete: function () {
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
          self.globalData.userIsLogin = false;
        }
      }
    })
  },
  globalData: {
    userIsLogin: null
  }
})