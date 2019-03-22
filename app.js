var globalData = {
    VERSION: 'v0.0.1',               //0626
    HOST: "https://v.uicut.com/",
    TOKEN:'',
    PROFILE_RECOVER_FLAG:0
};



var appConfig = {
    globalData: globalData,


    // 初始化App
    onLaunch: function () {
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },


    // 后台
    onHide: function () {
        console.log("-----onHide----");
    },


    /**
     * App 启动后执行
     */
    onShow: function () {
        console.log('INFO: app.js onShow called')
        console.log(globalData.VERSION);
        const _this = this;
    },





}



App(appConfig)