// pages/index/drive/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajaxStatus:true,
    date:"2019-01-01",
    pdate:'',
    carTime:[
      
    ],
    carTimeIndex:0,
    carTimeId: '',
    carDisIndex: 0,
    carDisId: '',
    imgUrl: "",
    carname: "",
    carnameid: "",
    name: "",
    carid: "",
    phone: "",
    getcodetext: "获取验证码",
    getcodeStatus: true,
    ajaxStatus: true,
    cityIndex: 0,
    cityId:0,
    carListIndex: 0
  },
  formSubmit:function(e){
    var that = this;
    if (!that.data.ajaxStatus) {
      return;
    }
    var msg = e.detail.value;
    if (that.data.carDisId < 0 ){
        wx.showToast({
          title: that.data.carDis[that.data.carDisIndex],
          icon: 'none',
          duration: 1500
        })
        return;
    }
    var data = {
      accountId: wx.getStorageSync("userId"),
      name: wx.getStorageSync("realName"),
      tel: wx.getStorageSync("phone"),
      vehicleId: that.data.carid,
      vehicleIdName: that.data.name,
      dealerId: that.data.carDisId,
      dealerIdName: that.data.carDis[that.data.carDisIndex],
      description: "",
      appointmentDate:that.data.date,
      appointmentTimeId: that.data.carTimeId,
      genderId:msg.sex,
      sessionId: wx.getStorageSync('sessionId'),
      formId: e.detail.formId,
      cityId: that.data.cityId,
      vehicleModelId: that.data.carListId
    }
    console.log(data);
    that.setData({
      ajaxStatus: false
    })
    console.log(data);
    wx.request({
      url: app.data.hostUrl + 'api/services/app/appointment/SubmitVehicleAppointment',
      data: data,
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          ajaxStatus: true,
        })
        if (res.data.success) {
          wx.redirectTo({
            url: "/pages/success/index?msg=您的试驾需求已经收到"
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('callbackurl', '');
    var that = this;
    var myDate = new Date();
    var m = myDate.getMonth() + 1;
    //如果超过了18点 就只能预约第二天的
    var t = 0;
    //例如现在预约 ， 现在9点 只能预约 10-11点的 超过18点 第二天全天不用判断
    if (myDate.getHours() >= 18) {
      t = 1;
    }
    var b = myDate.getDate()+t;
    var date = myDate.getFullYear() + "-" + m + "-" + b;
    that.setData({
      date: date,
      pdate: date
    });
    that.setData({
      imgUrl: options.url,
      carname: options.carname,
      name: options.name,
      carnameid: options.carnameid,
      carid: options.id
    });
    that.onInfo(options.id)
   
  },

  onInfo:function(id){
    var that = this;
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

    app.getCity();
    var cityOut = setInterval(function () {
      if (app.globalData.city) {
        clearTimeout(cityOut);
        if (app.globalData.city.length > 0) {
          that.setData({
            city: app.globalData.city,
            cityId: app.globalData.cityArr[0].id
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
          app.getAddrDealerAndVehicleId(vcity, that.data.carid);
        //  app.getAddrDealer(vcity);
          var deaTime = setInterval(function () {
            console.log(app.globalData.carAddrDisAddr);
            if (app.globalData.carAddrDisAddr) {
              clearTimeout(deaTime);
              that.setData({
                carDis: app.globalData.carAddrDis,
                carDisIndex: 0,
                carDisId: app.globalData.carAddrDisAddr[0].id * 1,
                loginhidde: true
              })
              app.globalData.carAddrDisAddr = '';
            }
            wx.hideNavigationBarLoading();
            wx.stopPullDownRefresh();
          }, 1000);
        }
      }
    }, 1000);
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicleModel/GetActiveList?vehicleId=' + that.data.carid,
      method: 'post',
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
            carList: a,
            carListArr: b,
            carListId: carListId,
          });
        }
      },
    })
    
  },

  bingCar: function (e) {
    var that = this;
    var carListIndex = e.detail.value;
    that.setData({
      carListIndex: carListIndex,
      carListId: that.data.carListArr[carListIndex].id * 1,
    });
  },
  bingCity: function (e) {
    var that = this;
    var cityIndex = e.detail.value;
    that.setData({
      cityIndex: cityIndex,
      cityId: app.globalData.cityArr[cityIndex].id,
      ajaxstatus: false
    });
  //  app.getAddrDealer(that.data.city[cityIndex]);
    app.getAddrDealerAndVehicleId(that.data.city[cityIndex], that.data.carid);
    var deaTime = setInterval(function () {
      if (app.globalData.carAddrDisAddr) {
        clearTimeout(deaTime);
        that.setData({
          carDis: app.globalData.carAddrDis,
          carDisIndex: 0,
          carDisId: app.globalData.carAddrDisAddr[0].id * 1,
          ajaxstatus: true
        })
        app.globalData.carAddrDisAddr = '';
      }
    }, 1000);
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
  bingTime:function(e){
    var that = this;
    that.setData({
      carTimeIndex: e.detail.value
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
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    var that = this;
    that.onInfo(that.data.carid);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})