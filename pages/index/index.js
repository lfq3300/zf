// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabSelect:1,
    tag:[
      { "id": 1, "name": "SUV"},
      { "id": 2, "name": "轿车" },
      { "id": 3, "name": "轿跑车" },
      { "id": 4, "name": "敞篷跑车" },
      { "id": 5, "name": "MPV" }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 页面下拉刷新
   */
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading();
    var that = this;
    that.onLoad();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})