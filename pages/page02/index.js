//获取应用实例
const app = getApp()
let _this;
Page({
  // 页面的初始数据
  data: {
    titleareaValue: '',
    titleNumber: 0,

    textareaValue: '',
    textNumber: 0,
    uploadFilePaths: [],

    voiceStatus: 1, //录音状态    1 ，  2  ，3
    sendOk: false,
    // 传输照片数据
  },
  btnSendVoice: (e) => {
    _this.setData({
      sendOk: !_this.data.sendOk
    })
  },
// 改变成已上传状态

  btnVoice: (e) => {
    console.log(e);
    let num = _this.data.voiceStatus + 1
    num = num > 3 ? 1 : num
// 点击不应该是回到1状态，应该是播放
    if (num == 2) {

      wx.showToast({
        title: "语音不得超过40秒",
        icon: "loading", //仅支持success或者loading
        duration: 2000
      });
    }
    _this.setData({
      voiceStatus: num
    })
  },
  btnUpload: function(e) {
    const _this = this;
    wx.chooseImage({
      count: 9,
      // 选择照片数改成1张
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        let tempFilePaths = _this.data.uploadFilePaths
        let tempUpload = res.tempFilePaths
        tempUpload.forEach(function(item, index) {
          tempFilePaths.push(item)
        })
        _this.setData({
          uploadFilePaths: tempFilePaths
        })
      }
    })
  },
  btnDelete: function(e) {
    let index = e.currentTarget.dataset.id;
    let temp = this.data.uploadFilePaths;
    temp.splice(index, index + 1);
    this.setData({
      uploadFilePaths: temp
    })
  },
  // 照片存储
  btnInputTitle: function(e) {
    let tempValue = e.detail.value;
    this.setData({
      titleareaValue: tempValue,
      titleNumber: tempValue.length,
    })
  },
  // 标题字数滚动
  btnInputTextarea: function(e) {
    let tempValue = e.detail.value;
    this.setData({
      textareaValue: tempValue,
      textNumber: tempValue.length,
    })
  },
  // 文本框字数滚动
  btnSubmit: (e) => {
    wx.showToast({
      title: "发布成功",
      icon: "success", //仅支持success或者loading
      duration: 2000
    });
  },
  // 发布成功的条件还需要包括已上传录音+已写标题。
  // 生命周期函数--监听页面加载
  onLoad: function(options) {
    _this = this;
    wx.setNavigationBarTitle({
      title: '发布动态'
    });
    // 这个？

  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function() {},
  // 生命周期函数--监听页面显示
  onShow: function() {},
  // 生命周期函数--监听页面隐藏
  onHide: function() {},
  // 生命周期函数--监听页面卸载
  onUnload: function() {},
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function() {},
  // 页面上拉触底事件的处理函数
  onReachBottom: function() {},
  // 用户点击右上角分享
  onShareAppMessage: function() {}
})