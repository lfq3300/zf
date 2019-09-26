// pages/userinfo/index.js
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
  onGotUserInfo: function (e) {
    var that = this;
    that.setData({
      hidden: false
    })
    var userInfo = e.detail.userInfo;
    app.data.userInfo = userInfo;
    wx.setStorageSync('userinfo', userInfo);
    wx.request({
      url: app.data.hostUrl + 'api/services/app/account/CheckAccountAsync',
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
        console.log(res);
        that.setData({
          hidden: true
        })
        if (res.statusCode == 200 && res.data.success) {
          wx.setStorageSync('userId', res.data.result.accountId);
          wx.setStorageSync('usertoken', res.data.result.token);
          wx.setStorageSync('hasPersonal', res.data.result.hasPersonal);
          //wx.setStorageSync('hasPersonal', false);
          wx.setStorageSync('hasVehicle', res.data.result.hasVehicle);
          wx.setStorageSync('phone', res.data.result.phone);
          wx.setStorageSync('realName', res.data.result.realName);
          wx.setStorageSync('FirstName', res.data.result.firstName);
          wx.setStorageSync('LastName', res.data.result.lastName);
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
  navBack: function (e) {
    if (!wx.getStorageSync('userinfo')) {
      wx.setStorageSync('userinfo', "setdatainfo");
    }
    wx.navigateBack();
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