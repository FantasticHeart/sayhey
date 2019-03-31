//获取应用实例
const app = getApp()
let _this;
Page({
  // 页面的初始数据
  data: {
    voice:false,
    voiceOk:false,  //录音完成
    onePlay:false,
    Onefinger:[],
    userData:{},
    commentData:[],
    gIp:'',
    isred:false,
    iscollected:false,
    audioPath:'',
    commentId:0,
    audioLen:0,
    audioPlay:[]
  },
  play:function(e){
    var idx=e.currentTarget.dataset.id;
    var temp=_this.data.audioPlay;
    temp.forEach((item, index) => {
      if(idx==index){
        temp[idx]=!temp[idx];
        if(temp[idx]){
          _this.innerAudioContext = wx.createInnerAudioContext();
          _this.innerAudioContext.src = _this.data.gIp + _this.data.commentData[idx].audioPath; // 这里可以是录音的临时路径
          _this.innerAudioContext.play()
          _this.innerAudioContext.onEnded((res) => {
            console.log('播放结束!');
            temp[idx] = !temp[idx]
            _this.setData({ audioPlay: temp })
          })
        }
      }
    })
    _this.setData({ audioPlay: temp })
  },
  collect:function(){
    _this.setData({
      iscollected:!_this.data.iscollected
    })
    if (_this.data.iscollected){
      wx.request({
        url: app.globalData.globalIp + '//addStore',
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
    console.log(idx)
    var temp2= _this.data.commentData;
    var temp1= _this.data.Onefinger;
    console.log(temp1)
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
              console.log(res.data);
              //         temp1[idx].upvoteLen += 1
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
              console.log(res.data);
              //    temp1[idx].upvoteLen -= 1
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
    _this.setData({voice:!_this.data.voice})
    if(_this.data.voice){
      wx.showToast({
        title: "语音不得超过40秒",
        icon: "loading",//仅支持success或者loading
        duration: 1000
      });
      _this.recorderManager = wx.getRecorderManager();
      _this.recorderManager.start({
        format: 'mp3' // 如果录制acc类型音频则改成aac
      });
      _this.recorderManager.onError(function () {
        // 录音失败的回调处理

      });
      _this.recorderManager.onStop(function (res) {
        // 停止录音之后，把录取到的音频放在res.tempFilePath
        _this.innerAudioContext = wx.createInnerAudioContext()  //初始化createInnerAudioContext接口
        //设置播放地址
        _this.innerAudioContext.src = res.tempFilePath;

        //音频进入可以播放状态，但不保证后面可以流畅播放
        _this.innerAudioContext.onCanplay(() => {
          _this.innerAudioContext.duration //类似初始化-必须触发-不触发此函数延时也获取不到
          setTimeout(function () {
            //在这里就可以获取到大家梦寐以求的时长了
            console.log(_this.innerAudioContext.duration.toFixed(0));//延时获取长度 单位：秒
            _this.setData({
              audioLen: _this.innerAudioContext.duration.toFixed(0)
            })
          }, 100)  //这里设置延时1秒获取
        })
        wx.uploadFile({
          url: app.globalData.globalIp + '/upload',
          filePath: res.tempFilePath,
          name: 'file',
          method:'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            "Authorization": app.globalData.token
          },
          formData: {
            type: 'audio'
          },
          success: function (res) {
            _this.setData({
              audioPath: JSON.parse(res.data).url,
              voiceOk: true
            })

          }
        })
      });
    }
    else{
        _this.recorderManager.stop()
    }
  },
  submit:function(){
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
        commentContent:'',
        audio:_this.data.audioPath,
        audioLength:_this.data.audioLen
      },
      success: function (res) {
        console.log(res.data);
        wx.request({
          url: app.globalData.globalIp + '/getPostDetail',
          method: 'post',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            id: app.globalData.ofcommentId
          },
          success: function (res) {
            console.log(res.data);
            _this.data.commentData=[];
            _this.setData({
              userData:res.data.post
            })
            var tem=res.data.post.comments;
            _this.data.Onefinger.length =tem.length;
            _this.data.Onefinger.fill(false);
            _this.data.audioPlay.length = tem.length;
            _this.data.audioPlay.fill(false);
            for (var i = 0; i < tem.length; i++) {
              for (var j = 0; j < tem[i].upvotes.length; j++) {
                if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                  _this.data.Onefinger[i] = true;
                }
              }
              var c = { 'avatar': tem[i].user.avatar, 'name': tem[i].user.userName, 'id': i, 'upvoteLen': tem[i].upvotes.length, 'time': tem[i].time, 'audioLength': tem[i].audioLength, 'commentId': tem[i].commentId, 'audioPath': tem[i].audio,'userId':tem[i].user.userId};
              _this.data.commentData.push(c);
            }
            _this.setData({
              commentData: _this.data.commentData,
              Onefinger: _this.data.Onefinger
            })
            
          }
        })
        wx.showToast({
          title: '评论成功',
          icon: 'success',
          duration: 1000
        })
        _this.setData({
          commentId: 0,
          voiceOk:false
        })
      }
    })
  },
  btnOnePlay:(e)=>{
    _this.setData({onePlay:!_this.data.onePlay})
    if(_this.data.onePlay){
      _this.innerAudioContext = wx.createInnerAudioContext();
      _this.innerAudioContext.src = _this.data.gIp + _this.data.userData.postAudio; // 这里可以是录音的临时路径
      _this.innerAudioContext.play()
      _this.innerAudioContext.onEnded((res) => {
        console.log('播放结束!');
        _this.setData({ onePlay: !_this.data.onePlay })
      })
    }
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    _this=this;
    wx.setNavigationBarTitle({title: '动态详情'});
    _this.setData({
      gIp:app.globalData.globalIp
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
    console.log(app.globalData.ofcommentId);
    
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
        for (var i = 0; i < res.data.post.upvotes.length;i++){
          if (res.data.post.upvotes[i].user.userId==app.globalData.userId){
            _this.data.isred=true;
          }
        }
        for (var i = 0; i < res.data.post.stores.length; i++) {
          if (res.data.post.stores[i].userId == app.globalData.userId) {
            _this.data.iscollected = true;
          }
        }
        var tem = res.data.post.comments;
        _this.data.Onefinger.length = tem.length;
        _this.data.Onefinger.fill(false);
        _this.data.audioPlay.length = tem.length;
        _this.data.audioPlay.fill(false);
        console.log(_this.data.Onefinger);
        for (var i = 0; i < tem.length;i++){
          for(var j=0;j<tem[i].upvotes.length;j++){
            if (tem[i].upvotes[j].user.userId==app.globalData.userId){
              _this.data.Onefinger[i]=true;
            }
          }
          var c = { 'avatar': tem[i].user.avatar, 'name': tem[i].user.userName, 'id': i, 'upvoteLen': tem[i].upvotes.length, 'time': tem[i].ctime, 'audioLength': tem[i].audioLength, 'commentId': tem[i].commentId, 'audioPath': tem[i].audio, 'userId': tem[i].user.userId};
          _this.data.commentData.push(c);
          
        }
        _this.setData({
          commentId:0,
          commentData: _this.data.commentData,
          userData:res.data.post,
          isred:_this.data.isred,
          iscollected: _this.data.iscollected,
          Onefinger: _this.data.Onefinger
        })

      }
    })
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
  onUnload: function () {},
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},
  // 用户点击右上角分享
  onShareAppMessage: function () {}
})