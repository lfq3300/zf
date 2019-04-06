// pages/opinion/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ajaxStatus:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  formSubmit:function(e){

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

  formSubmit:function(e){
    var that = this;
    if (!that.data.ajaxStatus) {
      return;
    }
    var msg = e.detail.value;
    if (msg.msg == "") {
      wx.showToast({
        title: '提交意见不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    }

    var data = {
      accountId: wx.getStorageSync("userId"),
      description: msg.msg,
      sessionId: wx.getStorageSync('sessionId'),
      fromId: e.detail.fromId,
    };
    that.setData({
      ajaxStatus: false
    })

    wx.request({
      url: app.data.hostUrl + 'api/services/app/comment/SubmitComment',
      data: data,
      method: 'POST',
      success: function (res) {
        that.setData({
          ajaxStatus: true,
        })
        if (res.data.success) {
          wx.redirectTo({
            url: "/pages/success/index?msg=您的反馈意见已经收到"
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