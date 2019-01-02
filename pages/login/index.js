// pages/Login/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onGotUserInfo:function(e){
    var that = this;
    that.setData({
      hidden: false
    });
    var userInfo = e.detail.userInfo;
    app.data.userInfo = userInfo;
    wx.request({
      url: app.data.hostUrl + 'api/MiniApp/checkaccount',
      method: "post",
      data: {
        sessionId: wx.getStorageSync('sessionId'),
        nickName: userInfo.nickName,
        city: userInfo.city,
        country: userInfo.country,
        province: userInfo.province,
        avatarUrl: userInfo.avatarUrl,
        gender: 0
      },
      success: function (res) {
        that.setData({
          hidden: true
        })
        if (res.statusCode == 200 && res.data.success) {
          wx.setStorageSync('userId', res.data.result.accountId);
          wx.setStorageSync('usertoken', res.data.result.token);
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none',
            duration: 2000
          })
        }
        wx.navigateBack();
      },
      fail: function () {
        wx.showToast({
          title: '无网络链接',
          icon: 'none',
          duration: 2000
        })
        wx.navigateBack();
      },
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