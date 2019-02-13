// pages/afterSale/repair/wx/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // city: [],
    // cityId: 0,
    // cityIndex: 1,
    loginDate: "2019-01-01",
    carStyle: [],
    carStyleIndex: 0,
    carStyleId: 0,
    carVehicle: [],
    carVehicleIndex: 0,
    carVehicleId: 0,
    carList: [],
    carListIndex: 0,
    carListId: 0,
    phone: "",
    getcodetext: "获取验证码",
    getcodeStatus: true,
    ajaxStatus: true,
    loadStatus:true,
    carDisIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.jumpPageUserInfo(that.route, options);
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
              app.getCarList(that.data.carVehicleId);
              var carListOut = setInterval(function () {
                if (app.globalData.carList) {
                  clearTimeout(carListOut);
                  if (app.globalData.carList.length > 0) {
                    that.setData({
                      carList: app.globalData.carList,
                      carListId: app.globalData.carListArr[that.data.carListIndex].id * 1,
                    });
                  } else {
                    that.setData({
                      carList: [],
                      carListId: -1,
                    });
                  }
                  app.globalData.carList = "";
                  that.setData({
                    loadStatus:false
                  })
                }
              }, 1000);

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
    // app.getCity();
    // var cityOut = setInterval(function () {
    //   if (app.globalData.city) {
    //     clearTimeout(cityOut);
    //     if (app.globalData.city.length > 0) {
    //       that.setData({
    //         city: app.globalData.city,
    //         cityId: app.globalData.cityArr[that.data.cityIndex].id * 1,
    //       });
    //     }
    //   }
    // }, 1000);
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
  },

  bingDis: function (e) {
    var that = this;
    var carDisIndex = e.detail.value;
    that.setData({
      carDisIndex: carDisIndex,
      carDisId: app.globalData.carDisAddr[carDisIndex].id * 1,
    })
  },

  bingCarStyle: function (e) {
    var that = this;
    var carStyleIndex = e.detail.value;
    that.setData({
      carStyleIndex: carStyleIndex,
      carVehicleIndex:0,
      carStyleId: app.globalData.carStyleArr[carStyleIndex].id * 1,
      loadStatus:true
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
          app.getCarList(that.data.carVehicleId);
          var carListOut = setInterval(function () {
            if (app.globalData.carList) {
              clearTimeout(carListOut);
              if (app.globalData.carList.length > 0) {
                that.setData({
                  carList: app.globalData.carList,
                  carListId: app.globalData.carListArr[that.data.carListIndex].id * 1,
                });
                
              } else {
                that.setData({
                  carList: [],
                  carListId: -1,
                });
              }
              app.globalData.carList = "";
              that.setData({
                loadStatus: false
              })
            }
          }, 1000);

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
      loadStatus: true
    });
    app.getCarList(that.data.carVehicleId);
    var carListOut = setInterval(function () {
      if (app.globalData.carList) {
        clearTimeout(carListOut);
        if (app.globalData.carList.length > 0) {
          that.setData({
            carList: app.globalData.carList,
            carListId: app.globalData.carListArr[that.data.carListIndex].id * 1,
          });
        } else {
          that.setData({
            carList: [],
            carListId: -1,
          });
        }
        app.globalData.carList = '';
        that.setData({
          loadStatus: false
        })
      }
    }, 1000);
  },
  bingCarList: function (e) {
    var that = this;
    var carListIndex = e.detail.value;
    that.setData({
      carListIndex: carListIndex,
      carListId: app.globalData.carListArr[carListIndex].id * 1,
    });
  },
  bingCity: function (e) {
    var that = this;
    var cityIndex = e.detail.value;
    that.setData({
      cityIndex: cityIndex,
      cityId: app.globalData.cityArr[cityIndex].id * 1,
    });
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
    if (!that.data.ajaxStatus) {
      return;
    }
    var msg = e.detail.value;
    if (msg.contactName == "") {
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
    // if (msg.name == "") {
    //   wx.showToast({
    //     title: '请输入爱车昵称',
    //     icon: 'none',
    //     duration: 1500
    //   })
    //   return false;
    // }
    if (msg.licensePlate == "") {
      wx.showToast({
        title: '请输入车牌号',
        icon: 'none',
        duration: 1500
      })
      return false;
    }

    if (msg.engineCode == "") {
      wx.showToast({
        title: '请输入车辆识别号',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (msg.vin == "") {
      wx.showToast({
        title: '请输入底盘号码',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    var data = {
      id: "",
      name: that.data.carList[that.data.carVehicleIndex],
      contactName: msg.contactName,
      categoryId: that.data.carVehicleId,
      vehicleId: that.data.carListId,
     // carListId: that.data.carListId,
      engineCode: msg.engineCode,
      vin: msg.vin,
      licensePlate: msg.licensePlate,
     // cityId: that.data.cityId,
      dealerId: that.data.carDisIndex,
      firstLicenseDate: that.data.date,
      purchaseDate: that.data.loginDate,
      code: msg.code,
      contactTel: msg.phone,
      accountId: wx.getStorageSync("userId"),
      sessionId: wx.getStorageSync('sessionId'),
      fromId: "appointment",
    };
    that.setData({
      ajaxStatus: false
    })
    wx.request({
      url: app.data.hostUrl + 'api/services/app/myVehicle/CreateOrUpdateMyVehicleAsync',
      data: data,
      method: 'POST',
      success: function (res) {
        that.setData({
          ajaxStatus: true,
        })
        if (res.data.success) {
          wx.redirectTo({
            url: '/pages/success/index'
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