// pages/UserCenter/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userinfo');
    var that = this;
    that.setData({
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      gender: userInfo.gender == 1 ? "男" : "女",
      loginhidde: false
    });
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  cl:function(){
    wx.clearStorageSync();
    wx.showLoading({
      title: '清除缓存...',
      mask: true,
      icon: 'loading',
    });
    setTimeout(function(){
      app.ifUserLogin();
    },2000)
  },
  jumplovecar:function(e){

    if (!wx.getStorageSync('hasPersonal')) {
      wx.showModal({
        title: '提示',
        content: '请先完善个人信息',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/userCenter/msg/index"
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else{
      wx.navigateTo({
        url: e.target.dataset.url
      })
    }
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
    app.ifUserLogin();
    this.onLoad();
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