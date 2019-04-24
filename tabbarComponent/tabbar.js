// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
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
    }
  },

  /**
   * 组件的初始数据
   */
  

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
