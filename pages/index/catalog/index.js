// pages/index/catalog/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList:[
     
    ],
    carname:"",
    carnameid:"",
    loginhidde:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var classhide = false;
    if (options.name.length > 1){
      classhide = true;
    }
    that.setData({
      name: options.name,
      carname: options.carname,
      carnameid: options.carnameid,
      id:options.id,
      classhide: classhide
    })
    that.onInfo(options.id);
  },

  onInfo: function (id){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicle/GetActiveList?categoryId=' + id,
      method: 'post',
      success: function (res) {
        if (res.data.success) {
          var carList = res.data.result;
          that.setData({
            carList: carList,
            loginhidde: false
          })
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
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