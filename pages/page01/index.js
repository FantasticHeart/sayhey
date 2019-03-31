//获取应用实例
const app = getApp()
let _this;
Page({
  // 页面的初始数据
  data: {
    isred:[],
    onePlay:[],
    index:0,
    tabContent:[1,0,0],
    userData:[],
    gIp:'',
    offset:0,
    focusData:[],
    topicData: []
  },
  
  clickred:(e)=>{
    var idx=e.currentTarget.dataset.id;
    let temp1=_this.data.isred;
    let temp2=[];
    console.log(_this.data.tabContent);
    if(_this.data.tabContent[0]==1){
      temp2 = _this.data.userData;
    }
    if (_this.data.tabContent[1]==1) {
      temp2 = _this.data.focusData;
    }
    temp1.forEach((item, index) => {
      if (index == idx ){
        temp1[index] = !temp1[index];
        if (temp1[index]){
          console.log(temp2[idx].upvoteNum)
          temp2[idx].upvoteNum++;
          console.log(temp2[idx].upvoteNum)
          
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
              console.log(res.data);
              
            }
          })
        }
        else {
          console.log(temp2[idx].upvoteNum)
          temp2[idx].upvoteNum--;
          console.log(temp2[idx].upvoteNum)
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
              console.log(res.data);
            }
          })
        }
        _this.setData({ isred: temp1 });
        if (_this.data.tabContent[0] == 1) {
          _this.setData({ userData: temp2 });
        }
        if (_this.data.tabContent[1] == 1) {
          _this.setData({ focusData: temp2 });
        }
       
        
      }
    })
    
  },
  btnTabSwitch:(e)=>{
    let idx=e.currentTarget.dataset.id;
    let temp=_this.data.tabContent;
    temp.forEach((item,index)=>{
      if (index==idx) {
        temp[index]=1
      }else{
        temp[index]=0
      }
    })
    if(idx==0){
      wx.showToast({
        title: '正在刷新',
        icon: 'loading',
        duration: 500
      })
      _this.data.offset+=10;
      wx.request({
        url: app.globalData.globalIp + '/getLatestPosts',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'post',
        data: {
          limit: 10,
          offset: _this.data.offset
        },
        success: function (res) {
          console.log(res.data)
          
          
          var tem = res.data.posts;
          if(tem.length==0){
            _this.data.offset=-10
            wx.showToast({
              title: '额...到底了',
              icon: 'loading',
              duration: 1000
            })
          }
          else{
            _this.data.userData = [];
            let temInfo = _this.data.userData;
            _this.data.onePlay.length = tem.length
            _this.data.onePlay.fill(false)
            _this.data.isred.length = tem.length
            _this.data.isred.fill(false)
            for (var i = 0; i < tem.length; i++) {
              for (var j = 0; j < tem[i].upvotes.length; j++) {
                if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                  _this.data.isred[i] = true;
                }
              }
              var u = {
                'dataId': i, 'name': tem[i].user.userName, 'time': tem[i].ctime, 'content': tem[i].postContent, 'audioTime': tem[i].audioLength, 'imgPath': tem[i].postImg, 'audioPath': tem[i].postAudio, 'postId': tem[i].postId, 'comment': tem[i].commentNum, 'upvoteNum': tem[i].upvoteNum, 'avatar': tem[i].user.avatar, 'title': tem[i].postTitle, 'userId': tem[i].user.userId
              };
              temInfo.push(u);
            }
            _this.setData({ userData: temInfo })
  
          }
                  }

      })
    }
    else if(idx==1){
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
          _this.data.isred = [];
          _this.data.onePlay = [];
          let temInfo = _this.data.focusData;
          var tem = res.data.posts;
          _this.data.onePlay.length = tem.length
          _this.data.onePlay.fill(false)
          _this.data.isred.length = tem.length
          _this.data.isred.fill(false)
          for (var i = 0; i < tem.length; i++) {
            for (var j = 0; j < tem[i].upvotes.length; j++) {
              if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                _this.data.isred[i] = true;
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
    _this.setData({tabContent:temp})
  },

  btnOnePlay:(e)=>{
    var idx=e.currentTarget.dataset.id;
    var temPlay=_this.data.onePlay;
    temPlay.forEach((item, index) => {
      if (index == idx) {
        temPlay[index] = !temPlay[index]
        if(temPlay[index]==true){
          _this.innerAudioContext = wx.createInnerAudioContext();
          if(_this.data.tabContent[0]==1){
            _this.innerAudioContext.src = _this.data.gIp + _this.data.userData[index].audioPath; // 这里可以是录音的临时路径
          }
          if (_this.data.tabContent[1] == 1) {
            _this.innerAudioContext.src = _this.data.gIp + _this.data.focusData[index].audioPath; // 这里可以是录音的临时路径
          }
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
    _this.setData({onePlay:temPlay})
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    _this = this;
    wx.setNavigationBarTitle({ title: '首页' });
    
    _this.setData({
      gIp : app.globalData.globalIp
    })
  },
  clickDetail:function(e){
    var idx=e.currentTarget.dataset.id;
    if(_this.data.tabContent[0]==1){
      app.globalData.ofcommentId = _this.data.userData[idx].postId;
    }
    if (_this.data.tabContent[1] == 1) {
      app.globalData.ofcommentId = _this.data.focusData[idx].postId;
    }
   
    wx.navigateTo({
      url: '/pages/page05/index',
    })

  },
  clickOwn: function (e) {
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
  clickPut: function (e) {
    var idx=e.currentTarget.dataset.id;
    _this.data.topicData.forEach((item,index)=>{
      if(idx==index){
        app.globalData.title = _this.data.topicData[idx].title;
        app.globalData.content = _this.data.topicData[idx].content;
        wx.switchTab({
          url: '/pages/page02/index',
        })
      }
    })
    
    
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () { },
  // 生命周期函数--监听页面显示
  onShow: function () {
    if(_this.data.tabContent[0]==1){
      if (_this.data.offset = -10) {
        _this.data.offset = 0
      }
      wx.request({
        url: app.globalData.globalIp + '/getLatestPosts',
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: 'post',
        data: {
          limit: 10,
          offset: _this.data.offset
        },
        success: function (res) {
          _this.data.userData = []
          console.log(res.data)
          _this.data.userData = [];
          let temInfo = _this.data.userData;
          var tem = res.data.posts;
          _this.data.onePlay.length = tem.length
          _this.data.onePlay.fill(false)
          _this.data.isred.length = tem.length
          _this.data.isred.fill(false)
          for (var i = 0; i < tem.length; i++) {
            for (var j = 0; j < tem[i].upvotes.length; j++) {
              if (tem[i].upvotes[j].user.userId == app.globalData.userId) {
                _this.data.isred[i] = true;
              }
            }

            var u = { 'dataId': i, 'name': tem[i].user.userName, 'time': tem[i].ctime, 'content': tem[i].postContent, 'audioTime': tem[i].audioLength, 'imgPath': tem[i].postImg, 'audioPath': tem[i].postAudio, 'postId': tem[i].postId, 'comment': tem[i].commentNum, 'upvoteNum': tem[i].upvoteNum, 'avatar': tem[i].user.avatar, 'title': tem[i].postTitle, 'userId': tem[i].user.userId };
            temInfo.push(u);
          }
          _this.setData({ userData: temInfo })
          _this.setData({ isred: _this.data.isred })
        }

      })
    }
    
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