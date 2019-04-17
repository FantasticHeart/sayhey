//获取应用实例
const app = getApp()
let _this;
const innerAudioContext = wx.createInnerAudioContext();       //播放器
Page({
  // 页面的初始数据
  data: {
    isred:[],         //发现栏动态是否被点赞
    temisred: [],      //关注栏动态是否被点赞
    onePlay:[],       //发现栏动态是否在播放音频
    temonePlay: [],  //关注栏动态是否在播放音频
  //  index:0,       
    userData:[],      //发现栏数据
    gIp:'',   //公共http头
    limit:10,      //发现栏数据请求参数
    focusData: [],     //关注栏数据
    topicData: [],     //话题栏数据
    imgwidth: [],    //发现图片宽度
    imgheight: [],     //发现图片高度
    temimgwidth: [],    //关注图片宽度
    temimgheight: [],     //关注图片高度
    currentTab:0,      //顶部华东切换参数 0（发现） 1（关注） 2（话题）
    scrollLeft: 0,  //滑动切换参数
    winHeight: "",//窗口高度
    isplay:false    //是否在播放
  },
  switchTab: function (e) {       //滑动切换事件
    _this.setData({
      currentTab: e.detail.current        //获取当前current
    });
    if (_this.data.currentTab == 0) {  //发现栏
        wx.request({              //请求数据  后面以此类推
          url: app.globalData.globalIp + '/getLatestPosts',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'post',
          data: {
            limit: _this.data.limit,             //数据限制数量
            offset: 0      //数据从哪条开始显示 因为是模仿朋友圈 所以一直都是从第一条数据显示 只需要更新limit即可
          },
          success: function (res) {
            _this.data.temonePlay.forEach((item, index) => {  //停止关注栏播放
              _this.data.temonePlay[index] = false
            })
            _this.setData({
              temonePlay: _this.data.onePlay
            })
            _this.data.userData = []       //数据处理 后面全是
            console.log(res.data)
            _this.data.userData = [];
            let temInfo = _this.data.userData;
            var tem = res.data.posts;
            innerAudioContext.stop()
            if (_this.data.currentTab == 0) {
              _this.data.onePlay.length = tem.length
              _this.data.onePlay.fill(false)
              _this.setData({
                onePlay: _this.data.onePlay
              })
            }
            if (_this.data.currentTab == 1) {
              _this.data.temonePlay.length = tem.length
              _this.data.temonePlay.fill(false)
              _this.setData({
                temonePlay: _this.data.temonePlay
              })
            }
            _this.data.imgwidth.length = tem.length
            //     _this.data.imgwidth.fill(0)
            _this.data.imgheight.length = tem.length
            //     _this.data.imgheight.fill(0)
            _this.data.temimgwidth.length = tem.length
            //     _this.data.imgwidth.fill(0)
            _this.data.temimgheight.length = tem.length
            //     _this.data.imgheight.fill(0)
            if (_this.data.currentTab == 0) {
              _this.data.isred.length = tem.length
              _this.data.isred.fill(false)
            }
            if (_this.data.currentTab == 1) {
              _this.data.temisred.length = tem.length
              _this.data.temisred.fill(false)
            }
            for (var i = 0; i < tem.length; i++) {
              for (var j = 0; j < tem[i].upvotes.length; j++) {
                if (_this.data.currentTab == 0) {
                  if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                    _this.data.isred[i] = true;
                  }
                }
                if (_this.data.currentTab == 1) {
                  if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                    _this.data.temisred[i] = true;
                  }
                }
              }
              var u = { 'dataId': i, 'name': tem[i].user.userName, 'time': tem[i].ctime, 'content': tem[i].postContent, 'audioTime': tem[i].audioLength, 'imgPath': tem[i].postImg, 'audioPath': tem[i].postAudio, 'postId': tem[i].postId, 'comment': tem[i].commentNum, 'upvoteNum': tem[i].upvoteNum, 'avatar': tem[i].user.avatar, 'title': tem[i].postTitle, 'userId': tem[i].user.userId };
              temInfo.push(u);
            }
            _this.setData({ userData: temInfo })
            if (_this.data.currentTab == 0) {
              _this.setData({ isred: _this.data.isred })
            }
            if (_this.data.currentTab == 1) {
              _this.setData({ temisred: _this.data.temisred })
            }
          }
        })
    }
    else if (_this.data.currentTab == 1) {
      wx.request({
        url: app.globalData.globalIp + '/getFocusPosts',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        data: {
          userId: app.globalData.userId
        },
        success: function (res) {
          console.log(res.data)
          _this.data.focusData = [];
          if (_this.data.currentTab == 0) {
            _this.data.isred = [];
          }
          if (_this.data.currentTab == 1) {
            _this.data.temisred = [];
          }
          ;
          let temInfo = _this.data.focusData;
          var tem = res.data.posts;
          innerAudioContext.stop()
          if (_this.data.currentTab == 0) {
            _this.data.onePlay.length = tem.length
            _this.data.onePlay.fill(false)
            _this.setData({
              onePlay: _this.data.onePlay
            })
          }
          if (_this.data.currentTab == 1) {
            _this.data.temonePlay.length = tem.length
            _this.data.temonePlay.fill(false)
            _this.setData({
              temonePlay: _this.data.temonePlay
            })
          }
          _this.data.imgwidth.length = tem.length
    //      _this.data.imgwidth.fill(0)
          _this.data.imgheight.length = tem.length
     //     _this.data.imgheight.fill(0)
          _this.data.temimgwidth.length = tem.length
          //     _this.data.imgwidth.fill(0)
          _this.data.temimgheight.length = tem.length
            //     _this.data.imgheight.fill(0)
          if(_this.data.currentTab==0){
          _this.data.isred.length = tem.length
          _this.data.isred.fill(false)
          }
          if (_this.data.currentTab == 1) {
            _this.data.temisred.length = tem.length
            _this.data.temisred.fill(false)
          }
          for (var i = 0; i < tem.length; i++) {
            for (var j = 0; j < tem[i].upvotes.length; j++) {
              if (_this.data.currentTab == 0) {
                if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                  _this.data.isred[i] = true;
                }
              }
              if (_this.data.currentTab == 1) {
                if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                  _this.data.temisred[i] = true;
                }
              }
            }
            var u = {
              'dataId': i, 'name': tem[i].user.userName, 'time': tem[i].ctime, 'content': tem[i].postContent, 'audioTime': tem[i].audioLength, 'imgPath': tem[i].postImg, 'audioPath': tem[i].postAudio, 'postId': tem[i].postId, 'comment': tem[i].commentNum, 'upvoteNum': tem[i].upvoteNum, 'avatar': tem[i].user.avatar, 'title': tem[i].postTitle, 'userId': tem[i].user.userId
            };
            temInfo.push(u);
          }
          _this.setData({ focusData: temInfo })
          if (_this.data.currentTab == 0) {
            _this.setData({ isred: _this.data.isred })
          }
          if (_this.data.currentTab == 1) {
            _this.setData({ temisred: _this.data.temisred })
          }
        }
      })
    }
    else {
      wx.request({
        url: app.globalData.globalIp + '/getTodayTopics',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        data: {
        },
        success: function (res) {
          _this.data.topicData=[]
          console.log(res.data)
          var tem = res.data.topics;
          for (var i = 0; i < tem.length; i++) {
            var t = { 'id': i, 'title': tem[i].topicTitle, 'content': tem[i].topicContent }
            _this.data.topicData.push(t);
          }
          _this.setData({
            topicData: _this.data.topicData
          })
        }
      })
    }
    console.log(this.data.currentTab)
    this.checkCor();       //检查滑动切换状态
  },
  checkCor: function () {   //检查滑动切换状态
    if (this.data.currentTab > 3) {
      this.setData({ scrollLeft: 300 })
    }
    else {
      this.setData
        ({
          scrollLeft: 0
        })
    }
  },
  imageLoad: function (e) {       //自适应加载图片 这里还有点bug 因为必须要启动onload才能调用该函数
    var idx=e.currentTarget.dataset.id;
    var width = e.detail.width;     //图片宽度
    var height = e.detail.height;   //图片高度
    var ratio = height / width;   
    var viewHeight = 500; 
    var viewWidth = 500/ratio;
    _this.data.imgwidth[idx]=viewWidth;
    _this.data.imgheight[idx]=viewHeight;   
    _this.setData({
      imgwidth: _this.data.imgwidth,
      imgheight: _this.data.imgheight
    })
  },
  temimageLoad: function (e) {       //自适应加载图片 这里还有点bug 因为必须要启动onload才能调用该函数
    var idx = e.currentTarget.dataset.id;
    var width = e.detail.width;     //图片宽度
    var height = e.detail.height;   //图片高度
    var ratio = height / width;
    var viewHeight = 500;
    var viewWidth = 500 / ratio;
    _this.data.temimgwidth[idx] = viewWidth;
    _this.data.temimgheight[idx] = viewHeight;
    _this.setData({
      temimgwidth: _this.data.temimgwidth,
      temimgheight: _this.data.temimgheight
    })
  },
  temclickred: (e) => {           //关注栏点赞
    var idx = e.currentTarget.dataset.id;
    let temp1 = _this.data.temisred;
    let temp2 = [];
    temp2 = _this.data.focusData;
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
              postId: temp2[idx].postId
            },
            success: function (res) {
              if (res.data.status == 'TOKEN_EXPIRED') {
                wx.setStorageSync('token', '')
                wx.reLaunch({
                  url: '/pages/index/index',
                })
                wx.showToast({
                  title: '授权过期，请重新登录',
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
              postId: temp2[idx].postId
            },
            success: function (res) {
              if (res.data.status == 'TOKEN_EXPIRED') {
                wx.setStorageSync('token', '')
                wx.reLaunch({
                  url: '/pages/index/index',
                })
                wx.showToast({
                  title: '授权过期，请重新登录',
                  icon: 'loading',
                  duration: 2000
                })
              }
              console.log(res.data);
            }
          })
        }
        _this.setData({ temisred: temp1 });
         _this.setData({ focusData: temp2 });
      }
    })
  },
  clickred:(e)=>{           //发现栏点赞
    var idx=e.currentTarget.dataset.id;
    let temp1=_this.data.isred;
    let temp2=[];
    temp2 = _this.data.userData;
    temp1.forEach((item, index) => {
      if (index == idx ){
        temp1[index] = !temp1[index];
        if (temp1[index]){
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
              postId: temp2[idx].postId
            },
            success: function (res) {
              if (res.data.status == 'TOKEN_EXPIRED') {
                wx.setStorageSync('token', '')
                wx.reLaunch({
                  url: '/pages/index/index',
                })
                wx.showToast({
                  title: '授权过期，请重新登录',
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
              postId: temp2[idx].postId
            },
            success: function (res) {
              if (res.data.status == 'TOKEN_EXPIRED') {
                wx.setStorageSync('token', '')
                wx.reLaunch({
                  url: '/pages/index/index',
                })
                wx.showToast({
                  title: '授权过期，请重新登录',
                  icon: 'loading',
                  duration: 2000
                })
              }
              console.log(res.data);
            }
          })
        }
        _this.setData({ isred: temp1 });
        _this.setData({ userData: temp2 });
      }
    })
  },
  btnTabSwitch:(e)=>{        //点击切换事件
    var cur = e.target.dataset.current;
    _this.setData({
      currentTab: cur
    })
    if(cur==0){
     /* wx.showToast({
        title: '正在刷新',
        icon: 'loading',
        duration: 500
      })
      _this.data.offset+=10;*/
        wx.request({
          url: app.globalData.globalIp + '/getLatestPosts',
          header: { 'content-type': 'application/x-www-form-urlencoded' },
          method: 'post',
          data: {
            limit: _this.data.limit,
            offset: 0
          },
          success: function (res) {
            console.log(res.data)
            var tem = res.data.posts;
            /* if(tem.length==0){
               _this.data.offset=-10
               wx.showToast({
                 title: '额...到底了',
                 icon: 'loading',
                 duration: 1000
               })
             }
             else{*/
            _this.data.userData = [];
            let temInfo = _this.data.userData;
            innerAudioContext.stop()
            if (_this.data.currentTab == 0) {
              _this.data.onePlay.length = tem.length
              _this.data.onePlay.fill(false)
              _this.setData({
                onePlay: _this.data.onePlay
              })
            }
            if (_this.data.currentTab == 1) {
              _this.data.temonePlay.length = tem.length
              _this.data.temonePlay.fill(false)
              _this.setData({
                temonePlay: _this.data.temonePlay
              })
            }
            _this.data.imgwidth.length = tem.length
            //    _this.data.imgwidth.fill(0)
            _this.data.imgheight.length = tem.length
            //    _this.data.imgheight.fill(0)
            _this.data.temimgwidth.length = tem.length
            //     _this.data.imgwidth.fill(0)
            _this.data.temimgheight.length = tem.length
            //     _this.data.imgheight.fill(0)
            if (_this.data.currentTab == 0) {
              _this.data.isred.length = tem.length
              _this.data.isred.fill(false)
            }
            if (_this.data.currentTab == 1) {
              _this.data.temisred.length = tem.length
              _this.data.temisred.fill(false)
            }
            for (var i = 0; i < tem.length; i++) {
              for (var j = 0; j < tem[i].upvotes.length; j++) {
                if (_this.data.currentTab == 0) {
                  if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                    _this.data.isred[i] = true;
                  }
                }
                if (_this.data.currentTab == 1) {
                  if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                    _this.data.temisred[i] = true;
                  }
                }
              }
              var u = {
                'dataId': i, 'name': tem[i].user.userName, 'time': tem[i].ctime, 'content': tem[i].postContent, 'audioTime': tem[i].audioLength, 'imgPath': tem[i].postImg, 'audioPath': tem[i].postAudio, 'postId': tem[i].postId, 'comment': tem[i].commentNum, 'upvoteNum': tem[i].upvoteNum, 'avatar': tem[i].user.avatar, 'title': tem[i].postTitle, 'userId': tem[i].user.userId
              };
              temInfo.push(u);
            }
            _this.setData({ userData: temInfo })
            //      }
          }
        })
    }
    else if(cur==1){
      wx.request({
        url: app.globalData.globalIp +'/getFocusPosts',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        data: {
          userId:app.globalData.userId
        },
        success: function (res) {
          console.log(res.data)
          _this.data.focusData = [];
          if (_this.data.currentTab == 0) {
            _this.data.isred = [];
          }
          if (_this.data.currentTab == 1) {
            _this.data.temisred = [];
          }
          
          let temInfo = _this.data.focusData;
          var tem = res.data.posts;
          innerAudioContext.stop()
          if (_this.data.currentTab == 0) {
            _this.data.onePlay.length = tem.length
            _this.data.onePlay.fill(false)
            _this.setData({
              onePlay: _this.data.onePlay
            })
          }
          if (_this.data.currentTab == 1) {
            _this.data.temonePlay.length = tem.length
            _this.data.temonePlay.fill(false)
            _this.setData({
              temonePlay: _this.data.temonePlay
            })
          }
          _this.data.imgwidth.length = tem.length
    //      _this.data.imgwidth.fill(0)
          _this.data.imgheight.length = tem.length
    //      _this.data.imgheight.fill(0)
          _this.data.temimgwidth.length = tem.length
          //     _this.data.imgwidth.fill(0)
          _this.data.temimgheight.length = tem.length
            //     _this.data.imgheight.fill(0)
          if (_this.data.currentTab == 0) {
            _this.data.isred.length = tem.length
            _this.data.isred.fill(false)
          }
          if (_this.data.currentTab == 1) {
            _this.data.temisred.length = tem.length
            _this.data.temisred.fill(false)
          }
          for (var i = 0; i < tem.length; i++) {
            for (var j = 0; j < tem[i].upvotes.length; j++) {
              if (_this.data.currentTab == 0) {
                if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                  _this.data.isred[i] = true;
                }
              }
              if (_this.data.currentTab == 1) {
                if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                  _this.data.temisred[i] = true;
                }
              }
            }
            var u = {
              'dataId': i, 'name': tem[i].user.userName, 'time': tem[i].ctime, 'content': tem[i].postContent, 'audioTime': tem[i].audioLength, 'imgPath': tem[i].postImg, 'audioPath': tem[i].postAudio, 'postId': tem[i].postId, 'comment': tem[i].commentNum, 'upvoteNum': tem[i].upvoteNum, 'avatar': tem[i].user.avatar, 'title': tem[i].postTitle, 'userId': tem[i].user.userId
            };
            temInfo.push(u);
          }
          _this.setData({ focusData: temInfo })
        }
      })
    }
    else{
      wx.request({
        url: app.globalData.globalIp +'/getTodayTopics',
        header: { "Content-Type": "application/x-www-form-urlencoded" },
        method: 'post',
        data: {
        },
        success: function (res) {
          _this.data.topicData = []
          console.log(res.data)
          var tem=res.data.topics;
          for(var i=0;i<tem.length;i++){
            var t={'id':i,'title':tem[i].topicTitle,'content':tem[i].topicContent}
            _this.data.topicData.push(t);
          }
          _this.setData({
            topicData:_this.data.topicData
          })
        }
      })
    }
  },
  tembtnOnePlay: (e) => {           //关注栏播放事件
    var idx = e.currentTarget.dataset.id;
    var temPlay = _this.data.temonePlay;
    temPlay.forEach((item, index) => {
      if (index == idx) {
        temPlay[index] = !temPlay[index]
        if (temPlay[index] == true) {
           innerAudioContext.src = _this.data.gIp + _this.data.focusData[index].audioPath; // 录音的路径
          innerAudioContext.play()  //播放
          innerAudioContext.onEnded((res) => {   //监听结束事件
            console.log('播放结束!');
            if(temPlay[index]==true){
              temPlay[index] = !temPlay[index]
            }
            _this.setData({ temonePlay: temPlay })
          })
        }
        else{
          innerAudioContext.pause();        //暂停
        }
      } else {
        temPlay[index]=false;
      }
    })
    _this.setData({ temonePlay: temPlay })
  },
  btnOnePlay:(e)=>{          //发现栏播放事件
    var idx=e.currentTarget.dataset.id;
    var temPlay=_this.data.onePlay;
    temPlay.forEach((item, index) => {
      if (index == idx) {
        temPlay[index] = !temPlay[index]
        if(temPlay[index]==true){
            innerAudioContext.src = _this.data.gIp + _this.data.userData[index].audioPath; // 这里可以是录音的临时路径
          innerAudioContext.play()
          innerAudioContext.onEnded((res) => {
            console.log('播放结束!');
            if (temPlay[index]==true){
              temPlay[index] = !temPlay[index]
            }
            _this.setData({ onePlay: temPlay })
          })
        }
        else {
          innerAudioContext.pause();
        }
      } else {
        temPlay[index]=false;
      }
    })
    _this.setData({onePlay:temPlay})
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    _this = this;
    wx.getSystemInfo({          //设置窗口大小
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR ;
        _this.setData({
          winHeight: calc
        });
      }
    });
    wx.setNavigationBarTitle({ title: '首页' });
    _this.setData({
      gIp : app.globalData.globalIp
    })
    innerAudioContext.onPlay((res) => {    //监听开始播放事件
      console.log('播放开始!');
    })
    innerAudioContext.onPause((res) => {       //监听暂停事件
      console.log('播放暂停!');
    })
  },
  clickDetail:function(e){        //进入动态详情
    innerAudioContext.stop();
    var idx=e.currentTarget.dataset.id;
    if (_this.data.currentTab == 0){
      app.globalData.ofcommentId = _this.data.userData[idx].postId;
    }
    if (_this.data.currentTab == 1) {
      app.globalData.ofcommentId = _this.data.focusData[idx].postId;
    }
    wx.navigateTo({
      url: '/pages/page05/index',
    })
  },
  clickOwn: function (e) {      //点击头像 今夜主页
    var idx=e.currentTarget.dataset.id;
    var temp=_this.data.userData;
    temp.forEach((item,index)=>{
      if(idx==index){
        app.globalData.ofuserId=temp[idx].userId;
        wx.navigateTo({
          url: '/pages/page07/index',
        })     
        }
    })
  },
  clickPut: function (e) {  //在话题栏点击话题进入发布动态页面
    var idx=e.currentTarget.dataset.id;
    _this.data.topicData.forEach((item,index)=>{
      if(idx==index){
        app.globalData.title = _this.data.topicData[idx].title;
        app.globalData.content = _this.data.topicData[idx].content;
        wx.reLaunch({
          url: '/pages/page02/index',
        })
      }
    })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () { },
  // 生命周期函数--监听页面显示
  onShow: function () {
    wx.showTabBar({
    })
    if(_this.data.currentTab==0){
      wx.request({
        url: app.globalData.globalIp + '/getLatestPosts',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'post',
        data: {
          limit: _this.data.limit,
          offset: 0
        },
        success: function (res) {
          _this.data.userData = []
          console.log(res.data)
          _this.data.userData = [];
          let temInfo = _this.data.userData;
          var tem = res.data.posts;
          innerAudioContext.stop()
          if (_this.data.currentTab == 0) {
            _this.data.onePlay.length = tem.length
            _this.data.onePlay.fill(false)
            _this.setData({
              onePlay: _this.data.onePlay
            })
          }
          if (_this.data.currentTab == 1) {
            _this.data.temonePlay.length = tem.length
            _this.data.temonePlay.fill(false)
            _this.setData({
              temonePlay: _this.data.temonePlay
            })
          }
          _this.data.imgwidth.length = tem.length
     //     _this.data.imgwidth.fill(0)
          _this.data.imgheight.length = tem.length
     //     _this.data.imgheight.fill(0)
          _this.data.temimgwidth.length = tem.length
          //     _this.data.imgwidth.fill(0)
          _this.data.temimgheight.length = tem.length
            //     _this.data.imgheight.fill(0)
          if (_this.data.currentTab == 0) {
            _this.data.isred.length = tem.length
            _this.data.isred.fill(false)
          }
          if (_this.data.currentTab == 1) {
            _this.data.temisred.length = tem.length
            _this.data.temisred.fill(false)
          }
          for (var i = 0; i < tem.length; i++) {
            for (var j = 0; j < tem[i].upvotes.length; j++) {
              if (_this.data.currentTab == 0) {
                if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                  _this.data.isred[i] = true;
                }
              }
              if (_this.data.currentTab == 1) {
                if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                  _this.data.temisred[i] = true;
                }
              }
            }
            var u = { 'dataId': i, 'name': tem[i].user.userName, 'time': tem[i].ctime, 'content': tem[i].postContent, 'audioTime': tem[i].audioLength, 'imgPath': tem[i].postImg, 'audioPath': tem[i].postAudio, 'postId': tem[i].postId, 'comment': tem[i].commentNum, 'upvoteNum': tem[i].upvoteNum, 'avatar': tem[i].user.avatar, 'title': tem[i].postTitle, 'userId': tem[i].user.userId };
            temInfo.push(u);
          }
          _this.setData({ userData: temInfo })
          if (_this.data.currentTab == 0) {
            _this.setData({ isred: _this.data.isred })
          }
          if (_this.data.currentTab == 1) {
            _this.setData({ temisred: _this.data.temisred })
          }
        }
      })
    }
  },
  // 生命周期函数--监听页面隐藏
  onHide: function () { },
  // 生命周期函数--监听页面卸载
  onUnload: function () { },
  // 页面相关事件处理函数--监听用户下拉动作
  onReachBottom: function () {
  },
  refresh:function(){   //刷新事件 
      wx.showToast({
        title: '刷新中',
        icon: 'loading',
        duration: 500,
        success: function () {
          _this.data.limit += 10;   //数据加10条
          wx.request({
            url: app.globalData.globalIp + '/getLatestPosts',
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'post',
            data: {
              limit: _this.data.limit,
              offset: 0
            },
            success: function (res) {
              console.log(res.data)
              var tem = res.data.posts;
                _this.data.userData = [];
                let temInfo = _this.data.userData;
                innerAudioContext.stop()
                //if (_this.data.currentTab == 0) {
                  _this.data.onePlay.length = tem.length
                  _this.data.onePlay.fill(false)
                  _this.setData({
                    onePlay: _this.data.onePlay
                  })
                //}
                /*if (_this.data.currentTab == 1) {
                  _this.data.temonePlay.length = tem.length
                  _this.data.temonePlay.fill(false)
                  _this.setData({
                    temonePlay: _this.data.temonePlay
                  })
                }*/
                _this.data.imgwidth.length = tem.length
                //    _this.data.imgwidth.fill(0)
                _this.data.imgheight.length = tem.length
                //    _this.data.imgheight.fill(0)
              _this.data.temimgwidth.length = tem.length
              //     _this.data.imgwidth.fill(0)
              _this.data.temimgheight.length = tem.length
            //     _this.data.imgheight.fill(0)
                //if (_this.data.currentTab == 0) {
                  _this.data.isred.length = tem.length
                  _this.data.isred.fill(false)
                //}
                /*if (_this.data.currentTab == 1) {
                  _this.data.temisred.length = tem.length
                  _this.data.temisred.fill(false)
                }*/
                for (var i = 0; i < tem.length; i++) {
                  for (var j = 0; j < tem[i].upvotes.length; j++) {
                  //  if (_this.data.currentTab == 0) {
                      if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                        _this.data.isred[i] = true;
                      }
                //    }
                 /*   if (_this.data.currentTab == 1) {
                      if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                        _this.data.temisred[i] = true;
                      }
                    }*/
                  }
                  var u = {
                    'dataId': i, 'name': tem[i].user.userName, 'time': tem[i].ctime, 'content': tem[i].postContent, 'audioTime': tem[i].audioLength, 'imgPath': tem[i].postImg, 'audioPath': tem[i].postAudio, 'postId': tem[i].postId, 'comment': tem[i].commentNum, 'upvoteNum': tem[i].upvoteNum, 'avatar': tem[i].user.avatar, 'title': tem[i].postTitle, 'userId': tem[i].user.userId
                  };
                  temInfo.push(u);
                }
                _this.setData({ userData: temInfo,
                isred:_this.data.isred 
                })
              //  wx.hideLoading();
            }
          })
        }
      })
  },
  // 页面上拉触底事件的处理函数
  onPullDownRefresh: function () {
  },
  // 用户点击右上角分享
  onShareAppMessage: function () { }
})