// pages/userCenter/msg/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    getcodetext: "获取验证码",
    getcodeStatus: true,
    ajaxStatus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      phone: wx.getStorageSync('phone'),
      LastName: wx.getStorageSync('LastName'), 
      FirstName: wx.getStorageSync('FirstName'), 
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
  formSubmit:function(e){
    var that = this;
    if (!that.data.ajaxStatus) {
      return;
    }
    var msg = e.detail.value;
    if (msg.FirstName == "") {
      wx.showToast({
        title: '姓不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    if (msg.LastName == "") {
      wx.showToast({
        title: '名不能为空',
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
    that.setData({
      ajaxStatus: false
    })
    var data = {
      "accontId": wx.getStorageSync("userId"),
      "phone": msg.phone,
      "FirstName": msg.FirstName,
      "LastName": msg.LastName,
      "code": msg.code
    }
    wx.request({
       url: app.data.hostUrl +'api/services/app/account/UpdateAccount',
       data:data,
       method: "post",
       success:function(res){
         console.log(res);
         that.setData({
           ajaxStatus: true,
         })
         if (res.data.success) {
           wx.setStorageSync('hasPersonal', true);
           wx.setStorageSync('phone', msg.phone);
           wx.setStorageSync('FirstName', msg.FirstName);
           wx.setStorageSync('LastName', msg.LastName);
           wx.setStorageSync('realName', msg.FirstName + "" + msg.LastName);
           
           if (wx.getStorageSync("callbackurl")){
             wx.redirectTo({
               url: wx.getStorageSync("callbackurl")
             })
           }else{
             wx.switchTab({
               url:"/pages/userCenter/index"
             })
           }
         } else {
           wx.showToast({
             title: res.data.error.message,
             icon: 'none',
             duration: 2000
           })
         }
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
    //this.onLoad();
    app.ifUserLogin();
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