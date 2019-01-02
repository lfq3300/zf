var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:[

    ],
    tagIndex:0,
    brandId:0,
    carList:[

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicleLevel/GetActiveList',
      method: 'post',
      success: function (res) {
        console.log(res);
        if (res.data.success){
          var tag = res.data.result;
          var tagIndex =  tag[0].id;
          that.setData({
            tag: tag,
            tagIndex: tagIndex,
          })
          wx.request({
            url: app.data.hostUrl + 'api/services/app/vehicleCategory/GetActiveListByParentId?levelId=' + tagIndex,   
            method: 'post',
            success: function (res) {
                if(res.data.success){
                  var brandId = res.data.result[0].brandId;
                  that.setData({
                    carList: res.data.result,
                    brandId: brandId
                  })
                }
            }
          });
        }
      }
    });
     wx.hideNavigationBarLoading();
     wx.stopPullDownRefresh();
  },

  bindcarlevel:function(e){
    console.log(e.target.dataset.id);
    this.setData({
      tabId: e.target.dataset.id
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
   * 页面下拉刷新
   */
  onPullDownRefresh:function(){
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