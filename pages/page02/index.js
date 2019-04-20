//获取应用实例
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()  //播放器
let _this;
Page({
  // 页面的初始数据
  data: {
    titleareaValue:'',  //标题内容
    titleNumber:0,   //标题字数
    btnLoad:true,   //是否允许图片上传
    textareaValue:'',   //输入内容
    textNumber:0,   //内容字数
    uploadFilePaths:[],       //临时图片路径
    audioPath:'',   //临时音频路径
    voiceStatus:1,        //录音状态    1 ，  2
    isVoice:false,      //是否进入回放状态
    userId:0,   //下面全是发布请求所需要的参数 有一些没用到
    postTitle:'',
    postContent:'',
    postAudio:'',
    postImg:'',
    audioLength:0,
    times:0,
    isupload:false,   //是否上传音频
    isplay:false   //是否在回放
},
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
init:function(){
  _this.setData({
    titleareaValue: '',
    titleNumber: 0,
    btnLoad: true,
    textareaValue: '',
    textNumber: 0,
    uploadFilePaths: [],
    audioPath: '',
    voiceStatus: 1,
    isVoice: false,
    userId: 0,
    postTitle: '',
    postContent: '',
    postAudio: '',
    postImg: '',
    audioLength: 0,
    times: 0,
    isupload: false,
    isplay: false
  })
},
submitRequest:function(){

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
      wx.switchTab({
        url: '/pages/page01/index',
      })
      wx.showToast({
        title: "发布成功",
        icon: "",//仅支持success或者loading
        duration: 1000
      });

    }
  })
},
play:function(){   //回放播放
  innerAudioContext.src = _this.data.audioPath; // 这里是录音的临时路径
 _this.setData({
   isplay:!_this.data.isplay
 })
 if(_this.data.isplay){
   innerAudioContext.play()
 }
  else{
   innerAudioContext.pause()
  }
},
back:function(){          //左上角返回按钮
  if (_this.data.isVoice && _this.data.voiceStatus!=2) {
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (res) {
        if (res.confirm) {
          innerAudioContext.stop();
          _this.init()
          app.globalData.title = '';
          app.globalData.content = '';
          wx.switchTab({
            url: '../page01/index',
          })
        }
      }
    })
  }
  else if (!_this.data.isVoice && _this.data.voiceStatus != 2){
    innerAudioContext.stop();
    _this.init()
    app.globalData.title = '';
    app.globalData.content = '';
    
    wx.switchTab({
      url: '../page01/index',
    })
  }
  else{
    
  }
},
btnVoice:(e)=>{       //录音
  const recorderManager = wx.getRecorderManager();  //录音器
  recorderManager.onError(function () {
    // 录音失败的回调处理\
    console.log('录音失败！')
  });
  recorderManager.onStop(function (res) {
    // 停止录音之后，把录取到的音频放在res.tempFilePath
    console.log(res.tempFilePath)
    _this.setData({
      audioPath: res.tempFilePath,
      voiceStatus: 1,
      isVoice: true
    })
    const innerAudioContext = wx.createInnerAudioContext();   //播放器
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
          audioLength: innerAudioContext.duration.toFixed(0)
        })
      }, 100)  //这里设置延时0.1秒获取
    })
    innerAudioContext.play();
   // recorderManager.destroy();
  });
  let num=_this.data.voiceStatus+1
  num=num>2?1:num
  if (num==2) {
    _this.setData({
      isVoice: false 
    })
    wx.showToast({
      title: "录音不超60秒",
      icon: "loading",//仅支持success或者loading
      duration: 4000
    });
    recorderManager.start({
      format: 'mp3' // 如果录制acc类型音频则改成aac
    });
  }
  if(num==1){
    _this.setData({
      isVoice:true
    })
    recorderManager.stop()
  }
  _this.setData({voiceStatus:num})
},
upload:function(){   //上传音频
  _this.setData({
    isupload:!_this.data.isupload
  })
  if (_this.data.isupload){
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
        console.log(res.data)
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
        _this.data.postAudio = JSON.parse(res.data).url;
      }
    })
  }
},
btnUpload:function(e){       //上传照片
  const _this=this;
  wx.chooseImage({
    count: 1,
    sizeType: ['original','compressed'],
    sourceType: ['album', 'camera'],
    success: function(res) {
      let tempFilesSize = res.tempFiles[0].size;
      if (tempFilesSize > 5242880) {
        wx.showToast({ 
          title: '上传图片不能大于5M!',                                 
          icon:'none',
          duration:2000       
          })                        
      }
      else{
        _this.data.btnLoad = false;
        _this.setData({ btnLoad: _this.data.btnLoad });
        let tempFilePaths = _this.data.uploadFilePaths
        let tempUpload = res.tempFilePaths
        tempUpload.forEach(function (item, index) {
          tempFilePaths.push(item)
        })
        _this.setData({ uploadFilePaths: tempFilePaths })
      } 
    }
  })
},
btnDelete:function(e){         //删除照片
  this.data.btnLoad = true;
  this.setData({ btnLoad: this.data.btnLoad });
  let index=e.currentTarget.dataset.id;
  let temp=this.data.uploadFilePaths;
  temp.splice(index,index+1);
  this.setData({uploadFilePaths:temp})
},
  btnInputTitle:function(e){     //标题输入
    let tempValue=e.detail.value;
    this.setData({
      titleareaValue:tempValue,
      titleNumber:tempValue.length,
    })
  },
  btnInputTextarea:function(e){   //内容输入
    let tempValue=e.detail.value;
    this.setData({
      textareaValue:tempValue,
      textNumber:tempValue.length,
    })
  },
  cancel:function(){         //取消上传
    if(_this.data.isVoice){
      wx.showModal({
        title: '提示',
        content: '确定删除吗',
        success: function (res) {
          if (res.confirm) {
            innerAudioContext.stop();
            _this.setData({
              audioPath:'',
              isVoice:false,
              isplay:false,
              isupload:false
            })
          }
        }
      })
    }
  },
  btnSubmit:(e)=>{        //发布
    if (_this.data.audioPath == ''){
      wx.showToast({
        title: '请录音！',
        icon: 'none',
        duration: 1000
      })
    }
    else if (_this.data.postAudio == ''){
      wx.showToast({
        title: '请上传录音！',
        icon: 'none',
        duration: 1000
      })
    }
    else{
      if (_this.data.uploadFilePaths.length != 0 ) {
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
            console.log(res.data);
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
            _this.data.postImg = JSON.parse(res.data).url;
            
                if (_this.data.titleareaValue == '') {
                  _this.setData({
                    titleareaValue: 'sayhey'
                  })
                }
                _this.submitRequest();
          }
        })
      }
      else {
        if (_this.data.titleareaValue == '') {
          _this.setData({
            titleareaValue: 'sayhey'
          })
        }
            _this.submitRequest();
      }    
    }
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    _this=this;
    wx.setNavigationBarTitle({title: '发布动态'});
    _this.setData({
      textareaValue: app.globalData.content,
      titleareaValue: app.globalData.title,
      titleNumber: app.globalData.title.length,
      textNumber: app.globalData.content.length
    })
    innerAudioContext.autoplay = false;
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      //  innerAudioContext.destroy()
    })
    innerAudioContext.onEnded((res) => {
      console.log('播放结束!');
      _this.setData({
        isplay: !_this.data.isplay
      })
      wx.showToast({
        title: '播放结束',
        icon: "success",
        duration: 1000
      })
      //   innerAudioContext.destroy()
    })
    innerAudioContext.onPlay((res) => {
      console.log('播放开始!');

    })
    innerAudioContext.onCanplay(() => {
      innerAudioContext.duration //类似初始化-必须触发-不触发此函数延时也获取不到
      setTimeout(function () {
        //在这里就可以获取到大家梦寐以求的时长了
        console.log(innerAudioContext.duration.toFixed(0));//延时获取长度 单位：秒
        _this.setData({
          audioLength: innerAudioContext.duration.toFixed(0)
        })
      }, 100)  //这里设置延时1秒获取
    })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
    wx.hideTabBar();
  },
  // 生命周期函数--监听页面显示
  onShow: function () {
    wx.hideTabBar();
   // if(_this.data.uploadFilePaths.length!=0){
   // }
  },
  // 生命周期函数--监听页面隐藏
  onHide: function () {},
  // 生命周期函数--监听页面卸载
  onUnload: function () {
    innerAudioContext.stop();
    _this.init()
    app.globalData.title = '';
    app.globalData.content = '';
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {},
  // 用户点击右上角分享
  onShareAppMessage: function () {}
})