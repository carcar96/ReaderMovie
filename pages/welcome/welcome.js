
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    avatarUrl: '',
    pageShow: false
  },

  onLoad: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.getHistory();
    this.getUser();//用户信息
  },

  //用户信息
  getUser: function () {
    var that = this;
    wx.getUserInfo({
      success: function (res) {
        var nickName = res.userInfo.nickName;
        var avatarUrl = res.userInfo.avatarUrl;
        that.setData({
          nickName: nickName,
          avatarUrl: avatarUrl
        })
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  //缓存信息
  getHistory: function () {
    var open = wx.getStorageSync('open')
    if (open) {
      wx.switchTab({
        url: '/pages/read/index/index'
      })
    } else {
      wx.setStorageSync('open', true);
      this.setData({
        pageShow: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  navigateToIndex: function (o) {
    wx.switchTab({
      url: '/pages/read/index/index'
    })
  }
})