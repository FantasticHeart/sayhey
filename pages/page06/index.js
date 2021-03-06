//获取应用实例
const app = getApp()
let _this;
Page({
  // 页面的初始数据
  data: {
    focusData:[],
    gIp:''
  },
  clickOwn: function (e) {
    var idx = e.currentTarget.dataset.id;
    var temp = _this.data.focusData;
    temp.forEach((item, index) => {
      if (idx == index) {
        app.globalData.focusId = temp[idx].userId;
        wx.navigateTo({
          url: '/pages/page11/index',
        })
      }
    })

  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    _this=this;
    wx.setNavigationBarTitle({title: '关注'});
    _this.setData({
      gIp:app.globalData.globalIp
    })
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {},
  // 生命周期函数--监听页面显示
  onShow: function () {
    _this.data.focusData=[];
    wx.request({
      url: app.globalData.globalIp + '/getFocusUsers',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        userId:app.globalData.ofuserId
      },
      success: function (res) {
        console.log(res.data);
        var tem=res.data.users;
        for(var i=0;i<tem.length;i++){
          var f={'id':i,'avatar':tem[i].avatar,'name':tem[i].userName,'info':tem[i].userInfo,'userId':tem[i].userId}
          _this.data.focusData.push(f);
        }
        _this.setData({
          focusData: _this.data.focusData
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