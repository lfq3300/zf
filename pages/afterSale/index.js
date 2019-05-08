// pages/afterSale/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      list:[
        {
          url: "/pages/afterSale/repair/index",
          text: "维修保养",
          bg: "../../images/service_img_01@3x.png",
          icon: "https://miniprogram.zfchina.com/Common/Images/App/afterSale/home_icon_normal@3x.png",
        },
        {
          url: "/pages/afterSale/help/index",
          text: "道路救援",
          bg: "../../images/service_img_02@3x.png",
          icon: "https://miniprogram.zfchina.com/Common/Images/App/afterSale/home_icon_normal@3x.png",
        },
        {
          url: "/pages/afterSale/mycar/love/index",
          text: "爱车小贴士",
          bg: "../../images/service_img_03@3x.png",
          icon: "https://miniprogram.zfchina.com/Common/Images/App/afterSale/home_icon_normal@3x.png",
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
  jump:function(e){
    if (e.target.dataset.text == "维修保养"){
        //判断是否添加个人资料和爱车信息
      if (!wx.getStorageSync('hasPersonal')){
        wx.showModal({
          title: '提示',
          content: '请先完善个人信息',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: "/pages/userCenter/msg/index"
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } else if (!wx.getStorageSync('hasVehicle')){
        wx.showModal({
          title: '提示',
          content: '请移步到我的爱车完善爱车后再进行维修保养操作',
          success(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: "/pages/afterSale/mycar/index"
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }else{
        wx.navigateTo({
          url: e.target.dataset.url
        })
      }
    }else{
      wx.navigateTo({
        url: e.target.dataset.url
      })
    }
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
    app.ifUserLogin();
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