var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _sex: 1,
    loginhidde: true,
  },
  bindSexChange: function (e) {
    this.setData({
      _sex: e.target.dataset.sex
    })
  },
  bindMemberChange: function (e) {
    this.setData({
      _member: e.target.dataset.member
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getActivity(options.id);
  },

  getActivity: function (id) {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/activity/GetById',
      method: "post",
      data: { id: id },
      success: function (res) {
        if (res.statusCode == 200 && res.data.success) {
          var data = res.data.result;
          WxParse.wxParse('accontent', 'html', data.activity.content, that, 0);
          that.setData({
            loginhidde: false,
            imgurl: data.activity.imgUrl
          });
        }
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