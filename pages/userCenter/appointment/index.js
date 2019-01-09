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
    carTimeIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getAppointment();
    var timeAppointment = setInterval(function () {
      if (app.globalData.timeAppointment) {
        clearTimeout(timeAppointment);
        that.setData({
          carTime: app.globalData.timeAppointment,
          carTimeArr: app.globalData.timeAppointmentArr,
          carTimeId: app.globalData.timeAppointmentArr[that.data.carTimeIndex].id * 1,
          loginhidde: false
        })
        that.getMyAppoin();
      }
    }, 1000);
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
          var carTimeArr = that.data.carTimeArr;
          console.log(carTimeArr);
          for (var i = 0; i < len; i++) {
            var c = {};
            c.dealerIdName = data[i].dealerIdName;
            c.appointmentDate = data[i].appointmentDate;
            for (var a = 0; a < carTimeArr.length;i++){
              if (c.appointmentTimeId == carTimeArr[a].id){
                c.time = carTimeArr[a].name;
                  break;
              }
            }
            c.type = data[i].type;
            all.push(c);
          }
          that.setData({
            loginhidde: false,
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