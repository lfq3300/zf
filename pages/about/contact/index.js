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
        that.setData({
          carDis: app.globalData.carDis,
          carDisAddr: carDisAddr,
          latitude: carDisAddr[0].latitude,
          longitude: carDisAddr[0].longitude,
          address: carDisAddr[0].address,
          tel: carDisAddr[0].tel,
          erTel: carDisAddr[0].erTel,
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

  bingDis:function(e){
    var that = this;
    that.setData({
      mapstatus: false
    })
    var carDisIndex = e.detail.value;
    var carDisAddr = that.data.carDisAddr;
    that.setData({
      carDisIndex: carDisIndex,
      latitude: carDisAddr[carDisIndex].latitude,
      longitude: carDisAddr[carDisIndex].longitude,
      address: carDisAddr[carDisIndex].address,
      tel: carDisAddr[carDisIndex].tel,
      erTel: carDisAddr[carDisIndex].erTel,
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