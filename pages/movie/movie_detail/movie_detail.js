var app = getApp();
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId = options.id;
    var movieIdUrl = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    util.movieHttp(movieIdUrl, this.doubanData)
  },

  doubanData: function (data) {

    //电影详情页信息
    var movie = {
      movieImg: data.images ? data.images.large : '', //电影图片
      country: data.countries[0] ? data.countries[0]:'无', //电影拍摄的国家(城市)
      title: data.title,  //电影标题
      original_title: data.original_title,  //别名
      wish_count: data.wish_count,  //期望值(想观看人数)
      comments_count: data.comments_count,  //评论数
      collect_count: data.collect_count,  //收藏数
      year: data.year, //电影上映年份
      genres: data.genres.join('、'),  //类型
      stars: util.starArray(data.rating.stars), //星星数
      average: data.rating.average.toFixed(1), //电影评分
      summary: data.summary,  //电影简介
      directors: util.movieDirectors(data.directors), //导演
      directorsInfo: util.movieDirectorsInfo(data.directors), //导演信息
      casts: util.movieCasts(data.casts), //影人(主演人)
      castsInfo: util.movieCastsInfo(data.casts), //影人(主演人)信息
    }

    this.setData({
      movie: movie
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
  * 跳转到个人页
  */
  onCastCele: function (e) {
    var castId = e.currentTarget.dataset.castid;
    wx.navigateTo({
      url: '../movie_celebrity/movie_celebrity?id=' + castId
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})