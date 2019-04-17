//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
  //  motto: 'welcome sayhey',
    userInfo: {},   //用户信息
    hasUserInfo: false,  //判断是否授权
    canIUse: wx.canIUse('button.open-type.getUserInfo'),  //判断你是否授权
    gIp:''   //公共http头
  },
  //事件处理函数
  bindViewTap: function () {      //点击进入按钮触发事件
    wx.getStorage({       //查找是否有token
      key: 'token',
      success: function(res) {   //找到token
        console.log(res.data)
          wx.request({           //登陆请求
            url: app.globalData.globalIp + '/login',
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            data: {
              code: app.globalData.code
            },
            method: 'post',
            success: function (res) {
              console.log(res.data)
              if (res.data.status == 'SUCCESS') {
                wx.switchTab({
                  url: '/pages/page01/index',
                })
                wx.showToast({
                  title: '登录成功',
                  duration: 2000
                })
                if (wx.getStorageSync('token')==''){   //token为空 需要重新存储 这里是指token过期 自动清空其值
                  wx.setStorageSync('token', res.data.token)
                }
                app.globalData.token = wx.getStorageSync('token');
                app.globalData.userId = res.data.user.userId;
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
      fail:function(res){ //没找到token 
        wx.request({             //注册请求
          url: app.globalData.globalIp +'/registerUser',
          header: { "Content-Type": "application/x-www-form-urlencoded" },
          data: {
            code: app.globalData.code,
            encryptedData: app.globalData.data,
            iv: app.globalData.iv
          },
          method: 'post',
          success: function (res) {
            console.log(res.data)
            if (res.data.status == 'SUCCESS') {
              wx.setStorageSync('token', res.data.token)    //存储token
              app.globalData.token=res.data.token;
              wx.switchTab({
                url: '/pages/page01/index',
              })
              wx.showToast({
                title: '注册成功',
                duration: 2000
              })
              app.globalData.userId = res.data.user.userId;     //本用户ID
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
    this.setData({
      gIp: app.globalData.globalIp
    })
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
  getUserInfo: function (e) {       //第一次使用 需要授权 即点击那行文字触发的事件 以此来获取注册请求后两个参数
    console.log(e.detail.userInfo)
    wx.clearStorageSync('token')
    app.globalData.userInfo = e.detail.userInfo
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo!=null){
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      wx.getUserInfo({
        withCredentials: true,
        success: res => {
          app.globalData.data = res.encryptedData;
          console.log(app.globalData.data)
          app.globalData.iv = res.iv;
          console.log(app.globalData.iv)
          // 可以将 res 发送给后台解码出 unionId
          app.globalData.userInfo = res.userInfo

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
