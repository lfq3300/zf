var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginhidde: true,
    list:[],
    tag: [{
      "id": 0,
      "name": "全部"
    },
    {
      "id": 1,
      "name": "预约试驾"
    },
    {
      "id": 2,
      "name": "维修保养"
    },
    {
      "id": 3,
      "name": "活动报名"
    }
    ],
    tagIndex: 0,
    activityList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      loginhidde:false
    })
    that.getMyAppoin();
  },
  getMyAppoin:function() {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/appointment/GetListByAccountAsync',
      method: "post",
      data: {
        id: wx.getStorageSync("userId"),
        typeId: ""
      },
      success: function (res) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        var all = [], yysj = [], afterSale = [], activity = [];
        if (res.statusCode == 200 && res.data.success) {
          var data = res.data.result;
          var len = data.length;
          for (var i = 0; i < len; i++) {
            var c = {};
            c.dealerIdName = data[i].dealerIdName;
            c.appointmentDate = data[i].appointmentDate;
            c.type = data[i].type;
            all.push(c);
            if (c.type == "100000001") {
              yysj.push(c);
            } else if (c.type == "100000002") {
              activity.push(c);
            } else if (c.type == "100000003" || c.type == "100000004") {
              afterSale.push(c);
            }
          }
          that.setData({
            loginhidde: false,
            all: all,
            yysj: yysj,
            afterSale: afterSale,
            activity: activity,
            list:all
          });
        }
      },
      fail: function () {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  getAsync:function(e){
    var that = this;
    that.setData({
       tagIndex:e.target.dataset.id
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