// pages/afterSale/help/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carDisIndex:0,
    tel:0,
    loginhidde:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getDealer('');
    var deaTime = setInterval(function () {
      if (app.globalData.carDis) {
        clearTimeout(deaTime);
        that.setData({
          carDis: app.globalData.carDis,
          carDisId: app.globalData.carDisAddr[that.data.carDisIndex].id * 1,
          carDisAddr: app.globalData.carDisAddr,
          tel: app.globalData.carDisAddr[that.data.carDisIndex].tel,
          loginhidde: false
        })
      }
    }, 1000);
  },
  // getLocation:function(){
  //   wx.getLocation({
  //     success: function(res) {
  //       console.log(res)
  //     },
  //   })
  // },
  bingDis: function (e) {
    var that = this;
    var carDisIndex = e.detail.value;
    that.setData({
      carDisIndex: carDisIndex,
      carDisId: app.globalData.carDisAddr[carDisIndex].id * 1,
      tel: app.globalData.carDisAddr[carDisIndex].tel,
    });
  },
  callphone:function(e){
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel
    })
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