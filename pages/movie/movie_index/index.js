var app = getApp();
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*三个列表*/
    inTheaters: {},
    comingSoon: {},
    top250: {},
    movieListPanel: true,
    /*搜索*/
    searchResult: {},
    value: '',
    canelBtn: true,
    error: false,
    /*加载更多*/
    startCount: 0,
    isEmpty: true,
    again: false,
    over: false,
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (event) {
    //正在热映
    var inTheatersUrl = app.globalData.doubanBase + '/v2/movie/in_theaters' + '?start=0&count=3';
    //即将上映
    var comingSoonUrl = app.globalData.doubanBase + '/v2/movie/coming_soon' + '?start=0&count=3';
    //top250
    var top250Url = app.globalData.doubanBase + '/v2/movie/top250' + '?start=0&count=3';

    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', 'Top250');
  },

  /**
  * url请求
  */
  getMovieListData: function (url, key, classify) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        if (res.data.subjects.length == 0) {
          wx.hideNavigationBarLoading();  //停止加载
          that.setData({
            error: true,
            pageShow: true
          })
        } else {
          that.processDoubanData(res.data, key, classify)
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  /**
   * url数据处理
   */
  processDoubanData: function (moviesDouban, key, classify) {
    var movies = [];
    for (var ide in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[ide];
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

    //追加搜索数据
    if (!this.data.movieListPanel) {
      /*搜索面板*/
      var totalMovies = {};
      if (!this.data.isEmpty) {
        totalMovies = this.data.searchResult.movies.concat(movies);
      } else {
        movies = movies;
        this.data.isEmpty = false;
      }

      //是否有新数据
      if (moviesDouban.subjects.length > 0) {
        this.data.again = true;   //数据加载完毕
      } else {
        this.setData({
          loading: false,
          over: true  //显示无更多数据
        })
      }
    } else {
      /*三个列表*/
      movies = movies;
    }

    var readyData = {};
    if (key == null) {
      readyData['searchResult'] = {
        movies: totalMovies
      }
    } else {
      readyData[key] = {
        movies: movies,
        classify: classify
      };
    }

    this.setData(readyData);
    this.setData({
      loading: false
    })

    wx.stopPullDownRefresh();       //停止刷新
    wx.hideNavigationBarLoading();  //停止加载
  },

  /**
   * 更多
   */
  moreTap: function (event) {
    var category = event.currentTarget.dataset.classify;
    wx.navigateTo({
      url: '../movie_more/movie_more?category=' + category
    })
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    if (this.data.movieListPanel) {
      this.onLoad();
      wx.showNavigationBarLoading();  //开始加载
    } else {
      this.setData({
        isEmpty: true,
        over: false,
        startCount: 0
      })
      this.onSearchBtn()
    }
  },

  /**
   * 输入关键词
   */
  onFocus: function (e) {
    this.setData({
      canelBtn: false,
      movieListPanel: false,
      error: false,
      over: false,
      startCount: 0,
      isEmpty: true
    })
  },

  /**
   * 获取关键词
   */
  onBlur: function (e) {
    var value = e.detail.value;
    this.setData({
      value: value
    });
  },

  /**
   * 搜索
   */
  onConfirm: function (e) {
    var value = e.detail.value;
    this.setData({
      value: value
    });
    this.onSearchBtn()
  },
  /**
   * 搜索
   */
  onSearchBtn: function () {
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + this.data.value + '&start=' + this.data.startCount;
    wx.showNavigationBarLoading();  //开始加载
    this.setData({
      searchResult: {},
      isEmpty: true,
      again: false,
      over: false,
    })
    this.getMovieListData(searchUrl, 'searchResult', '');
  },

  /**
   * 取消搜索
   */
  onCanelBtn: function (e) {
    this.setData({
      movieListPanel: true,
      canelBtn: true,
      value: '',
      startCount: 0,
      searchResult: {}
    })
  },

  /**
   * 上拉触底——加载更多
   */
  onReachBottom: function () {
    //上一次数据加载完毕后，才可以重新加载更多
    if (this.data.again && !this.data.movieListPanel) {
      this.data.startCount += 20;
      var nextUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + this.data.value + '&start=' + this.data.startCount;
      util.movieHttp(nextUrl, this.processDoubanData);
      //开始加载，显示正在加载
      this.setData({
        again: false,
        loading: true
      })
      wx.showNavigationBarLoading();  //开始加载
    }
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