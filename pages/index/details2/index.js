// pages/index/details/index.js
var app = getApp();
var WxParse = require('../../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    car: "",
    carname: "",
    carnameid: "",
    loginhidde: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      carname: options.carname,
      carnameid: options.carnameid,
      id: options.id
    })
    that.onInfo(options.id);

  },
  onInfo: function (id) {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicle/GetById',
      data: { "id": id },
      method: 'post',
      success: function (res) {
        if (res.data.success) {
          var car = res.data.result.vehicle;
          that.setData({
            car: res.data.result.vehicle,
            carImage: res.data.result.vehicleBanners,
            loginhidde: false,
            vehicleDetails: res.data.result.vehicleDetails,
            carImg: res.data.result.vehicle.headingImgUrl
          })
          WxParse.wxParse('accontent', 'html', car.content, that, 0);
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
          wx.request({
            url: app.data.hostUrl + 'api/services/app/vehicleModel/GetActiveList?vehicleId=' + that.data.car.id,
            method: 'post',
            success: function (res) {
              if (res.data.success) {
                that.setData({
                  carlist: res.data.result
                })                
              }
            }
          })
        }
      }
    });
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

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    that.onInfo(that.data.id);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})