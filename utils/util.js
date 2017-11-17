/**
  * star数量
  */
function starArray(stars) {
  var num = stars.toString().substring(0, 1);
  var star_array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      star_array.push(1)
    } else {
      star_array.push(0)
    }
  }
  return star_array
}

/**
  * movieHttp请求
  */
function movieHttp(url, callBack) {
  wx.request({
    url: url,
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function (res) {
      callBack(res.data)
    },
    fail: function (err) {
      console.log(err)
    }
  })
}

/**
  * 导演们
  */
function movieDirectors(dir_s) {
  if (dir_s.length == 0) {
    return '无'
  } else {
    var dirs_join = '';
    for (var idx in dir_s) {
      dirs_join = dirs_join + dir_s[idx].name + ' / '
    }
    return dirs_join.substring(0, dirs_join.length - 2)
  }
}

/**
  * 导演们信息
  */
function movieDirectorsInfo(dir_sInfo) {
  var dir_sArray = [];
  for (var idx in dir_sInfo) {
    var dir_s = {
      img: dir_sInfo[idx].avatars ? dir_sInfo[idx].avatars.large : '',
      name: dir_sInfo[idx].name,
      id: dir_sInfo[idx].id
    }
    dir_sArray.push(dir_s)
  }
  return dir_sArray
}


/**
  * 影人们
  */
function movieCasts(casts) {
  if (casts.length == 0) {
    return '无'
  } else {
    var castsjoin = '';
    for (var idx in casts) {
      castsjoin = castsjoin + casts[idx].name + ' / '
    }
    return castsjoin.substring(0, castsjoin.length - 2)
  }
}

/**
  * 影人们信息
  */
function movieCastsInfo(castsInfo) {
  var castsArray = [];
  for (var idx in castsInfo) {
    var cast = {
      img: castsInfo[idx].avatars ? castsInfo[idx].avatars.large : '',
      name: castsInfo[idx].name,
      id: castsInfo[idx].id
    }
    castsArray.push(cast)
  }
  return castsArray
}

/**
  * 影人作品
  */
function castsWorks(works) {
  var worksArray = [];
  for (var idx in works) {
    var title = works[idx].subject.title;
    if (works[idx].subject.title.length > 7) {
      title = works[idx].subject.title.substring(0, 7) + '...'
    }
    var work = {
      coverageUrl: works[idx].subject.images ? works[idx].subject.images.large : '',
      title: title,
      stars: this.starArray(works[idx].subject.rating.average),
      average: works[idx].subject.rating.average.toFixed(1),
      movieId: works[idx].subject.id
    }
    worksArray.push(work)
  }
  return worksArray
}

module.exports = {
  starArray: starArray,
  movieHttp: movieHttp,
  movieDirectors: movieDirectors,
  movieDirectorsInfo: movieDirectorsInfo,
  movieCasts: movieCasts,
  movieCastsInfo: movieCastsInfo,
  castsWorks: castsWorks
}