var app = getApp();
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    castInfo: {},
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var castId = options.id;
    var castIdUrl = app.globalData.doubanBase + '/v2/movie/celebrity/' + castId;
    util.movieHttp(castIdUrl, this.doubanInfoData)
  },

  doubanInfoData: function (data) {
    var castInfo = {
      name: data.name,
      gender: data.gender,
      roles: data.works[0].roles,
      aka_en: data.aka_en,
      chinese_name: data.aka[0] ? data.aka[0] : '无',
      english_name: data.name_en,
      born: data.born_place ? data.born_place : '无',
      avartar: data.avatars ? data.avatars.large : '',
      works: util.castsWorks(data.works)
    }

    this.setData({
      castInfo: castInfo,
      loading: false
    })
  },

  /**
   * 预览的图片
   */
  onPreviewImg: function (e) {
    var url = e.currentTarget.dataset.src;
    wx.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url] // 需要预览的图片http链接列表
    })
  },

  /**
   * 跳转到电影详情页
   */
  onMovieDeail: function (e) {
    var movieId = e.currentTarget.dataset.movieid;
    wx.redirectTo({
      url: '../movie_detail/movie_detail?id=' + movieId
    })
  }


})