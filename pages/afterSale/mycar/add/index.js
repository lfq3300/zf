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
    carDisIndex: 0,
    carsIndex:0,
    loveCarId:'',
    vehicleLevelId:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.ifUserLogin();
    var that = this;
    console.log(options);
    if(options.id){
        console.log("修改")
        //获取当前车辆的信息
        wx.request({
          url: app.data.hostUrl + '/api/services/app/myVehicle/GetMyVehicleForEdit',
          method: "post",
          data:{
            "id": options.id,
          },
          success:function(res){
              if(res.data.success){
                var carInfo = res.data.result.myVehicle;
                that.setData({
                  loveCarId: options.id,
                  loginDate: carInfo.purchaseDate.substring(0, 10),
                  vin: carInfo.vin,
                  engineCode: carInfo.engineCode,
                  licensePlate: carInfo.licensePlate,
                  vehicleLevelId: carInfo.vehicleLevelId, //车型
                  carVehicleId: carInfo.categoryId,
                  carListId: carInfo.vehicleId,
                  carsId: carInfo.vehicleModelId,
                  dealerId: carInfo.dealerId
                });
                app.getCarStyleList();
              }
          }
        })
    }else{
      console.log("没有ID");
      app.getCarStyleList();
      app.getDealer('');
    }
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
    var carStyleOut = setInterval(function () {
      if (app.globalData.carStyle) {
        clearTimeout(carStyleOut);
        if (options.id){
          var carStyleArr = app.globalData.carStyleArr;
          for (var i in carStyleArr){
            if (carStyleArr[i].id == that.data.vehicleLevelId){
                that.setData({
                  carStyleIndex:i
                })
                break;
              }
            }
        }
        that.setData({
          carStyle: app.globalData.carStyle,
          carStyleId: app.globalData.carStyleArr[that.data.carStyleIndex].id * 1,
        });
        app.getCarVehicleList(that.data.carStyleId);
        var carVehicleOut = setInterval(function () {
          if (app.globalData.carVehicle) {
            clearTimeout(carVehicleOut);
            if (app.globalData.carVehicle.length > 0) {
              if(that.data.loveCarId){
                var carVehicleArr = app.globalData.carVehicleArr;
                for (var i in carVehicleArr) {
                  if (carVehicleArr[i].id == that.data.carVehicleId) {
                      that.setData({
                        carVehicleIndex:i
                      })
                      break;
                  }
                }
              }
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
                    if (that.data.loveCarId) {
                      var carListArr = app.globalData.carListArr;
                      for (var i in carListArr) {
                        if (carListArr[i].id == that.data.carListId) {
                          that.setData({
                            carListIndex: i
                          });
                          break;
                        }
                      }
                    }
                    that.setData({
                      carList: app.globalData.carList,
                      carListId: app.globalData.carListArr[that.data.carListIndex].id * 1,
                    });
                    that.getCars(that.data.carListId,true);
                  } else {
                    that.setData({
                      carList: [],
                      carListId: -1,
                    });
                  }
                  app.globalData.carList = "";
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
    var deaTime = setInterval(function () {
      if (app.globalData.carDis) {
        clearTimeout(deaTime);
        var carDisAddr = app.globalData.carDisAddr;
        if (options.id) {
          var index = 0;
          for (var i in carDisAddr) {
            if (carDisAddr[i].id == that.data.dealerId) {
              index = i;
              break;
            }
          }
          that.setData({
            carDisIndex: index
          })
        }
        that.setData({
          carDis: app.globalData.carDis,
          carDisId: app.globalData.carDisAddr[that.data.carDisIndex].id * 1,
        })
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
  },

  bingDis: function (e) {
    var that = this;
    var carDisIndex = e.detail.value;
    that.setData({
      carDisIndex: carDisIndex,
      carDisId: app.globalData.carDisAddr[carDisIndex].id * 1,
      carListIndex:0
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
            carListIndex:0,
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
                that.getCars(that.data.carListId);
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
      carListIndex:0,
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
          that.getCars(that.data.carListId);
        } else {
          that.setData({
            carList: [],
            carListId: -1,
          });
        }
        app.globalData.carList = '';
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
    that.getCars(that.data.carListId);
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
  formSubmit: function (e) {
    var that = this;
    if (!that.data.ajaxStatus) {
      return;
    }
    var msg = e.detail.value;
    var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
    if (msg.licensePlate == "" || !express.test(msg.licensePlate)) {
      wx.showToast({
        title: '车牌号不正确',
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
      id: that.data.loveCarId,
      name:  that.data.cars[that.data.carsIndex],
      categoryId: that.data.carVehicleId,
      vehicleId: that.data.carListId,
     // carListId: that.data.carListId,
      engineCode: msg.engineCode,
      vin: msg.vin,
      licensePlate: msg.licensePlate,
     // cityId: that.data.cityId,
      VehicleModelId: that.data.carsId,
      dealerId: that.data.carDisId,
      firstLicenseDate: that.data.date,
      purchaseDate: that.data.loginDate,
      contactName: wx.getStorageSync("realName"),
      contactTel: wx.getStorageSync("phone"),
      accountId: wx.getStorageSync("userId"),
      sessionId: wx.getStorageSync('sessionId'),
      formId: e.detail.formId,
      VehicleLevelId:that.data.carStyleId
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
          wx.setStorageSync('hasVehicle', true);
          wx.redirectTo({
            url: '/pages/afterSale/mycar/index'
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

  getCars: function(carid,status=false){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicleModel/GetActiveList?vehicleId=' + carid,
      method: 'post',
      success: function (res) {
        if (res.data.success) {
          var result = res.data.result;
          var a = [];
          var b = [];
          var index = 0;
          for (var i = 0; i < result.length; i++) {
            a[i] = result[i].name;
            b[i] = result[i];
          }
          if (status){
            for(var i in b){
              if (that.data.carsId == b[i].id){
                index = i;
                app.getDealer('');
                break;
              }
            }
          }
          var carListId = b[index].id * 1;
          that.setData({
            cars: a,
            carsArr: b,
            carsIndex: index,
            carsId: carListId,
            loadStatus: false
          });
        }
      },
    })
  },
  bingCars:function(e){
    var that = this;
    var carsIndex = e.detail.value;
    that.setData({
      carsIndex: carsIndex,
      carsId: that.data.carsArr[carsIndex].id,
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  plateInput:function(t){
    var vehicleNumber = t.detail.value
    if (vehicleNumber.length == 7 ){
      var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
      var result = express.test(vehicleNumber);
      if (!result){
        wx.showToast({
          title: '车牌号输入不正确',
          icon: 'none',
          duration: 1500
        })      
      }
    }else{
      wx.showToast({
        title: '车牌号输入不正确',
        icon: 'none',
        duration: 1500
      })     
    }
  },
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