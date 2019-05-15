var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: 1,
    title:"",
    loginhidde:true,
    id:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getActivity(options.id);
    that.setData({
      typestatus: options.type,
      id: options.id
    });
    console.log(that.data.typestatus);
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
            imgurl: data.activity.imgUrl,
            title: data.activity.title,
            loginhidde: false,
            start: data.activity.startDate
          });
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
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
    var that = this;
    that.getActivity(that.data.id);
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})