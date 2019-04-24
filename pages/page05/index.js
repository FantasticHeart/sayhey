//获取应用实例
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()

let _this;
Page({
  // 页面的初始数据
  data: {
    commentPlay:[],
    type:'time',
    istime:true,
    isplay:false,
    voice:0,
    voiceOk:false,  //录音完成
    onePlay:false,
    Onefinger:[],
    userData:{},
    commentData:[],
    gIp:'',
    isred:false,
    iscollected:false,
    audioPath:'',
    audio:'',
    commentId:0,
    audioLen:0,
    imgwidth: 0,
    imgheight: 0
  },
  switchTo:function(){
    _this.setData({
      istime:!_this.data.istime,
    })
    _this.detailRequest();
  },
  cancel:function(){
    wx.showModal({
      title: '提示',
      content: '是否删除？',
      success:function(res){
        if(res.confirm){
          innerAudioContext.stop();
          _this.setData({
            voice: 0,
            voiceOk: false
          })
        }
      }
    })
    
  },
  detailRequest:function(){
    if(_this.data.istime){
      _this.data.type='time';
    }
    else{
      _this.data.type='popular';
    }
    _this.data.commentData=[]
    wx.request({
      url: app.globalData.globalIp + '/getCommentsByPostId',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        postId: app.globalData.ofcommentId,
        type: _this.data.type
      },
      success: function (res) {
        console.log(res.data);
        var tem = res.data.comments;
        _this.data.Onefinger.length = tem.length;
        _this.data.Onefinger.fill(false);
        _this.data.commentPlay.length = tem.length;
        _this.data.commentPlay.fill(false);
        for (var i = 0; i < tem.length; i++) {
          for (var j = 0; j < tem[i].upvotes.length; j++) {
            if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
              _this.data.Onefinger[i] = true;
            }
          }
          var c = { 'avatar': tem[i].user.avatar, 'name': tem[i].user.userName, 'id': i, 'upvoteLen': tem[i].upvotes.length, 'time': tem[i].ctime, 'audioLength': tem[i].audioLength, 'commentId': tem[i].commentId, 'audioPath': tem[i].audio, 'userId': tem[i].user.userId };
          _this.data.commentData.push(c);
        }
        _this.setData({
          commentData: _this.data.commentData,
          Onefinger: _this.data.Onefinger
        })
      }
    })
  },
  imageLoad: function (e) {
    
    var width = e.detail.width;
    var height = e.detail.height;
    var ratio = height / width;
    var viewHeight = 500;
    var viewWidth = 500 / ratio;
    _this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  },
  play:function(e){
    var idx=e.currentTarget.dataset.id;
  //  const innerAudioContext = wx.createInnerAudioContext()
    _this.data.commentPlay[idx] = !_this.data.commentPlay[idx];
  //  innerAudioContext.src = _this.data.gIp+_this.data.commentData[idx].audioPath;
    _this.data.commentPlay.forEach((item, index) => {
      if(index!=idx){
        _this.data.commentPlay[index]=false
      }
    })
    _this.setData({
      onePlay:false,
      commentPlay: _this.data.commentPlay
    })
    if (_this.data.commentPlay[idx]){
      innerAudioContext.src = _this.data.gIp + _this.data.commentData[idx].audioPath; // 这里可以是录音的临时路径
      console.log(innerAudioContext.src)
      innerAudioContext.play()
      innerAudioContext.onEnded((res) => {
        console.log('播放结束!');
        _this.data.commentPlay[idx] = false
        _this.setData({
          commentPlay: _this.data.commentPlay
        })
      })
    }
    else{
      innerAudioContext.pause()
    }
  },
  collect:function(){
    _this.setData({
      iscollected:!_this.data.iscollected
    })
    if (_this.data.iscollected){
      wx.request({
        url: app.globalData.globalIp + '/addStore',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          "Authorization": app.globalData.token
        },
        data: {
          userId: app.globalData.userId,
          postId: _this.data.userData.postId
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
    else{
      wx.request({
        url: app.globalData.globalIp + '/deleteStore',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          "Authorization": app.globalData.token
        },
        data: {
          userId: app.globalData.userId,
          postId: _this.data.userData.postId
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
  },
  clickOwn:function(){
    app.globalData.ofuserId=_this.data.userData.user.userId;
    console.log(app.globalData.ofuserId)
    wx.navigateTo({
      url: '../page07/index',
    })
  },
  cliclDisc:function(e){
    var idx=e.currentTarget.dataset.id;
    _this.data.commentData.forEach((item,index)=>{
      if(index==idx){
        app.globalData.ofuserId = _this.data.commentData[idx].userId;
        console.log(app.globalData.ofuserId)
        wx.navigateTo({
          url: '../page07/index',
        })
      }
    })
    
  },
  btnFinger:(e)=>{
    var idx=e.currentTarget.dataset.id;
    var temp2= _this.data.commentData;
    var temp1= _this.data.Onefinger;
    temp1.forEach((item, index) => {
      if (index == idx) {
        temp1[idx] = !temp1[idx];
        if (temp1[index]) {
          wx.request({
            url: app.globalData.globalIp + '/addUpvote',
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              "Authorization": app.globalData.token
            },
            data: {
              userId: app.globalData.userId,
              commentId: temp2[idx].commentId
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
                       temp2[idx].upvoteLen += 1
              _this.setData({
                commentData: temp2,
                Onefinger:temp1
              })
            }
          })
        }
        else {
          wx.request({
            url: app.globalData.globalIp + '/deleteUpvote',
            method: 'post',
            header: {
              'content-type': 'application/x-www-form-urlencoded',
              "Authorization": app.globalData.token
            },
            data: {
              userId: app.globalData.userId,
              commentId: temp2[idx].commentId
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
                  temp2[idx].upvoteLen -= 1
              _this.setData({
                commentData: temp2,
                Onefinger: temp1
              })
            }
          })
        }
      }
    })
    
  },
  btnVoice:(e)=>{
    const recorderManager = wx.getRecorderManager();
    recorderManager.onError(function () {
      // 录音失败的回调处理\
      console.log('录音失败！')
    });
    recorderManager.onStop(function (res) {
      _this.setData({
        audioPath: res.tempFilePath,
        voiceOk: true
      })
      wx.showToast({
        title: '录音结束',
        duration: 500,
      })
      const innerAudioContext = wx.createInnerAudioContext();
      innerAudioContext.src = res.tempFilePath;
      innerAudioContext.autoplay = false;
      innerAudioContext.onPlay((res) => {
        console.log('开始播放');
        innerAudioContext.stop();
      })
      innerAudioContext.onStop((res) => {
        console.log('停止播放');
        innerAudioContext.destroy();
      })
      innerAudioContext.onCanplay(() => {
        innerAudioContext.duration //类似初始化-必须触发-不触发此函数延时也获取不到
        setTimeout(function () {
          //在这里就可以获取到大家梦寐以求的时长了
          console.log(innerAudioContext.duration.toFixed(0));//延时获取长度 单位：秒
          _this.setData({
            audioLen: innerAudioContext.duration.toFixed(0)
          })
        }, 100)  //这里设置延时1秒获取
      })
      innerAudioContext.play();
    });
    let num = _this.data.voice + 1
    num = num > 2 ? 0 : num
    if (num==0&&_this.data.voiceOk) {
      num=2;
    }
    if(num==1){
      wx.showToast({
        title: "语音不超60秒",
        icon: "loading",//仅支持success或者loading
        duration: 1000
      });
      recorderManager.start({
        format: 'mp3' // 如果录制acc类型音频则改成aac
      });
    }
    else if(num==2&&!_this.data.voiceOk){
        recorderManager.stop()
    }
    else if (num == 2 && _this.data.voiceOk){
   
      _this.setData({
        onePlay: false
      })
      innerAudioContext.src=_this.data.audioPath
      console.log(innerAudioContext.src)
      innerAudioContext.play()
    }
    else{
      
    }
    _this.setData({
      voice:num
    })
  },
  submit:function(){
    wx.uploadFile({
      url: app.globalData.globalIp + '/upload',
      filePath: _this.data.audioPath,
      name: 'file',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        "Authorization": app.globalData.token
      },
      formData: {
        type: 'audio'
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
        _this.setData({
          audio: JSON.parse(res.data).url,
          voiceOk: false,
          voice:0
        })
        wx.request({
          url: app.globalData.globalIp + '/addComment',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            "Authorization": app.globalData.token
          },
          data: {
            ofUserId: app.globalData.userId,
            ofPostId: _this.data.userData.postId,
            commentContent: '',
            audio: _this.data.audio,
            audioLength: _this.data.audioLen
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
            _this.detailRequest();
            wx.showToast({
              title: '评论成功',
              icon: 'success',
              duration: 1000
            })
            _this.setData({
              commentId: 0,
              voiceOk: false
            })
          }
        })
      }
    })
    
  },
  btnOnePlay:(e)=>{
    _this.setData({ onePlay: !_this.data.onePlay })
    
    
    if(_this.data.onePlay){
      innerAudioContext.play()
    }
    else{
      innerAudioContext.pause()
    }
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    _this=this;
    wx.setNavigationBarTitle({title: '动态详情'});
    _this.setData({
      gIp:app.globalData.globalIp
    })
    innerAudioContext.autoplay = false;
    innerAudioContext.onEnded((res) => {
      console.log('播放结束!');
      wx.showToast({
        title: '播放结束',
        icon: "success",
        duration: 1000
      })
      if(_this.data.onePlay){
        _this.setData({
          onePlay: !_this.data.onePlay,
        })
      }
      
      //    innerAudioContext.destroy()
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      //    innerAudioContext.destroy()
    })
    innerAudioContext.onPlay((res) => {
      console.log('播放开始!');
    })
  },
  clickred:function(e){
    _this.data.isred = !_this.data.isred;
    if (_this.data.isred){
      _this.data.userData.upvotes.length+=1;
      wx.request({
        url: app.globalData.globalIp + '/addUpvote',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          "Authorization": app.globalData.token
        },
        data: {
          userId: app.globalData.userId,
          postId: _this.data.userData.postId
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
    else{
      _this.data.userData.upvotes.length -= 1;
      wx.request({
        url: app.globalData.globalIp + '/deleteUpvote',
        method: 'post',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          "Authorization": app.globalData.token
        },
        data: {
          userId: app.globalData.userId,
          postId: _this.data.userData.postId
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
    _this.setData({
      isred:_this.data.isred,
      userData:_this.data.userData
    })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {},
  // 生命周期函数--监听页面显示
  onShow: function () {
    wx.request({
      url: app.globalData.globalIp + '/getPostDetail',
      method: 'post',
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      data: {
        id: app.globalData.ofcommentId
      },
      success: function (res) {
        console.log(res.data);
        _this.data.commentData = [];
        _this.setData({
          userData: res.data.post
        })
        _this.data.userData.upvotes.forEach((item, index) => {
          if(item.user.userId==app.globalData.userId){
            _this.setData({
              isred:true
            })
          }
        })
        _this.data.userData.stores.forEach((item, index) => {
          if (item.userId == app.globalData.userId) {
            _this.setData({
              iscollected: true
            })
          }
        })
      }
    })
    _this.detailRequest();
  },
  forward:function(){
    wx.request({
      url: app.globalData.globalIp + '/addPost',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "Authorization": app.globalData.token
      },
      data: {
        userId: app.globalData.userId,
        postTitle: _this.data.userData.postTitle,
        postContent: _this.data.userData.postContent,
        postAudio: _this.data.userData.postAudio,
        postImg: _this.data.userData.postImg,
        audioLength: _this.data.userData.audioLength
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
        console.log(res.data)
        wx.showToast({
          title: '转发成功',
          icon: 'success',
          duration: 1000
        })
        
      }
    })
  },
  // 生命周期函数--监听页面隐藏
  onHide: function () {},
  // 生命周期函数--监听页面卸载
  onUnload: function () {
    innerAudioContext.stop();
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},
  // 用户点击右上角分享
  onShareAppMessage: function () {}
})