var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    carDis: [
     
    ],
    carDisIndex: 1,
    carDisId:'',
    imgUrl:"",
    carname:"",
    carnameid:"",
    name:"",
    carid:"",
    phone:"",
    getcodetext:"获取验证码",
    getcodeStatus:true
  },

  getPhoneCode:function(){
    var that = this;
    var status = app.getPhoneCode(that.data.phone);
    if (status){
      return;
    }

    if (!that.data.getcodeStatus){
      return;
    }
    that.setData({
      getcodeStatus: false
    })
    var downTime = 60; 
    var downTimeOut = setInterval(function(){
      downTime --;
      var getcodetext  = "";
      if (downTime == 0 ){
        getcodetext = "获取验证码";
        that.setData({
          getcodeStatus: true
        })
        clearTimeout(downTimeOut);
        downTime = 60
      }else{
          getcodetext =  downTime+"s"
      }
      that.setData({
        getcodetext: getcodetext
      })
    },1000)
  },
  bingDis:function(e){
    var that = this;
    var carDisIndex = that.data.carDisIndex;
    that.setData({
      carDisIndex: e.detail.value,
      carDisId: app.globalData.carDisAddr[carDisIndex].id * 1,
    })
  },
  phoneInput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },

  /*
  提交表单事件
  */
  formSubmit:function(e){
    var data = {
      accountId: wx.getStorageSync("userId"),
      contactName: msg.contactName,
      tel: msg.tel,
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.getDealer(options.id);
    var deaTime = setInterval(function(){
      if (app.globalData.carDis){
        clearTimeout(deaTime);
        that.setData({
          carDis: app.globalData.carDis,
        })
      }
    },1000);
    that.setData({
      imgUrl: options.url,
      carname: options.carname,
      name: options.name,
      carnameid: options.carnameid,
      carid: options.id
    });

    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
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
    that.onLoad();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})