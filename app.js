//app.js
App({
  onLaunch: function () {
    console.log('onLaunch')
    let self = this;
    wx.checkSession({
      success: function () {
        console.log('session valid')
        self.login()
      },
      fail: function () {
        console.log('session expires, login')
        //登录态过期
        self.login() //重新登录
      }
    })
  },
  login: function() {
    wx.login({
      success: function (resp) {
        if (resp.code) {
          wx.request({
            url: 'https://waraimasu.com/xcx/login',
            data: {
              code: resp.code
            },
            success: function (res) {
              if (Number(res.data.return_code) !== 0) {
                console.log('login failed! ', res.data);
                return;
              }
            },
            complete: function () {
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
  }
})