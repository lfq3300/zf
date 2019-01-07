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
    carDisIndex:0,
    title: "",
    date: "",
    carTimeIndex: 0,
    carWx: [],
    carWxIndex: 0,
    carWxId: 0,
    phone: "",
    getcodetext: "获取验证码",
    getcodeStatus: true,
    ajaxStatus: true,
    pageType:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var title = '';
    var myDate = new Date();
    var m = myDate.getMonth() + 1;
    var t = 0;
    if (myDate.getHours() >= 18) {
      t = 1;
    }
    var b = myDate.getDate() + t;
    var date = myDate.getFullYear() + "-" + m + "-" + b;
    that.setData({
      date: date
    });
    if (options.type == 1) {
      title = "预约维修";
      app.getWxType();
      var carWxOut = setInterval(function () {
        if (app.globalData.carWx) {
          clearTimeout(carWxOut);
          that.setData({
            carWx: app.globalData.carWx,
            carWxId: app.globalData.carWxArr[that.data.carWxIndex].id * 1,
          });
        }
      }, 1000);
    } else {
      title = "预约保养";
    }
    that.setData({
      title: title,
      pageType: options.type
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
              app.globalData.carVehicle = "";
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
    
    app.getDealer('');
    var deaTime = setInterval(function () {
      if (app.globalData.carDis) {
        clearTimeout(deaTime);
        that.setData({
          carDis: app.globalData.carDis,
          carDisId: app.globalData.carDisAddr[that.data.carDisIndex].id * 1,
        })
      }
    }, 1000);
    app.getAppointment();
    var timeAppointment = setInterval(function () {
      if (app.globalData.timeAppointment) {
        clearTimeout(timeAppointment);
        that.setData({
          carTime: app.globalData.timeAppointment,
          carTimeId: app.globalData.timeAppointmentArr[that.data.carTimeIndex].id * 1,
        })
      }
    }, 1000);
  },
  bingWx: function (e) {
    var that = this;
    that.setData({
      carWxIndex: e.detail.value
    })
  },

  bindDate: function (e) {
    var that = this;
    that.setData({
      date: e.detail.value
    })
  },
  bingTime: function (e) {
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
          app.globalData.carVehicle = "";
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
  getPhoneCode: function () {
    var that = this;
    if (!that.data.getcodeStatus) {
      return;
    }
    var status = app.getPhoneCode(that.data.phone);
    if (status) {
      return;
    }


    that.setData({
      getcodeStatus: false
    })
    var downTime = 60;
    var downTimeOut = setInterval(function () {
      downTime--;
      var getcodetext = "";
      if (downTime == 0) {
        getcodetext = "获取验证码";
        that.setData({
          getcodeStatus: true
        })
        clearTimeout(downTimeOut);
        downTime = 60
      } else {
        getcodetext = downTime + "s"
      }
      that.setData({
        getcodetext: getcodetext
      })
    }, 1000)
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this;
    var msg = e.detail.value;
    if (msg.name == "") {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (!app.isPoneAvailable(msg.phone)) {
      wx.showToast({
        title: '电话号码输入有误',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (!app.isPoneCodeAvailable(msg.code)) {
      wx.showToast({
        title: '验证码格式错误',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var data = {
      name:msg.name,
      tel:msg.phone,
      vehicleId: that.data.carVehicleId,
      dealerId:that.data.carDisId,
      appointmentDate:that.data.date,
      appointmentTimeId: that.data.carTimeId,
      genderId:msg.sex,
      description: msg.description,
      accountId: wx.getStorageSync("userId"),
      sessionId: wx.getStorageSync('sessionId'),
      fromId: "appointment",
    }
    var url = "";
    var msg = "";
    if (pageType == 1){
      url = app.data.hostUrl + 'api/services/app/appointment/SubmitMaintainAppointment',
        msg = "您的预约维修需求已经收到";
    }else{
      url = app.data.hostUrl + 'api/services/app/appointment/SubmitServiceAppointment',
      msg = "您的预约保养需求已经收到";
    }
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      success: function (res) {
        that.setData({
          ajaxStatus: true,
        })
        if (res.data.success) {
          wx.redirectTo({
            url: '/pages/success/index?msg=msg'
          })
        } else {
          wx.showToast({
            title: res.data.error.message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        //未发送请求
        that.setData({
          ajaxstatus: true,
        })
        wx.showToast({
          title: '网络异常，请检查网络状态',
          icon: 'none',
          duration: 2500
        })
      }
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