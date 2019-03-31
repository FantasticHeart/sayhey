//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'welcome sayhey',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.getStorage({
      key: 'token',
      success: function(res) {   //登录
      
        wx.request({
          url: app.globalData.globalIp +'/login',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            code: app.globalData.code
          },
          method: 'post',
          success: function (res) {
            if (res.data.status == 'SUCCESS') {
             
              wx.switchTab({
                url: '/pages/page01/index',
              })
              wx.showToast({
                title: '登录成功',
                duration: 2000
              })
              app.globalData.token = wx.getStorageSync('token');
              app.globalData.userId=res.data.user.userId;
              
            }
            else {
              wx.showToast({
                title: '登录失败',
                icon: 'loading',
                duration: 2000
              })
            }
          }
        })
      },
      fail:function(){
        wx.request({
          url: app.globalData.globalIp +'/registerUser',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            code: app.globalData.code,
            encryptedData: app.globalData.data,
            iv: app.globalData.iv
          },
          method: 'post',
          success: function (res) {
            if (res.data.status == 'SUCCESS') {
              wx.setStorage({
                key: 'token',
                data: res.data.token,
              })
              app.globalData.token=res.data.token;
              wx.switchTab({
                url: '/pages/page01/index',
              })

              wx.showToast({
                title: '注册成功',
                duration: 2000
              })
              app.globalData.userId = res.data.user.userId;
            }
            else {
              wx.showToast({
                title: '注册失败',
                icon: 'loading',
                duration: 2000
              })
            }
          }
        })
      }
    })

    

  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
