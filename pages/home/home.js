import { request } from '../../utils/http.js'

Page({
  data: {
    jokes: [],
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
  addFavorite: function(event){
    let page = this;
    if (page.alreadyFavorite(event.target.dataset.id)){
      return;
    }
    request({
      url: 'https://waraimasu.com/jokes/like',
      data: {
        joke_id: event.target.dataset.id
      },
      method: 'POST',
      success: function(res){
        if(res.data.return_code !== 0){
          wx.showToast({
            title: '收藏失败，请重试',
            icon: 'none'
          })
          console.log('addFavorite failed! ', res);
          return;
        }
        page.updateFavorite(event.target.dataset.id);
      }
    })
  },
  updateFavorite: function(id){
    let page = this;
    let jokes = JSON.parse(JSON.stringify(page.data.jokes));
    jokes.forEach((item) => {
      if (item.id === id) {
        item.favorite = true;
      }
    })
    page.setData({
      jokes: jokes
    })
  },
  alreadyFavorite: function(id){
    let result = false;
    this.data.jokes.forEach((joke) => {
      if(joke.id === id && joke.favorite){
        result = true;
      }
    })
    return result;
  },
  onShow: function (options) {
    let page = this,
        jokes = wx.getStorageSync(page.getDayKey());
    if (!!jokes){
      console.log('already got today\'s jokes');
      page.setData({
        jokes: jokes
      });
      return;
    }
    page.clearOldJokes();
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
    request({
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
        });
        page.saveJokes(res.data.jokes);
      },
      complete: function () {
        wx.hideLoading();
      }

    })
  },
  setCurrentJoke: function(item){
    this.setData({
      currentJokeIndex: item.detail.current
    });
  },
  getDayKey: function(){
    return `day_key_${(new Date()).toLocaleDateString()}`;//day_key_2018/3/14
  },
  clearOldJokes: function(){
    console.log('clear old jokes');
    wx.getStorageInfo({
      success: function(res){
        res.keys.forEach((key) => {
          if(key.indexOf('day_key_') !== -1){
            wx.removeStorageSync(key)
          }
        })
      }
    })
  },
  saveJokes: function(jokes){
    console.log('save jokes');
    let page = this;
    wx.setStorage({
      key: page.getDayKey(),
      data: jokes,
    })
  }
})
