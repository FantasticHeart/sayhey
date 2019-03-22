//获取应用实例
const app = getApp()
let _this;
Page({
  // 页面的初始数据
  data: {
    voice:false,
    voiceOk:false,  //录音完成
    onePlay:false,
    Onefinger:false,
  },
  btnFinger:(e)=>{
    _this.setData({Onefinger:!_this.data.Onefinger})
  },
  btnVoice:(e)=>{
    _this.setData({voice:!_this.data.voice})
  },
  btnOnePlay:(e)=>{
    _this.setData({onePlay:!_this.data.onePlay})
  },
  // 评论的时间显示、动态评论数、动态点赞数、评论点赞数的反馈
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    _this=this;
    wx.setNavigationBarTitle({title: '动态详情'});
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {},
  // 生命周期函数--监听页面显示
  onShow: function () {},
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