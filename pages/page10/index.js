//获取应用实例
const app = getApp()
let _this;
Page({
  // 页面的初始数据
  data: {
    iscollected:[],
    onePlay: [],
    isred: [],
    postData: [],
    gIp: '',
    imgwidth: [],
    imgheight: []
  },
  collect: function (e) {
    var idx = e.currentTarget.dataset.id;
    _this.data.iscollected[idx] = !_this.data.iscollected[idx];
    _this.setData({
      iscollected: _this.data.iscollected
    })
    if (_this.data.iscollected[idx]) {
      wx.request({
        url: app.globalData.globalIp + '/addStore',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          "Authorization": app.globalData.token
        },
        data: {
          userId: app.globalData.userId,
          postId: _this.data.postData[idx].postId
        },
        success: function (res) {
          if (res.data.status == 'TOKEN_EXPIRED') {
            wx.setStorageSync('token', '')
            wx.reLaunch({
              url: '/pages/index/index',
            })
            wx.showToast({
              title: '授权过期',
              icon: 'loading',
              duration: 2000
            })
          }
          _this.onShow();
          console.log(res.data);
        }
      })
    }
    else {
      wx.request({
        url: app.globalData.globalIp + '/deleteStore',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          "Authorization": app.globalData.token
        },
        data: {
          userId: app.globalData.userId,
          postId: _this.data.postData[idx].postId
        },
        success: function (res) {
          if (res.data.status == 'TOKEN_EXPIRED') {
            wx.setStorageSync('token', '')
            wx.reLaunch({
              url: '/pages/index/index',
            })
            wx.showToast({
              title: '授权过期',
              icon: 'loading',
              duration: 2000
            })
          }
          _this.onShow();
          console.log(res.data);
        }
      })
    }
    
  },
  imageLoad: function (e) {
    var idx = e.currentTarget.dataset.id;

    var width = e.detail.width;
    var height = e.detail.height;
    var ratio = height / width;
    var viewHeight = 500;
    var viewWidth = 500 / ratio;
    _this.data.imgwidth[idx] = viewWidth;
    _this.data.imgheight[idx] = viewHeight;
    _this.setData({
      imgwidth: _this.data.imgwidth,
      imgheight: _this.data.imgheight
    })
  },
  delete: function (e) {
    var idx = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.globalIp + '/deleteStore',
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              "Authorization": app.globalData.token
            },
            data: {
              userId: app.globalData.userId,
              postId: _this.data.postData[idx].postId
            },
            success: function (res) {
              console.log(res.data);
              _this.onShow();
            }
          })
        }
      }
    })

  },
  clickOwn: function (e) {
    var idx = e.currentTarget.dataset.id;
    app.globalData.ofuserId = _this.data.postData[idx].userId;
    wx.navigateTo({
      url: '/pages/page07/index',
    })


  },
  clickDetail: function (e) {
    var idx = e.currentTarget.dataset.id;
    app.globalData.ofcommentId = _this.data.postData[idx].postId;

    wx.navigateTo({
      url: '/pages/page05/index',
    })

  },
  clickred: (e) => {
    var idx = e.currentTarget.dataset.id;
    let temp1 = _this.data.isred;
    let temp2 = _this.data.postData;
    temp1.forEach((item, index) => {
      if (index == idx) {
        temp1[index] = !temp1[index];
        if (temp1[index]) {
          temp2[idx].upvoteNum++;
          wx.request({
            url: app.globalData.globalIp + '/addUpvote',
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              "Authorization": app.globalData.token
            },
            data: {
              userId: app.globalData.userId,
              postId: _this.data.postData[idx].postId
            },
            success: function (res) {
              if (res.data.status == 'TOKEN_EXPIRED') {
                wx.setStorageSync('token', '')
                wx.reLaunch({
                  url: '/pages/index/index',
                })
                wx.showToast({
                  title: '授权过期',
                  icon: 'loading',
                  duration: 2000
                })
              }
              console.log(res.data);
            }
          })
        }
        else {
          temp2[idx].upvoteNum--;
          wx.request({
            url: app.globalData.globalIp + '/deleteUpvote',
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              "Authorization": app.globalData.token
            },
            data: {
              userId: app.globalData.userId,
              postId: _this.data.postData[idx].postId
            },
            success: function (res) {
              if (res.data.status == 'TOKEN_EXPIRED') {
                wx.setStorageSync('token', '')
                wx.reLaunch({
                  url: '/pages/index/index',
                })
                wx.showToast({
                  title: '授权过期',
                  icon: 'loading',
                  duration: 2000
                })
              }
              console.log(res.data);
            }
          })
        }
        _this.setData({ isred: temp1 });
        _this.setData({ postData: temp2 });

      }
    })

  },
  btnOnePlay: (e) => {
    var idx = e.currentTarget.dataset.id;
    var temPlay = _this.data.onePlay;
    temPlay.forEach((item, index) => {
      if (index == idx) {
        temPlay[index] = !temPlay[index]
        if (temPlay[index] == true) {
          _this.innerAudioContext = wx.createInnerAudioContext();
          _this.innerAudioContext.src = _this.data.gIp + _this.data.postData[index].audioPath; // 这里可以是录音的临时路径
          _this.innerAudioContext.play()
          _this.innerAudioContext.onEnded((res) => {
            console.log('播放结束!');
            temPlay[index] = !temPlay[index]
            _this.setData({ onePlay: temPlay })
          })
        }
      } else {

      }
    })
    _this.setData({ onePlay: temPlay })
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    _this = this;
    wx.setNavigationBarTitle({ title: '我的收藏' });
    this.setData({
      gIp: app.globalData.globalIp
    })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () { },
  // 生命周期函数--监听页面显示
  onShow: function () {
    _this.data.postData = [];
    wx.request({
      url: app.globalData.globalIp + '/getStorePosts',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId: app.globalData.userId
      },
      success: function (res) {
        console.log(res.data);
        var tem = res.data.posts;
        _this.data.onePlay.length = tem.length
        _this.data.onePlay.fill(false)
        _this.data.isred.length = tem.length
        _this.data.isred.fill(false)
        _this.data.iscollected.length = tem.length
        _this.data.iscollected.fill(false)
        _this.data.imgwidth.length = tem.length
        _this.data.imgwidth.fill(0)
        _this.data.imgheight.length = tem.length
        _this.data.imgheight.fill(0)

        for (var i = 0; i < tem.length; i++) {
          for (var j = 0; j < tem[i].upvotes.length; j++) {
            if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
              _this.data.isred[i] = true;
            }
          }
          for (var j = 0; j < tem[i].stores.length; j++) {
            if (tem[i].stores[j].userId == app.globalData.userId) {
              _this.data.iscollected[i] = true;
            }
          }
          var p = { 'userId':tem[i].user.userId, 'avatar': tem[i].user.avatar, 'dataId': i, 'name': tem[i].user.userName, 'title': tem[i].postTitle, 'time': tem[i].ctime, 'content': tem[i].postContent, 'imgPath': tem[i].postImg, 'audioTime': tem[i].audioLength, 'comment': tem[i].commentNum, 'upvoteNum': tem[i].upvoteNum, 'postId': tem[i].postId, 'audioPath': tem[i].postAudio };
          _this.data.postData.push(p);
        }
        _this.setData({
          postData: _this.data.postData,
          onePlay: _this.data.onePlay,
          isred: _this.data.isred,
          iscollected: _this.data.iscollected
        })


      }
    })
  },
  // 生命周期函数--监听页面隐藏
  onHide: function () { },
  // 生命周期函数--监听页面卸载
  onUnload: function () { },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () { },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () { },
  // 用户点击右上角分享
  onShareAppMessage: function () { }
})