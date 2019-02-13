// pages/afterSale/mycar/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList:[],
    carDlete:[],
    loginhidde: true,
    loadStatus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/myVehicle/GetActiveList?accountId=' + wx.getStorageSync("userId"),
      method: 'get',
      success: function (res) {
        if (res.data.success){
          that.setData({
            carList: res.data.result,
            loginhidde:false
          })
        }
      },
    })
  },

  deleteMyCar:function(e){
    var that = this;
    that.setData({
      loadStatus: true
    })
    wx.request({
      url: app.data.hostUrl + 'api/services/app/myVehicle/DeleteMyVehicleAsync',
      data: that.data.carDlete,
      method: 'post',
      success: function (res) {
        wx.request({
          url: app.data.hostUrl + 'api/services/app/myVehicle/GetActiveList?accountId=' + wx.getStorageSync("userId"),
          method: 'get',
          success: function (res) {
            if (res.data.success) {
              that.setData({
                carList: res.data.result,
                loadStatus: false
              })
            }
          },
        })
      },
    })
    
  },
  binCar:function(e){
    var value = e.detail.value;
    var arr = [];
    for(var i = 0;i<value.length;i++){
      arr[i] = {"id":value[i]*1}
    }
    this.setData({
      carDlete:arr
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