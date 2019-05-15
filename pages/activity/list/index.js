// pages/activity/list/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginhidde:true,
    tag: [
    
    ],
    tagIndex:1,
    activityList:[],
    statuscode: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.ifUserLogin();
    var that = this;
    that.getActivityType();
  },
  getActivityType:function(){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/globalInformation/GetListByType?type=7',
      method: "post",
      success: function (res) {
        var tag = res.data.result;
        var newTag = [];
        for (var i in tag){
          if (tag[i].isActive){
            newTag.push({
              "name": tag[i].name,
              "status": tag[i].value
            });
          }
        }
        that.setData({
          statuscode: newTag[0].status,
          tag: newTag
        })
        that.getActivityList(newTag[0].status);
      }
    });
  },
  
  getActivityList: function (statuscode){
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/activity/GetActiveList',
      method: "post",
      data: { status: statuscode },
      success: function (res) {
        if(res.data.success){
          that.setData({
            activityList: res.data.result,
            loginhidde: false
          })
        }
      }
    })
  },
  getActivity:function(e){
    var that = this;
    var tagIndex = e.target.dataset.index;
    console.log(tagIndex);
    console.log(that.data.tag);
    var status = that.data.tag[tagIndex].status;
    that.setData({
      tagIndex: tagIndex,
      statuscode: status,
    });
    that.getActivityList(status);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})