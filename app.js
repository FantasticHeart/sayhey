var globalData = {
    VERSION: 'v0.0.1',               //0626
    HOST: "https://v.uicut.com/",
    TOKEN:'',
    PROFILE_RECOVER_FLAG:0,
    userInfo:null,   
    code:'',     //登陆注册请求参数
    data:'',   //注册请求参数
    iv:'',   //注册请求参数
    token:'',   //三天有效期 作为权限头参数
    userId:0,     //本用户ID
  globalIp:'http://api.sayhey.top:8888',
    ofcommentId:0,     //某评论ID
    ofuserId:0,    //某用户ID
    fanId:0,  //粉丝用户ID
    focusId:0,   //关注用户ID
    title:'',   
    content:'',
  tabBar: {
    "backgroundColor": "#ffffff",
    "color": "#979795",
    "selectedColor": "#1c1c1b",
    "list": [
      {
        "pagePath": "/pages/page01/index",
        "iconPath": "icon/ft11.png",
        "selectedIconPath": "icon/ft12.png",
        "text": "首页"
      },
      {
        "pagePath": "/pages/page02/index",
        "iconPath": "icon/ft2.png",
        "isSpecial": true,
        "text": "发声"
      },
      {
        "pagePath": "/pages/page03/index",
        "iconPath": "icon/ft31.png",
        "selectedIconPath": "icon/ft32.png",
        "text": "我的"
      }
    ]
  }
};



var appConfig = {
    globalData: globalData,


    // 初始化App
  onLaunch: function () {
    //隐藏系统tabbar
    wx.hideTabBar();
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({         
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        this.globalData.code = res.code
        console.log(this.globalData.code)
        // 获取用户信息
        wx.getSetting({
          success: res => {
                if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              withCredentials: true,
              success: res => {
                this.globalData.data = res.encryptedData;
                console.log(this.globalData.data)
                this.globalData.iv = res.iv;
                console.log(this.globalData.iv)
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
              }
          }
        })
      }
    })
    
  },


    // 后台
    onHide: function () {
    },


    /**
     * App 启动后执行
     */
    onShow: function () {
      //隐藏系统tabbar
        wx.hideTabBar();
        const _this = this;
    },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },



}



App(appConfig)