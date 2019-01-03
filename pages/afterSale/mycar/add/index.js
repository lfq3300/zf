// pages/afterSale/repair/wx/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carType: [
      "请选择",
      "车型一",
      "车型二",
      "车型三"
    ],
    carTypeIndex: 1,
    carDis: [
      "请选择",
      "车款一",
      "车款二",
      "车款三"
    ],
    carDisIndex: 1,
    date: "2019-01-01",
    city: [
      "广东", "湖南", "北京"
    ],
    cityIndex: 1,
    loginDate: "2019-01-01",

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  bingCity: function (e) {
    var that = this;
    that.setData({
      cityIndex: e.detail.value
    })
  },
  bingCarType: function (e) {
    var that = this;
    that.setData({
      carTypeIndex: e.detail.value
    })
  },
  bingDis: function (e) {
    var that = this;
    that.setData({
      carDisIndex: e.detail.value
    })
  },
  bindDate: function (e) {
    var that = this;
    that.setData({
      date: e.detail.value
    })
  },
  bindLoginDate: function (e) {
    var that = this;
    that.setData({
      loginDate: e.detail.value
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