// pages/afterSale/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[
        {
          url: "/pages/afterSale/repair/index",
          text: "维修保养",
          bg: "https://zungfu.azurewebsites.net/Common/Images/App/afterSale/service_img_01@3x.png",
          icon: "https://zungfu.azurewebsites.net/Common/Images/App/afterSale/home_icon_normal@3x.png",
        },
        {
          url: "/pages/afterSale/help/index",
          text: "道路救援",
          bg: "https://zungfu.azurewebsites.net/Common/Images/App//afterSale/service_img_02@3x.png",
          icon: "https://zungfu.azurewebsites.net/Common/Images/App/afterSale/home_icon_normal@3x.png",
        },
        {
          url: "/pages/afterSale/mycar/love/index",
          text: "爱车小贴士",
          bg: "https://zungfu.azurewebsites.net/Common/Images/App/afterSale/service_img_03@3x.png",
          icon: "https://zungfu.azurewebsites.net/Common/Images/App/afterSale/home_icon_normal@3x.png",
        }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
 

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})