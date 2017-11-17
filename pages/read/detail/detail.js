// detail.js

var detailData = require('../../../data/data.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.data.currentPostId = postId;
    var detail_Data = detailData.indexList[postId];
    this.setData(detail_Data);

    var postsCollected = wx.getStorageSync('posts_Collected')
    if (postsCollected) {
      var showCollected = postsCollected[postId];
      this.setData({
        collected: showCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_Collected", postsCollected);
    }

    var that = this;
    //监听音乐播放
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
    })

    //监听音乐暂停
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
    })

    //监听音乐停止
    wx.onBackgroundAudioStop(function(){
      that.setData({
        isPlayingMusic: false
      })
    })
  },

  //退出页面
  onUnload: function () {
    wx.stopBackgroundAudio();
  },

  /**
  * 收藏点击事件
  */
  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_Collected');
    var showCollected = postsCollected[this.data.currentPostId];
    showCollected = !showCollected;
    postsCollected[this.data.currentPostId] = showCollected;
    //更新文章是否收藏
    wx.setStorageSync("posts_Collected", postsCollected);
    //更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: showCollected
    })

    wx.showToast({
      title: showCollected ? "收藏成功" : "取消成功",
      icon: 'success',
      duration: 1000
    })
  },

  /**
  * 分享事件
  */
  onShareTap: function (event) {
    var itemList = [
      '分享给微信好友',
      '分享到朋友圈',
      '分享到QQ',
      '分享到微博'
    ]
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (res.tapIndex !== undefined) {
          wx.showModal({
            title: '选择' + itemList[res.tapIndex],
            content: '现在暂时无法分享，敬请期待！'
          })
        }
      }
    })
  },

  /**
  * 音乐播放事件
  */
  onMusicTap: function (event) {
    var currentPostId = this.data.currentPostId;
    var detail_Data = detailData.indexList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: detail_Data.music.url,
        title: detail_Data.music.title,
        coverImgUrl: detail_Data.music.coverImgUrl
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})