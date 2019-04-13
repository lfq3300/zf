// pages/index/finance/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "",
    carname: "",
    name: "",
    carnameid: "",
    carid: "",
    carTime: [
      "36",
      "24"
    ],
    carTimeIndex: 1,
    loginhidde: true,
    jrhidde:false,
    carListIndex: 0,
    carListId: 0,
    switchpageIndex: 1,
    speed: 20,
    viewspeed:40,
    shoufu: 0,
    yg: 0,
    xxhx:[],
    carsel:0,
    windowWidth:0,
    viewwidth:0,
    viewleft: 0,
  },

  carselect:function(e){
    var that = this;
    console.log(e);
    that.setData({
      carsel: e.target.dataset.id
    })
  },
  bingCarTime: function (e) {
    var that = this;
    var carTimeIndex = e.detail.value;
    that.setData({
      carTimeIndex: carTimeIndex,
      jrhidde: true
    });
    that.getfinancial();
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
    that.LoInfo();
    wx.getSystemInfo({
      success: function (res) {
        that.data.windowWidth = res.windowWidth;
      }
    });
  },

  LoInfo: function () {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/vehicleModel/GetActiveList?vehicleId=' + that.data.carid,
      method: 'post',
      success: function (res) {
        if (res.data.success) {
          var result = res.data.result;
          var a = [];
          var b = [];
          for (var i = 0; i < result.length; i++) {
            a[i] = result[i].name;
            b[i] = result[i];
          }
          var carListId = b[0].id * 1;
          var carPrice = b[0].price * 1;
          that.setData({
            loginhidde: false,
            carList: a,
            carListArr: b,
            carListId: carListId,
            carPrice: carPrice,
            jrhidde: true,
          });
          that.getGetById();
        }
      }
    });

  },

  getGetById: function () {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/financialPlan/GetActiveList',
      method: 'get',
      data: {
        vehicleModelId:  that.data.carListId
      },
      success: function (res) {
        if (res.data.success) {
          var data = res.data.result;
          if (data.length>0) {
            var leftmsg = '';
            var financialTypeId = '';
            var xxhx = [];
            for (var i = 0; i < data.length; i++) {
              if (data[i].financialTypeId == '100000000') {
                xxhx.push(data[i]);
              } else {
                financialTypeId = data[i].financialTypeId;
              }
            }
            that.setData({
              leftmsg: leftmsg,
              financialTypeId: financialTypeId,
              jrhidde: true,
              xxhx: xxhx
            });
            that.getfinancial();
          }else{
            that.setData({
              jrhidde: false
            })
            wx.showToast({
              title: "没有找到金融方案",
              icon: 'none',
              duration: 3500
            })
            return false;
          }
        }else{
            wx.showToast({
              title: "没有找到金融方案",
              icon: 'none',
              duration: 3500
            })
            return false;
        }
      }
    });
  },
  bingCar: function (e) {
    var that = this;
    var carListIndex = e.detail.value;
    that.setData({
      carListIndex: carListIndex,
      carListId: that.data.carListArr[carListIndex].id * 1,
      carPrice: that.data.carListArr[carListIndex].price * 1,
      jrhidde: true
    });
    that.getGetById();
  },

  switchpage: function (e) {
    var that = this;
    var switchpageIndex = e.target.dataset.index;
    that.setData({
      switchpageIndex: switchpageIndex
    })
  },

  tapstart: function (event){
    this.data.lastX = event.touches[0].pageX*1.5;
   
  },
  tapmove: function (event) {
    var that = this;
    wx.createSelectorQuery().select('#touchview').boundingClientRect(function (rect) {
      that.data.viewwidth = rect.width * 2;
      that.data.viewleft = rect.left;
    }).exec();
    var currentX = event.touches[0].pageX + that.data.viewleft;
    var viewspeed = currentX*2-120;
    console.log(viewspeed);
    console.log(that.data.viewwidth)
    viewspeed = viewspeed / that.data.viewwidth * 100;
    console.log(viewspeed);
    if (viewspeed < 20) {
      viewspeed = 20;
    };
    if (viewspeed > 100){
      viewspeed = 100;
    }
    var speed = parseInt(viewspeed / 2);
    if (speed > 50) {
      speed = 50;
    };
    if (speed < 20) {
      speed = 20;
    }
    that.setData({
      speed: speed,
      viewspeed: viewspeed
    });
    this.data.lastX = currentX
  },
  tapend:function(e){
    var that = this;
    that.setData({
      jrhidde:true
    })
    that.getfinancial();
  },
  
  getfinancial: function (){
    var that = this;
    wx.request({
      url: app.data.hostUrl + '/api/services/app/financialPlan/CalculatePrice',
      method: 'post',
      data: {
        financialTypeId: that.data.financialTypeId,
        vehicleModelId: that.data.carListId,
        downPaymentRatio: that.data.speed,
        period: that.data.carTime[that.data.carTimeIndex],
        price: that.data.carPrice
      },
      success:function(res){
          if(res.data.success){
            that.setData({
              jrhidde: false
            })
            var result = res.data.result;
            if (result.price == 0){
              wx.showToast({
                title: result.name,
                icon: 'none',
                duration: 3500
              })
              return false;
            }else{
              var yg = result.price;
              var shoufu =  that.data.carPrice * that.data.speed /100;
              shoufu = shoufu.toFixed(2);
              that.setData({
                yg: yg,
                shoufu: shoufu,
              })
            }
          }else{
            that.setData({
              jrhidde: false
            })
            wx.showToast({
              title: "没有找到金融方案",
              icon: 'none',
              duration: 3500
            })
            return false;
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