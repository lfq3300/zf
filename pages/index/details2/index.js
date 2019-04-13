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
    loginhidde: true,
    vehicleDetailsIndex:0,
    switchimgindex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      carname: options.carname,
      carnameid: options.carnameid,
      id: options.id,
      carType: options.carType
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
            headingImgUrl: res.data.result.vehicle.headingImgUrl,
            vehicleDetailsImg: res.data.result.vehicleDetails[that.data.vehicleDetailsIndex].items
          })
     //     WxParse.wxParse('accontent', 'html', car.content, that, 0);
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
  switchimg:function(e){
    var that = this;
    var vehicleDetailsIndex = e.target.dataset.index;
    that.setData({
      vehicleDetailsIndex: vehicleDetailsIndex,
      vehicleDetailsImg: that.data.vehicleDetails[vehicleDetailsIndex].items,
      switchimgindex:0
    })
  },
  jumpurl: function (e) {
    if (e.target.dataset.text == "快速询价" || e.target.dataset.text == "预约试驾") {
      //判断是否添加个人资料和爱车信息
      if (!wx.getStorageSync('hasPersonal')) {
        wx.showModal({
          title: '提示',
          content: '请先完善个人资料，再开始' + e.target.dataset.text+"操作",
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
      } else {
        wx.navigateTo({
          url: e.target.dataset.url
        })
      }
    } else {
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