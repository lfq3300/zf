// pages/index/finance/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "",
    carname: "",
    name: "",
    carnameid: "",
    carid: "",
    carTime: [
      "36",
      "24",
      "12"
    ],
    carTimeIndex: 2,
    loginhidde: true,
    carListIndex: 0,
    carListId: '',
    switchpageIndex: 2,
    speed: 30,
    shoufu: '',
    yg: ''
  },

  bingCarTime: function (e) {
    var that = this;
    var speed = that.data.speed;
    var shoufu = that.data.shoufu;
    var carTimeIndex = e.detail.value;
    var time = that.data.carTime[carTimeIndex];
    var yg = "";
    if (speed > 50) {
      yg = (that.data.rightmsg1.period - shoufu) * that.data.rightmsg1.interestRate / 100 / time
    } else {
      yg = (that.data.rightmsg2.period - shoufu) * that.data.rightmsg2.interestRate / 100 / time
    }
    yg = yg.toFixed(2)
    that.setData({
      carTimeIndex: carTimeIndex,
      yg: yg
    });
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
    that.LoInfo();
  },

  LoInfo: function () {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicleModel/GetActiveList',
      method: 'post',
      data: {
        vehicleId: that.data.carid
      },
      success: function (res) {
        if (res.data.success) {
          var result = res.data.result;
          var a = [];
          var b = [];
          for (var i = 0; i < result.length; i++) {
            a[i] = result[i].name;
            b[i] = result[i];
          }
          var carListId = b[0].id * 1;
          that.setData({
            loginhidde: false,
            carList: a,
            carListArr: b,
            carListId: carListId,
          });
          that.getGetById(carListId);
        }
      }
    });

  },

  getGetById: function (id) {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicleModel/GetById',
      method: 'post',
      data: {
        id: id
      },
      success: function (res) {
        if (res.data.success) {
          var data = res.data.result.vehicleModel.financialPlans;
          if (data) {
            var leftmsg = '';
            var rightmsg1 = '';
            var rightmsg2 = '';
            for (var i = 0; i < data.length; i++) {
              if (data[i].financialTypeId == '100000000') {
                leftmsg = data[i].financialPlanDetails[0];
              } else {
                if (data[i].financialPlanDetails[1].maxDownpayRatio == 50) {
                  rightmsg2 = data[i].financialPlanDetails[1];
                } else {
                  rightmsg1 = data[i].financialPlanDetails[1];
                }
              }
            }
            var shoufu = rightmsg1.period * that.data.speed / 100;
            var yg = (rightmsg1.period - shoufu) * rightmsg1.interestRate / 100 / 12;
            yg = yg.toFixed(2)
            that.setData({
              leftmsg: leftmsg,
              rightmsg1: rightmsg1,
              rightmsg2: rightmsg2,
              shoufu: shoufu,
              yg: yg
            });
          }
        }
      }
    });
  },
  bingCar: function (e) {
    var that = this;
    var carListIndex = e.detail.value;
    console.log(carListIndex);
    that.setData({
      carListIndex: carListIndex,
      carListId: that.data.carListArr[carListIndex].id * 1
    });
    that.getGetById(that.data.carListId);
  },

  switchpage: function (e) {
    console.log(e)
    var that = this;
    var switchpageIndex = e.target.dataset.index;
    that.setData({
      switchpageIndex: switchpageIndex
    })
  },

  tapmove: function (e) {
    var that = this;
    // var touchs = e.touches[0];
    // var pageX = touchs.pageX; 
    var speed = parseInt(e.touches[0].clientX - 70);
    if (speed > 100) {
      speed = 100;
    };
    if (speed < 0) {
      speed = 0;
    }
    var shoufu = "";
    console.log(that.data.rightmsg1);
    if (speed > 50) {
      shoufu = that.data.rightmsg1.period * that.data.speed / 100;
    } else {
      shoufu = that.data.rightmsg2.period * that.data.speed / 100;
    }
    var yg = "";
    var time = that.data.carTime[that.data.carTimeIndex];
    if (speed > 50) {
      yg = (that.data.rightmsg1.period - shoufu) * that.data.rightmsg1.interestRate / 100 / time
    } else {
      yg = (that.data.rightmsg2.period - shoufu) * that.data.rightmsg2.interestRate / 100 / time
    }
    yg = yg.toFixed(2);
    that.setData({
      speed: speed,
      shoufu: shoufu,
      yg: yg
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