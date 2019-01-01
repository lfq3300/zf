// pages/index/finance/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carList:[
      "S 320 L",
      "S 420 L",
      "S 520 L"
    ],
    carListIndex:1,
    carTime: [
      "36个月",
      "24个月",
      "12个月"
    ],
    carTimeIndex:0,
  },
  bingCarList:function(e){
    var that = this;
    var carList = that.data.carList;
    var carListIndex = that.data.carListIndex;
    that.setData({
      carListIndex: e.detail.value
    })
  },
  bingCarTime: function (e) {
    var that = this;
    var carTime = that.data.carTime;
    var carTimeIndex = that.data.carTimeIndex;
    that.setData({
      carTimeIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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