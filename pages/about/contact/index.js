  // pages/about/contact/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginhidde:true,
    mapstatus: false,
    mapIndex:0,
    latitude:"",
    longitude:"",
    carDisIndex:0,
    address:"",
    tel:"",
    erTel:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.getDealer(1);
    var that =this;
    var deaTime = setInterval(function () {
      if (app.globalData.carDis) {
        clearTimeout(deaTime);
        var carDisAddr = app.globalData.carDisAddr;
        console.log(carDisAddr[0]);
        var c = that.bdMap_to_txMap(carDisAddr[0].longitude,carDisAddr[0].latitude);
        carDisAddr[0].latitude = c.lat;
        carDisAddr[0].longitude = c.lng;
        console.log(carDisAddr[0]);
        that.setData({
          carDis: app.globalData.carDis,
          carDisAddr: carDisAddr,
          latitude: carDisAddr[0].latitude,
          longitude: carDisAddr[0].longitude,
          address: carDisAddr[0].address,
          tel: carDisAddr[0].tel,
          servicePhone: carDisAddr[0].servicePhone,
          isSalesDealer: carDisAddr[0].isSalesDealer,
          isServiceDealer: carDisAddr[0].isServiceDealer,
          markers:[{
            latitude: carDisAddr[0].latitude,
            longitude: carDisAddr[0].longitude,
            iconPath: '../../../images/location.png',
            height: 37,
            width: 28,
          }]
        })
        that.setData({
          mapstatus: true,
          loginhidde:false
        })
      }
    }, 1000);
  },

  callphone: function (e) {
    var that = this;
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.tel
    })
  },
  bdMap_to_txMap: function (lng, lat){
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta);
    let lats = z * Math.sin(theta);
    return {
      lng: lngs,
      lat: lats
    }
  },
  bingDis:function(e){
    var that = this;
    that.setData({
      mapstatus: false
    })
    var carDisIndex = e.detail.value;
    var carDisAddr = that.data.carDisAddr;
    var c = that.bdMap_to_txMap(carDisAddr[carDisIndex].longitude, carDisAddr[carDisIndex].latitude);
    carDisAddr[carDisIndex].latitude = c.lat;
    carDisAddr[carDisIndex].longitude = c.lng;
    that.setData({
      carDisIndex: carDisIndex,
      latitude: carDisAddr[carDisIndex].latitude ,
      longitude: carDisAddr[carDisIndex].longitude ,
      address: carDisAddr[carDisIndex].address,
      tel: carDisAddr[carDisIndex].tel,
      servicePhone: carDisAddr[carDisIndex].servicePhone,
      isSalesDealer: carDisAddr[carDisIndex].isSalesDealer,
      isServiceDealer: carDisAddr[carDisIndex].isServiceDealer,
      markers: [{
        latitude: carDisAddr[carDisIndex].latitude,
        longitude: carDisAddr[carDisIndex].longitude,
        iconPath: '../../../images/location.png',
        address: carDisAddr[carDisIndex].address,
        tel: carDisAddr[carDisIndex].tel,
        height: 37,
        width: 28,
      }]
    })
    that.setData({
      mapstatus: true
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