//获取应用实例
const app = getApp()
let _this;
Page({
  // 页面的初始数据
  data: {
    titleareaValue:'',
    titleNumber:0,
    btnLoad:true,
    textareaValue:'',
    textNumber:0,
    uploadFilePaths:[],
    audioPath:'',
    voiceStatus:1,        //录音状态    1 ，  2
    sendOk:false,
    userId:0,
    postTitle:'',
    postContent:'',
    postAudio:'',
    postImg:'',
    audioLength:0,
    times:0
},
btnSendVoice:(e)=>{
  _this.setData({sendOk:!_this.data.sendOk})
},


btnVoice:(e)=>{
  let num=_this.data.voiceStatus+1
  num=num>3?1:num
  if (num==2) {
    
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
      _this.setData({
        audioPath:res.tempFilePath 
      })
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
            audioLength: _this.innerAudioContext.duration.toFixed(0)
          })
        }, 100)  //这里设置延时1秒获取
      })
     
    });
  }
  if(num==3){
    _this.recorderManager.stop()
  }
  if (num == 1) {
    const innerAudioContext = wx.createInnerAudioContext() 
    innerAudioContext.src =_this.data.audioPath; // 这里可以是录音的临时路径
    innerAudioContext.play()
    innerAudioContext.onEnded((res) => {
      console.log('播放结束!');
    })
  }
  _this.setData({voiceStatus:num})
},
btnUpload:function(e){
  const _this=this;
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function(res) {
      _this.data.btnLoad = false;
      _this.setData({ btnLoad: _this.data.btnLoad });
      let tempFilePaths = _this.data.uploadFilePaths
      let tempUpload=res.tempFilePaths
      tempUpload.forEach(function(item,index){
        tempFilePaths.push(item)
      })
      _this.setData({uploadFilePaths:tempFilePaths})
      
    }
  })
},
btnDelete:function(e){
  this.data.btnLoad = true;
  this.setData({ btnLoad: this.data.btnLoad });
  let index=e.currentTarget.dataset.id;
  let temp=this.data.uploadFilePaths;
  temp.splice(index,index+1);
  this.setData({uploadFilePaths:temp})
},

  btnInputTitle:function(e){
    let tempValue=e.detail.value;
    this.setData({
      titleareaValue:tempValue,
      titleNumber:tempValue.length,
    })
  },
  btnInputTextarea:function(e){
    let tempValue=e.detail.value;
    this.setData({
      textareaValue:tempValue,
      textNumber:tempValue.length,
    })
  },
  back:function(){
    wx.showModal({
      title: '提示',
      content: '是否保存？',
      success:function(res){
        if(!res.confirm){
          _this.setData({
            titleareaValue: '',
            titleNumber: 0,
            btnLoad: true,
            textareaValue: '',
            textNumber: 0,
            uploadFilePaths: [],
            audioPath: '',
            voiceStatus: 1,        //录音状态    1 ，  2
            sendOk: false,
            userId: 0,
            postTitle: '',
            postContent: '',
            postAudio: '',
            postImg: '',
            audioLength: 0,
            times: 0
          })

          app.globalData.title = '';
          app.globalData.content = '';
          wx.switchTab({
            url: '../page01/index',
          })
        }
        else{
          
          wx.switchTab({
            url: '../page01/index',
          })
        }
      }
    })
   
  },
  btnSubmit:(e)=>{
    if (_this.data.titleareaValue==''){
      wx.showToast({
        title: '标题不能为空！',
        icon:'loading',
        duration:1000
      })
    }
    else if (_this.data.textareaValue == ''){
      wx.showToast({
        title: '内容不能为空！',
        icon: 'loading',
        duration: 1000
      })
    }
    else{
      if (_this.data.uploadFilePaths.length != 0 && _this.data.audioPath == '') {
        wx.uploadFile({
          url: app.globalData.globalIp + '/upload',
          filePath: _this.data.uploadFilePaths[0],
          name: 'file',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            "Authorization": app.globalData.token
          },
          formData: {
            type: 'img'
          },
          success: function (res) {
            _this.data.postImg = JSON.parse(res.data).url;
            wx.request({
              url: app.globalData.globalIp + '/addPost',
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                "Authorization": app.globalData.token
              },
              data: {
                userId: app.globalData.userId,
                postTitle: _this.data.titleareaValue,
                postContent: _this.data.textareaValue,
                postAudio: _this.data.postAudio,
                postImg: _this.data.postImg,
                audioLength: _this.data.audioLength
              },
              success: function (res) {
                console.log(res.data)
                _this.setData({
                  titleareaValue: '',
                  titleNumber: 0,
                  btnLoad: true,
                  textareaValue: '',
                  textNumber: 0,
                  uploadFilePaths: [],
                  audioPath: '',
                  voiceStatus: 1,        //录音状态    1 ，  2
                  sendOk: false,
                  userId: 0,
                  postTitle: '',
                  postContent: '',
                  postAudio: '',
                  postImg: '',
                  audioLength: 0,
                  times: 0
                })
              }
            })
          }
        })
      }
      else if (_this.data.uploadFilePaths.length != 0 && _this.data.audioPath != '') {
        wx.uploadFile({
          url: app.globalData.globalIp + '/upload',
          filePath: _this.data.uploadFilePaths[0],
          name: 'file',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            "Authorization": app.globalData.token
          },
          formData: {
            type: 'img'
          },
          success: function (res) {
            _this.data.postImg = JSON.parse(res.data).url;
            wx.uploadFile({
              url: app.globalData.globalIp + '/upload',
              filePath: _this.data.audioPath,
              name: 'file',
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                "Authorization": app.globalData.token
              },
              formData: {
                type: 'audio'
              },
              success: function (res) {
                _this.data.postAudio = JSON.parse(res.data).url;
                wx.request({
                  url: app.globalData.globalIp + '/addPost',
                  method: 'post',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    "Authorization": app.globalData.token
                  },
                  data: {
                    userId: app.globalData.userId,
                    postTitle: _this.data.titleareaValue,
                    postContent: _this.data.textareaValue,
                    postAudio: _this.data.postAudio,
                    postImg: _this.data.postImg,
                    audioLength: _this.data.audioLength
                  },
                  success: function (res) {
                    console.log(res.data)
                    _this.setData({
                      titleareaValue: '',
                      titleNumber: 0,
                      btnLoad: true,
                      textareaValue: '',
                      textNumber: 0,
                      uploadFilePaths: [],
                      audioPath: '',
                      voiceStatus: 1,        //录音状态    1 ，  2
                      sendOk: false,
                      userId: 0,
                      postTitle: '',
                      postContent: '',
                      postAudio: '',
                      postImg: '',
                      audioLength: 0,
                      times: 0
                    })
                  }
                })
              }
            })
          }
        })

      }
      else if (_this.data.uploadFilePaths.length == 0 && _this.data.audioPath != '') {
        wx.uploadFile({
          url: app.globalData.globalIp + '/upload',
          filePath: _this.data.audioPath,
          name: 'file',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            "Authorization": app.globalData.token
          },
          formData: {
            type: 'audio',
          },
          success: function (res) {
            _this.data.postAudio = JSON.parse(res.data).url;
            wx.request({
              url: app.globalData.globalIp + '/addPost',
              method: 'post',
              header: {
                'content-type': 'application/x-www-form-urlencoded',
                "Authorization": app.globalData.token
              },
              data: {
                userId: app.globalData.userId,
                postTitle: _this.data.titleareaValue,
                postContent: _this.data.textareaValue,
                postAudio: _this.data.postAudio,
                postImg: _this.data.postImg,
                audioLength: _this.data.audioLength
              },
              success: function (res) {
                console.log(res.data)
                _this.setData({
                  titleareaValue: '',
                  titleNumber: 0,
                  btnLoad: true,
                  textareaValue: '',
                  textNumber: 0,
                  uploadFilePaths: [],
                  audioPath: '',
                  voiceStatus: 1,        //录音状态    1 ，  2
                  sendOk: false,
                  userId: 0,
                  postTitle: '',
                  postContent: '',
                  postAudio: '',
                  postImg: '',
                  audioLength: 0,
                  times: 0
                })
              }
            })
          }
        })
      }
      else {
        wx.request({
          url: app.globalData.globalIp + '/addPost',
          method: 'post',
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            "Authorization": app.globalData.token
          },
          data: {
            userId: app.globalData.userId,
            postTitle: _this.data.titleareaValue,
            postContent: _this.data.textareaValue,
            postAudio: _this.data.postAudio,
            postImg: _this.data.postImg,
            audioLength: _this.data.audioLength
          },
          success: function (res) {
            console.log(res.data)
            _this.setData({
              titleareaValue: '',
              titleNumber: 0,
              btnLoad: true,
              textareaValue: '',
              textNumber: 0,
              uploadFilePaths: [],
              audioPath: '',
              voiceStatus: 1,        //录音状态    1 ，  2
              sendOk: false,
              userId: 0,
              postTitle: '',
              postContent: '',
              postAudio: '',
              postImg: '',
              audioLength: 0,
              times: 0
            })
          }
        })
      }

      wx.switchTab({
        url: '/pages/page01/index',
      })
      wx.showToast({
        title: "发布成功",
        icon: "",//仅支持success或者loading
        duration: 1000
      });
    }
    
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    _this=this;
    wx.setNavigationBarTitle({title: '发布动态'});
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {},
  // 生命周期函数--监听页面显示
  onShow: function () {
    _this.setData({
      textareaValue:app.globalData.content,
      titleareaValue:app.globalData.title
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