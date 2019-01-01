var app = getApp();
// pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arr: [],
    loginhidde: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.pageInfo();
  },
  pageInfo: function () {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/activity/GetActiveList',
      method: "post",
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
          var arr = res.data.result;
          that.setData({
            loginhidde: false,
            arr: arr
          })
        }
      },
      complete: function () {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
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

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    that.pageInfo();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})