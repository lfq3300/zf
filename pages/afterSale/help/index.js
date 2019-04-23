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
    app.getLocal(app.globalData.latitude, app.globalData.longitude)
    app.getCity();
    var cityOut = setInterval(function () {
      if (app.globalData.city) {
        clearTimeout(cityOut);
        if (app.globalData.city.length > 0) {
          console.log(app.globalData);
          console.log(app.globalData.city);
          that.setData({
            city: app.globalData.city,
            loginhidde: false
          });
          var pagecity = app.globalData.city;
          var vcity = "";
          var index = 0;
          var loadcity = wx.getStorageSync('loadcity');
          console.log(loadcity);
          for (var i = 0; i < pagecity.length; i++) {
            if (pagecity[i] == loadcity) {
              vcity = pagecity[i];
              index = i;
              break;
            } else {
              vcity = pagecity[0];
            }
          }
          that.setData({
            cityIndex:index
          })
          app.getERDealerAsync(vcity);
          var deaTime = setInterval(function () {
            if (app.globalData.carAddrDisAddr) {
              clearTimeout(deaTime);
              var carDisAddr = app.globalData.carAddrDisAddr;
              // var newcarDisAddr = [];
              // for (var i in carDisAddr){
              //   if (carDisAddr[i].isER){
              //     newcarDisAddr.push(carDisAddr[i]);
              //   }
              // }
              that.setData({
                carDisAddr: carDisAddr,
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
    app.getERDealerAsync(that.data.city[cityIndex]);
    var deaTime = setInterval(function () {
      if (app.globalData.carAddrDisAddr) {
        clearTimeout(deaTime);
        var carDisAddr = app.globalData.carAddrDisAddr;
        // var newcarDisAddr = [];
        // for (var i in carDisAddr) {
        //   if (carDisAddr[i].isER) {
        //     newcarDisAddr.push(carDisAddr[i]);
        //   }
        // }
        that.setData({
          carDisAddr: carDisAddr,
          ajaxstatus:true
        })
        app.globalData.carAddrDisAddr = '';
      }
    }, 1000);
  },
  callphone: function (e) {
    var that = this;
    var name = wx.getStorageSync('FirstName') + wx.getStorageSync('LastName');
    var myDate = new Date();
    var mo = myDate.getMonth() + 1 ;
    var time = myDate.getFullYear() + "-" + mo+ "-" + myDate.getDate() + " " + myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
    wx.request({
      url: app.data.hostUrl + 'api/services/app/records/SubmitRecordAsync',
      data: {
        "name": name,
        "content": name + "于" + time + "拨打了 " + that.data.carDisAddr[that.data.carDisIndex].name +" 经销商电话",
        "dealerId": that.data.carDisAddr[that.data.carDisIndex].id,
        "accountId": wx.getStorageSync('userId'),
        "tel": e.target.dataset.tel
      },
      method: 'post',
      success: function (res) {
        wx.makePhoneCall({
          phoneNumber: e.target.dataset.tel
        });
      },
      fail:function(){
        wx.makePhoneCall({
          phoneNumber: e.target.dataset.tel
        });
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