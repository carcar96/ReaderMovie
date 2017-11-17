var md5 = require('../../../utils/md5.js');

var indexData = require('../../../data/data.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index_key: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index_key: indexData.indexList
    })
    //var obj = this.asAndcp();
    //this.touTiaoNews(obj.as, obj.cp);
  },

  asAndcp: function () {
    var t = Math.floor((new Date).getTime() / 1e3),
      e = t.toString(16).toUpperCase(),
      n = md5(t).toString().toUpperCase();
    if (8 != e.length) return {
      as: "479BB4B7254C150",
      cp: "7E0AC8874BB0985"
    };
    for (var o = n.slice(0, 5), i = n.slice(- 5), a = "", r = 0; 5 > r; r++) a += o[r] + e[r];
    for (var l = "",
      s = 0; 5 > s; s++) l += e[s + 3] + i[s];
    return {
      as: "A1" + a + e.slice(- 3),
      cp: e.slice(0, 3) + l + "E1"
    }
  },

  //新闻API
  touTiaoNews: function (asStr, cpStr, flag) {
    var that = this;
    wx.request({
      url: 'https://m.toutiao.com/list/',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        tag: 'news_entertainment',
        ac: 'wap',
        count: 20,
        format: 'json_raw',
        as: asStr,
        cp: cpStr,
        min_behot_time: flag ? Date.parse(new Date()) / 1000 : 0
      },
      success: function (res) {
        console.log(res);
        that.touTiaoDetail(res.data.data[0].group_id);
      },
      fail: function () {
        console.log('error')
      }
    })
  },

  //头条新闻详情页API
  touTiaoDetail: function (id) {
    wx.request({
      url: 'https://m.toutiao.com/i' + id + '/info/',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
      },
      fail: function () {
        console.log('error')
      }
    })
  },

  /**
   * 详情页
   */
  navigateToDetail: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: '../detail/detail?id=' + postId
    })
  },

  /**
   * 轮播图-->详情页
   */
  onSwiperItemTap: function (event) {
    //target 和 currentTarget
    //target 指的是当前点击的组件（image）
    //currentTarget 指的是事件捕获的组件（swiper）
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: '../detail/detail?id=' + postId
    })
  },

  //下拉刷新
  onPullDownRefresh: function () {
    var obj = this.asAndcp();
    this.touTiaoNews(obj.as, obj.cp, true);
  }
})