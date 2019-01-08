Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginhidde: true,
    tag: [{
      "id": 0,
      "name": "全部",
      "status": 100000000,
    },
    {
      "id": 1,
      "name": "预约试驾",
      "status": 100000001,
    },
    {
      "id": 2,
      "name": "维修保养",
      "status": 100000002,
    },
    {
      "id": 3,
      "name": "活动报名",
      "status": 100000003,
    }
    ],
    tagIndex: 1,
    activityList: [],
    status: 100000001
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      loginhidde:false
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