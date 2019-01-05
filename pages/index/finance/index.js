// pages/index/finance/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:"",
    carname: "",
    name: "",
    carnameid: "",
    carid: "",
    carTime: [
      "36个月",
      "24个月",
      "12个月"
    ],
    carTimeIndex:0,
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
    var that = this;  
    that.setData({
      imgUrl: options.url,
      carname: options.carname,
      name: options.name,
      carnameid: options.carnameid,
      carid: options.id
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})