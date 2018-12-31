// pages/index/query/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carStyle: [
      "请选择",
      "车款一",
      "车款二",
      "车款三"
    ],
    carStyleIndex: 1,
    carType: [
      "请选择",
      "车型一",
      "车型二",
      "车型三"
    ],
    carTypeIndex: 1,
    carDis: [
      "请选择",
      "经销商一",
      "经销商二",
      "经销商三"
    ],
    carDisIndex: 1

  },

  /*
    选择车款
  */
  bingCarStyle: function (e) {
    var that = this;
    var carStyle = that.data.carStyle;
    var carStyleIndex = that.data.carStyleIndex;
    that.setData({
      carStyleIndex: e.detail.value
    })
  },

  /*
  选择车型
  */
  bingCarType: function (e) {
    var that = this;
    var carType = that.data.carType;
    var carTypeIndex = that.data.carTypeIndex;
    that.setData({
      carTypeIndex: e.detail.value
    })
  },
  bingDis:function(e){
    var that = this;
    var carDis = that.data.carDis;
    var carDisIndex = that.data.carDisIndex;
    that.setData({
      carDisIndex: e.detail.value
    })
  },

  /*
  提交表单事件
  */
  formSubmit:function(e){
      console.log(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
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
    that.onLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})