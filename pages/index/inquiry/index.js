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
  },

  getPhoneCode:function(){
    var that = this;
    if (!that.data.getcodeStatus) {
      return;
    }
    var status = app.getPhoneCode(that.data.phone);
    if (status){
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
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bingDis:function(e){
    var that = this;
    var carDisIndex = that.data.carDisIndex;
    that.setData({
      carDisIndex: e.detail.value,
      carDisId: app.globalData.carDisAddr[carDisIndex].id * 1,
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
    var data = {
      accountId: wx.getStorageSync("userId"),
      contactName: msg.contactName,
      contactTel: msg.phone,
      categoryId: that.data.carnameid,
      categoryIdName: that.data.carname,
      vehicleId: that.data.carid,
      dealerId: that.data.carDisId,
      dealerIdName: that.data.carDis[that.data.carDisIndex],
      description: msg.description,
      sessionId: wx.getStorageSync('sessionId'),
      fromId: "appointment",
      code:msg.code
    }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
    app.getDealer(id);
    var deaTime = setInterval(function () {
      if (app.globalData.carDis) {
        clearTimeout(deaTime);
        that.setData({
          carDis: app.globalData.carDis,
          carDisId: app.globalData.carDisAddr[that.data.carDisIndex].id * 1,
        })
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
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