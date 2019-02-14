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
          bg: "https://zungfu2.azurewebsites.net/Common/Images/App/afterSale/service_img_01@3x.png",
          icon: "https://zungfu2.azurewebsites.net/Common/Images/App/afterSale/home_icon_normal@3x.png",
        },
        {
          url: "/pages/afterSale/help/index",
          text: "道路救援",
          bg: "https://zungfu2.azurewebsites.net/Common/Images/App//afterSale/service_img_02@3x.png",
          icon: "https://zungfu2.azurewebsites.net/Common/Images/App/afterSale/home_icon_normal@3x.png",
        },
        {
          url: "/pages/afterSale/mycar/love/index",
          text: "爱车小贴士",
          bg: "https://zungfu2.azurewebsites.net/Common/Images/App/afterSale/service_img_03@3x.png",
          icon: "https://zungfu2.azurewebsites.net/Common/Images/App/afterSale/home_icon_normal@3x.png",
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
          content: '请移步到个人中心完善个人信息后再进行维修保养操作',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/userCenter/index"
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      } if (!wx.getStorageSync('hasVehicle')){
        wx.showModal({
          title: '提示',
          content: '请移步到个人中心添加我的爱车后再进行维修保养操作',
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: "/pages/userCenter/index"
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