//获取应用实例
const app = getApp()
let _this;
Page({
  // 页面的初始数据
  data: {
    tabbar: {},
    userData:{},
    gIp:''
  },
  clickPost: function () {
    app.globalData.ofuserId = _this.data.userData.userId;
    wx.navigateTo({
      url: '/pages/page09/index',
    })
  },
  clickFocus: function () {
    app.globalData.ofuserId = _this.data.userData.userId;
    wx.navigateTo({
      url: '/pages/page06/index',
    })
  },
  clickFans: function () {
    app.globalData.ofuserId = _this.data.userData.userId;
    wx.navigateTo({
      url: '/pages/page08/index',
    })
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    app.editTabbar();
    _this=this;
    wx.setNavigationBarTitle({title: '我的'});
    _this.setData({
      gIp:app.globalData.globalIp
    })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
  },
  // 生命周期函数--监听页面显示
  onShow: function () {
    wx.request({
      url: app.globalData.globalIp + '/getUserDetail',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId:app.globalData.userId
      },
      success: function (res) {
        console.log(res.data);
        _this.setData({
          userData:res.data.user
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