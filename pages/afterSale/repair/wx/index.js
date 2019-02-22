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
    ajaxstatus: true,
    pageType:1,
    carListArrIndex:0,
    lovecarId:0,
    cityIndex:0,
    carListIndex: 0,
    loginhidde: true,
    pdate:"",
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
      date: date,
      pdate:date,
      options:options
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
      pageType: options.type ? options.type:1
    });

    //获取我的爱车
    wx.request({
      url: app.data.hostUrl + 'api/services/app/myVehicle/GetActiveList?accountId=' + wx.getStorageSync("userId"),
      method: 'get',
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          var result = res.data.result;
          var a = [];
          for (var i = 0; i < result.length; i++) {
            a[i] = result[i].name;
          }
          that.setData({
            carList: res.data.result,
            carListArr: a,
            lovecarId: res.data.result[0].id,
            vehicleId: res.data.result[0].vehicleId,
            categoryIdName: res.data.result[0].categoryIdName,
          });
        }
        that.setData({
          loginhidde: false
        })
      },
    })

    app.getCity();
    var cityOut = setInterval(function () {
      if (app.globalData.city) {
        clearTimeout(cityOut);
        if (app.globalData.city.length > 0) {
          that.setData({
            city: app.globalData.city,
          });
          var pagecity = app.globalData.city;
          var vcity = "";
          for (var i = 0; i < pagecity.length; i++) {
            if (pagecity[i] == app.globalData.loadcity) {
              vcity = pagecity[i];
              break;
            } else {
              vcity = pagecity[0];
            }
          }
          app.getAddrDealer(vcity);
          var deaTime = setInterval(function () {
            if (app.globalData.carAddrDisAddr) {
              clearTimeout(deaTime);
              that.setData({
                carDis: app.globalData.carAddrDis,
                carDisIndex: 0,
                carAddrDisAddr: app.globalData.carAddrDisAddr,
                carDisId: app.globalData.carAddrDisAddr[0].id * 1,
              })
              app.globalData.carAddrDisAddr = '';
            }
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
          }, 1000);
        }
      }
    }, 1000);


    app.getAppointment();
    var timeAppointment = setInterval(function () {
      if (app.globalData.timeAppointment) {
        clearTimeout(timeAppointment);
        that.setData({
          carTime: app.globalData.timeAppointment,
          carTimeId: app.globalData.timeAppointmentArr[that.data.carTimeIndex].value,
        })
      }
    }, 1000);
  },

  bingCity: function (e) {
    var that = this;
    var cityIndex = e.detail.value;
    that.setData({
      cityIndex: cityIndex,
    });
    app.getAddrDealer(that.data.city[cityIndex]);
    var deaTime = setInterval(function () {
      if (app.globalData.carAddrDisAddr) {
        clearTimeout(deaTime);
        that.setData({
          carDis: app.globalData.carAddrDis,
          carDisIndex: 0,
          carAddrDisAddr: app.globalData.carAddrDisAddr,
          carDisId: app.globalData.carAddrDisAddr[0].id * 1,
        })
        app.globalData.carAddrDisAddr = '';
      }
    }, 1000);
  },
  bingLoveCar: function (e) {
    var that = this;
    var carListArrIndex = e.detail.value;
    that.setData({
      carListArrIndex: carListArrIndex,
      categoryIdName: that.data.carList[carListArrIndex].categoryIdName,
    })
  },
  bingDis: function (e) {
    var that = this;
    var carDisIndex = e.detail.value;
    console.log(carDisIndex)
    that.setData({
      carDisIndex: carDisIndex,
      carDisId: that.data.carAddrDisAddr[carDisIndex].id * 1,
    });
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

  formSubmit: function (e) {
    var that = this;
    console.log(that.data.ajaxstatus);
    if(!that.data.ajaxstatus){
      return;
    }
    var msg = e.detail.value;
    var data = {
      name: wx.getStorageSync("realName"),
      tel: wx.getStorageSync("phone"),
      vehicleId: that.data.vehicleId,
      dealerId: that.data.carDisId,
      appointmentDate:that.data.date,
      appointmentTimeId: that.data.carTimeId,
      genderId:msg.sex,
      myVehicleId: that.data.lovecarId,
      description: msg.description,
      accountId: wx.getStorageSync("userId"),
      sessionId: wx.getStorageSync('sessionId'),
      code:msg.code,
      FormId: "appointment",
    }
    var url = "";
    var msg = "";
    if (that.data.pageType == 1){
      url = app.data.hostUrl + 'api/services/app/appointment/SubmitMaintainAppointment',
        msg = "您的预约维修需求已经收到";
    }else{
      url = app.data.hostUrl + 'api/services/app/appointment/SubmitServiceAppointment',
      msg = "您的预约保养需求已经收到";
    }
    that.setData({
      ajaxstatus: false,
    })
    wx.request({
      url: url,
      data: data,
      method: 'POST',
      success: function (res) {
        that.setData({
          ajaxstatus: true,
        })
        if (res.data.success) {
          wx.redirectTo({
            url: '/pages/success/index?msg=' + msg
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
   // this.onLoad(this.data.options)
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