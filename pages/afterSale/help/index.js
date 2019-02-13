// pages/afterSale/help/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carDisIndex: 0,
    tel: 0,
    loginhidde: true,
    cityIndex: 0,
    city: [],
    ajaxstatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getCity();
    var cityOut = setInterval(function () {
      if (app.globalData.city) {
        clearTimeout(cityOut);
        if (app.globalData.city.length > 0) {
          that.setData({
            city: app.globalData.city,
            loginhidde: false
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
                carDisAddr: app.globalData.carAddrDisAddr,
                ajaxstatus:true
              });
              app.globalData.carAddrDisAddr = '';
            }
          }, 1000);
        }
      }
    }, 1000);

  },
  // getLocation:function(){
  //   wx.getLocation({
  //     success: function(res) {
  //       console.log(res)
  //     },
  //   })
  // },
  bingDis: function (e) {
    var that = this;
    var carDisIndex = e.detail.value;
    that.setData({
      carDisIndex: carDisIndex,
      carDisId: app.globalData.carDisAddr[carDisIndex].id * 1,
      tel: app.globalData.carDisAddr[carDisIndex].tel,
    });
  },
  bingCity: function (e) {
    var that = this;
    var cityIndex = e.detail.value;
    that.setData({
      cityIndex: cityIndex,
      ajaxstatus:false
    });
    app.getAddrDealer(that.data.city[cityIndex]);
    var deaTime = setInterval(function () {
      if (app.globalData.carAddrDisAddr) {
        clearTimeout(deaTime);
        that.setData({
          carDisAddr: app.globalData.carAddrDisAddr,
          ajaxstatus:true
        })
        app.globalData.carAddrDisAddr = '';
      }
    }, 1000);
  },
  callphone: function (e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel
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