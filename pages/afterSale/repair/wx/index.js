var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carStyle: [],
    carStyleIndex: 0,
    carStyleId: 0,
    carVehicle: [],
    carVehicleIndex: 0,
    carVehicleId: 0,
    title: "",
    date: "2019-01-01",
    carTime: [
      "8:00-10:00",
      "10:00-12:00",
      "14:00-16:00",
    ],
    carTimeIndex: 0,
    carWx:[],
    carWxIndex:0,
    carWxId: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var title = '';
    if (options.type == 1) {
      title = "预约维修";
    } else {
      title = "预约保养";
    }
    that.setData({
      title: title
    });
    var that = this;
    app.getCarStyleList();
    var carStyleOut = setInterval(function () {
      if (app.globalData.carStyle) {
        clearTimeout(carStyleOut);
        that.setData({
          carStyle: app.globalData.carStyle,
          carStyleId: app.globalData.carStyleArr[that.data.carStyleIndex].id * 1,
        });
        app.getCarVehicleList(that.data.carStyleId);
        var carVehicleOut = setInterval(function () {
          if (app.globalData.carVehicle) {
            clearTimeout(carVehicleOut);
            if (app.globalData.carVehicle.length > 0) {
              that.setData({
                carVehicle: app.globalData.carVehicle,
                carVehicleId: app.globalData.carVehicleArr[that.data.carVehicleIndex].id * 1,
              });
            } else {
              that.setData({
                carVehicle: [],
                carVehicleId: -1,
              });
            }
          }
        }, 1000);
      }
    }, 1000);
    app.getWxType();
    var carWxOut = setInterval(function(){
      if (app.globalData.carWx) {
        clearTimeout(carWxOut);
        that.setData({
          carWx: app.globalData.carWx,
          carWxId: app.globalData.carWxArr[that.data.carWxIndex].id * 1,
        });
      }
    },1000)
  },
  bingWx:function(e){
    var that = this;
    that.setData({
      carWxIndex: e.detail.value
    })
  },

  bindDate: function(e) {
    var that = this;
    that.setData({
      date: e.detail.value
    })
  },
  bingTime: function(e) {
    var that = this;
    that.setData({
      carTimeIndex: e.detail.value
    })
  },

  bingCarStyle: function (e) {
    var that = this;
    var carStyleIndex = e.detail.value;
    that.setData({
      carStyleIndex: carStyleIndex,
      carStyleId: app.globalData.carStyleArr[carStyleIndex].id * 1,
    });
    app.getCarVehicleList(that.data.carStyleId);
    var carVehicleOut = setInterval(function () {
      if (app.globalData.carVehicle) {
        clearTimeout(carVehicleOut);
        if (app.globalData.carVehicle.length > 0) {
          that.setData({
            carVehicle: app.globalData.carVehicle,
            carVehicleId: app.globalData.carVehicleArr[that.data.carVehicleIndex].id * 1,
          });
        } else {
          that.setData({
            carVehicle: [],
            carVehicleId: -1,
          });
        }
      }
    }, 1000);
  },

  bingCarVehicle: function (e) {
    var that = this;
    var carVehicleIndex = e.detail.value;
    that.setData({
      carVehicleIndex: carVehicleIndex,
      carVehicleId: app.globalData.carVehicleArr[carVehicleIndex].id * 1,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})