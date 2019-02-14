var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carDis: [],
    carDisIndex: 0,
    carDisId:'',
    imgUrl:"",
    carname:"",
    carnameid:"",
    name:"",
    carid:"",
    phone:"",
    getcodetext:"获取验证码",
    getcodeStatus:true,
    ajaxStatus:true,
    loginhidde:false,
    cityIndex:0,
    cityId:0,
    carListIndex:0
  },

  bingDis:function(e){
    var that = this;
    var carDisIndex = e.detail.value;
    that.setData({
      carDisIndex: carDisIndex,
      carDisId: app.globalData.carAddrDisAddr[carDisIndex].id * 1,
    })
  },
  

  /*
  提交表单事件
  */
  formSubmit:function(e){
    var that = this;
    if(!that.data.ajaxStatus){
      return;
    }
    var msg = e.detail.value;
   
    var data = {
      accountId: wx.getStorageSync("userId"),
      contactName: wx.getStorageSync("realName"),
      contactTel: wx.getStorageSync("phone"),
      categoryId: that.data.carnameid,
      categoryIdName: that.data.carname,
      vehicleId: that.data.carid,
      dealerId: that.data.carDisId,
      dealerIdName: that.data.carDis[that.data.carDisIndex],
      description: msg.description,
      sessionId: wx.getStorageSync('sessionId'),
      fromId: "appointment",
      cityId:that.data.cityId,
      vehicleModelId:that.data.carListId
    };
    that.setData({
      ajaxStatus:false
    })
    wx.request({
      url: app.data.hostUrl + 'api/services/app/quickQuota/SubmitQuickQuota',
      data: data,
      method: 'POST',
      success: function (res) {
        that.setData({
          ajaxStatus: true,
        })
        if (res.data.success) {
          wx.redirectTo({
            url: "/pages/success/index?msg=您的询价需求已经收到"
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!app.jumpPageUserInfo(that.route, options)) {
      return;
    }
    that.setData({
      imgUrl: options.url,
      carname: options.carname,
      name: options.name,
      carnameid: options.carnameid,
      carid: options.id
    });
    that.onInfo(options.id);
  },
  onInfo:function(id){
    var that = this;
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
          app.getAddrDealer(vcity);
          var deaTime = setInterval(function () {
            if (app.globalData.carAddrDisAddr) {
              clearTimeout(deaTime);
              that.setData({
                carDis: app.globalData.carAddrDis,
                carDisIndex:0,
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
  bingCar:function(e){
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
    app.getAddrDealer(that.data.city[cityIndex]);
    var deaTime = setInterval(function () {
      if (app.globalData.carAddrDisAddr) {
        clearTimeout(deaTime);
        that.setData({
          carDis: app.globalData.carAddrDis,
          carDisIndex:0,
          carDisId: app.globalData.carAddrDisAddr[0].id * 1,
          ajaxstatus: true
        })
        app.globalData.carAddrDisAddr = '';
      }
    }, 1000);
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