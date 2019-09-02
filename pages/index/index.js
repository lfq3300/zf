var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tag:[

    ],
    tagIndex:0,
    carList:[

    ],
    tagName:"",
    loginhidde:true,
    ajaxStatus: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //app.ifUserLogin();
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicleLevel/GetActiveList',
      method: 'post',
      success: function (res) {
        if (res.data.success){
          var tag = res.data.result;
          var tagIndex =  tag[0].id;
          var tagName = tag[0].name;
          that.setData({
            tag: tag,
            tagIndex: tagIndex,
            tagName: tagName,
          })
          that.getCarList(tagIndex);
        }
      }
    });
     wx.hideNavigationBarLoading();
     wx.stopPullDownRefresh();
  },

  getCarList:function(id){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicleCategory/GetActiveListByParentId?levelId=' + id,
      method: 'post',
      success: function (res) {
        if (res.data.success) {
          var carList = res.data.result;
          for (var i = 0; i < carList.length;i++){
            carList[i].name = carList[i].name.replace(/\s+/g, "")
            carList[i].prefixName = carList[i].prefixName.replace(/\s+/g, "")
          }
          that.setData({
            carList: carList,
            loginhidde:false,
            ajaxStatus: true,
          })
        }
      }
    });
  },

  bindcarlevel:function(e){
    var that = this;
    var tagIndex = e.target.dataset.id;
    var tagName = e.target.dataset.name;
    that.setData({
      tagIndex: tagIndex,
      tagName: tagName,
      ajaxStatus: false,
    })
    that.getCarList(tagIndex);
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