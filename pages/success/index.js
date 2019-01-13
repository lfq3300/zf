// pages/success/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:"提交成功",
    status:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.msg){
      this.setData({
        msg:options.msg
      })
    }
    if (options.status) {
      this.setData({
        status: false
      })
    }
    wx.loadFontFace({
      family: "MYingHeiPRC-W3",
      source: 'url("https://sungd.github.io/Pacifico.ttf")',
      success(res) {
        console.log('success')
        console.log(res);
        console.log(res.status)
      },
      fail: function (res) {
        console.log('fail')
        console.log(res);
        console.log(res.status)
      },
      complete: function (res) {
        console.log('complete')
        console.log(res);
        console.log(res.status)
      }
    });
    // setTimeout(function () {
    //   wx.switchTab({
    //     url: '/pages/index/index'
    //   })
    // }, 3000)
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