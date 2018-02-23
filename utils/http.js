function request(obj) {
  wx.request({
    url: obj.url,
    data: obj.data,
    method: obj.method,
    header: {
      cookie: wx.getStorageSync('cookie')
    },
    success: function (res) {
      if (res.header['Set-Cookie']) {
        wx.setStorageSync('cookie', res.header['Set-Cookie'])
      }
      obj.success(res)
    },
    fail: function (res) {
      obj.fail && obj.fail(res)
    },
    complete: function(res){
      obj.complete && obj.complete(res)
    }
  })
}
module.exports = {
  request: request
}