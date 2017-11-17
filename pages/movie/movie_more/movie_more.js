var util = require('../../../utils/util.js');
var app = getApp();

Page({

  data: {
    startCount: 0,
    isEmpty: true,
    again: false,
    over: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //动态更新导航栏标题
    var category = options.category;
    wx.setNavigationBarTitle({
      title: category
    });

    var dataUrl = '';
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters';
        break;
      case '即将上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon';
        break;
      case 'Top250':
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250';
        break;
    }

    this.setData({
      loading: true,
      requestUrl: dataUrl
    })
    util.movieHttp(dataUrl, this.doubanData);
  },

  doubanData: function (moviesDouban) {
    var movies = [];
    for (var ide in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[ide];
      //处理长度超过7的电影名称
      var title = subject.title;
      if (title.length > 7) {
        title = title.substring(0, 7) + '...'
      }
      var temp = {
        title: title,
        coverageUrl: subject.images.large,
        stars: util.starArray(subject.rating.stars),
        average: subject.rating.average.toFixed(1),
        movieId: subject.id
      }
      movies.push(temp)
    }

    //追加电影数据
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    if (moviesDouban.subjects.length > 0) {
      this.data.again = true;   //数据加载完毕
    } else {
      this.setData({
        over: true  //显示加载完毕
      })
    }

    this.setData({
      movies: totalMovies,
      loading: false
    });

    wx.stopPullDownRefresh();       //停止刷新
    wx.hideNavigationBarLoading();  //停止加载
  },

  /**
   * 上拉触底——加载更多
   */
  onReachBottom: function () {
    //上一次数据加载完毕后，才可以重新加载更多
    if (this.data.again) {
      this.data.startCount += 20;
      var nextUrl = this.data.requestUrl + '?start=' + this.data.startCount + '&count=20';
      util.movieHttp(nextUrl, this.doubanData);
      //开始加载，显示正在加载
      this.setData({
        again: false,
        loading: true
      })
      wx.showNavigationBarLoading();  //开始加载
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    var refreshUrl = this.data.requestUrl + '?start=0&count=20';
    this.setData({
      isEmpty: true,
      over: false,
      startCount: 0,
      movies: {}
    })
    util.movieHttp(refreshUrl, this.doubanData);
    wx.showNavigationBarLoading();  //开始加载
  },

  /**
   * 跳转到电影详情页
   */
  onMovieDeail: function (e) {
    var movieId = e.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie_detail/movie_detail?id=' + movieId
    })
  }
})