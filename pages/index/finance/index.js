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
    carTimeIndex: 0,
    loginhidde: true,
    jrhidde:false,
    carListIndex: 0,
    carListId: 0,
    switchpageIndex: 1,
    speed: 20,
    viewspeed:1,
    shoufu: 0,
    yg: 0,
    xxhx:[],
    carsel:0,
    windowWidth:0,
    viewwidth:0,
    viewleft: 0,
    financ:true,
    maximumFinancingPct:0
  },

  carselect:function(e){
    var that = this;
    that.setData({
      carsel: e.target.dataset.id
    })
  },
  bingCarTime: function (e) {
    var that = this;
    var carTimeIndex = e.detail.value;
    that.setData({
      carTimeIndex: carTimeIndex,
      jrhidde: true,
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
          var xxhx = [];
         
          that.setData({
            loginhidde: false,
            carList: a,
            carListArr: b,
            carListId: carListId,
            carPrice: carPrice,
            jrhidde: true,
          });
          that.getXxhx(b[0]);
          that.getGetById();
        }
      }
    });

  },
  getXxhx:function(car){
    var that = this;
    var xxhx =[];
    console.log(car);
    if (parseInt(car.agility_LowDP)>1) {
      xxhx.push({
        monthlyPay: car.agility_LowDP,
        tname:"预付款",
        name:"低预付"
      })
    }
    if (parseInt(car.agility_Express)>1){
      xxhx.push({
        monthlyPay: car.agility_Express,
        tname:"月付款人民币",
        name: "星时享"
      })
    }
    var switchpageIndex = 2;
    if (xxhx.length>0){
       switchpageIndex = 1;
    }
    console.log(xxhx)
    that.setData({
      xxhx: xxhx,
      switchpageIndex: switchpageIndex
    })
  },
  getGetById: function (car) {
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
            that.setData({
              jrhidde: true,
              financial: data
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
      carTimeIndex:0,
      jrhidde: true,
      speed: 20,
      viewspeed: 1,
    });
    that.getGetById();
    that.getXxhx(that.data.carListArr[carListIndex]);
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
    viewspeed = viewspeed / that.data.viewwidth * 100;
    if (viewspeed < 1) {
      viewspeed = 1;
    };
    if (viewspeed > 100){
      viewspeed = 100;
    }
    var speed = parseInt(viewspeed / 3.3)+20;
    
    if (speed > 50) {
      speed = 50;
    }else
    if (speed < 30) {
      speed = 20;
    }else
    if (speed < 40){
      speed = 30;
    }else
    if (speed < 50) {
      speed = 40;
    }
    if (that.data.maximumFinancingPct < speed){
      speed = that.data.maximumFinancingPct;
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
  getfinancial: function () {
    var that = this;
    var financial = that.data.financial; //当前方案
    var maximumFinancingPct = 0;
    for (var i in financial) {
      if (financial[i].maximumFinancingPct > maximumFinancingPct){
        maximumFinancingPct = financial[i].maximumFinancingPct;
      }
    }
    var thatcar = that.data.carListArr[that.data.carListIndex]; //当前车辆信息 的价格 
    var price = thatcar.price*10000; //售价
    var speed = that.data.speed; //当前首付百分百
    //首付
    var shoufu = price * speed / 100
    price = (price - shoufu)*-1;
    var time = that.data.carTime[that.data.carTimeIndex]; //当前账期
    var financialPlanDetails = "";
    for (var i in financial){
      if (speed <= financial[i].maximumFinancingPct){
        financialPlanDetails = financial[i].financialPlanDetails;
          break;
      }
    }
    var financ = "";
    if (financialPlanDetails){
      for (var i in financialPlanDetails) {
        if (time == financialPlanDetails[i].maxTerm || time == financialPlanDetails[i].minTerm){
            financ = financialPlanDetails[i];
            break;
        }
      }
    };
    if (financ){
      var pric = that.pmr(financ.perentage/12/100, parseInt(time), price,0,0);
      that.setData({
        shoufu: (shoufu / 10000).toFixed(2),
        yg: parseInt(pric),
        financ: true,
        jrhidde:false,
        maximumFinancingPct: maximumFinancingPct
      })
    }else{
      that.setData({
        financ: false,
        jrhidde:false,
        maximumFinancingPct: maximumFinancingPct
      })
    }
  },
  pmr: function (rate, nper, pv, ifv, itype) {
    const DECIMAL = 8;
    let fv = ifv;
    let type = itype;
    if (!fv) fv = 0;
    if (!type) type = 0;
    if (nper <= 0) return -(pv + fv);
    if (rate <= 0) return -(pv + fv) / nper;
    let pvFactorSum = 0;
    for (let i = 0; i < nper; i++) {
      pvFactorSum += parseFloat(Math.pow(1 + rate, -((i + 1) - type)).toFixed(DECIMAL));
    }

    const fvPresent = fv * parseFloat(Math.pow(1 + rate, (-nper)).toFixed(DECIMAL));
    let pmt;
    if (pvFactorSum) { pmt = -(pv + fvPresent) / pvFactorSum; }
    return Math.round(pmt).toFixed(0);
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