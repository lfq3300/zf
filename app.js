App({
  /*
    用户进来后发起微信授权 必须授权获取到用户信息后才可以
  */
  data: {
    hostUrl: "https://zungfu2.azurewebsites.net/",
    appid: "wx4d69fe23e65ae0ca",
    appKey: "f3ee574e618801a984354749b2657b21",
  },
  globalData:{
    appcode: "",
    carDis:"",
    carDisAddr:""
  },
  onLaunch: function() {
    this.ifUserLogin();
    this.getUserAddsInfo();
  },

  /*判断用户是否登陆*/
  ifUserLogin: function(e) {
    var that = this;
    if (wx.getStorageSync('sessionId').length == 0) {
      wx.login({
        success: function(res) {
          var code = res.code;
          wx.request({
            url: that.data.hostUrl + 'api/MiniApp/wechatoauth',
            data: {
              code: code
            },
            method: 'post',
            success: function(res) {
              if (res.statusCode == 200 && res.data.success) {
                wx.setStorageSync('sessionId', res.data.result);
                if (wx.getStorageSync('userId').length == 0) {
                  wx.navigateTo({
                    url: "/pages/login/index"
                  })
                }
              }
            }
          })
        }
      })
    }


  },

  //获取经销商
  getDealer: function (id) {
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/services/app/dealer/GetActiveListByVehicleId',
      data: {
        vehicleId: id
      },
      method: 'post',
      success: function (res) {
        if (res.data.success){
          var data = res.data.result;
          data = that.sortAddres(data);
          var jsx = [];
          var addrs = [];
          for (var i = 0; i < data.length; i++) {
            jsx[i] = data[i].name;
            var c = {};
            c.latitude = data[i].latitude;
            c.longitude = data[i].longitude;
            c.tel = data[i].tel;
            c.address = data[i].address;
            c.id = data[i].id;
            c.name = data[i].name;
            addrs[i] = c;
          }
          that.globalData.carDis = jsx;
          that.globalData.carDisAddr = addrs;
        }
      },
    })
  },
  //根据地址获取经销商
  getAddrDealer:function(addr){
    var that = this;
    wx.request({  
      url: that.data.hostUrl + 'api/services/app/dealer/GetActiveListByCity?city=' + addr + "&accountId=" + wx.getStorageSync('userId'),
      method: 'post',
      success: function (res) {
        if (res.data.success) {
          var data = res.data.result;

          data = that.sortAddres(data);
          var jsx = [];
          var addrs = [];
          for (var i = 0; i < data.length; i++) {
            jsx[i] = data[i].name;
            var c = {};
            c.latitude = data[i].latitude;
            c.longitude = data[i].longitude;
            c.tel = data[i].tel;
            c.address = data[i].address;
            c.id = data[i].id;
            c.name = data[i].name;
            addrs[i] = c;
          }
          that.globalData.carAddrDis = jsx;
          that.globalData.carAddrDisAddr = addrs;
        }
      },
    })
  },

  //获取当前经纬度

  Rad: function (d) {
    return d * Math.PI / 180.0;  /*经纬度转换成三角函数中度分表形式。*/
  },
  GetDistance: function (lat1, lng1, lat2, lng2) {
    var that = this;
    var radLat1 = that.Rad(lat1);
    var radLat2 = that.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = that.Rad(lng1) - that.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000; //输出为公里
    return s;
  },
  //地址排序
  sortAddres: function (data) {
    var that = this;
    var latitude = that.globalData.latitude;
    var longitude = that.globalData.longitude;
    var distance = [];
    for (var i = 0; i < data.length; i++) {
      var c = {};
      c.aindex = i;
      c.distance = that.GetDistance(latitude, longitude, data[i].latitude, data[i].longitude);
      distance[i] = c;
    }
    var max;
    for (var i = 0; i < distance.length; i++) {
      for (var j = i; j < distance.length; j++) {
        if (distance[i].distance > distance[j].distance) {
          max = distance[j];
          distance[j] = distance[i];
          distance[i] = max;
        }
      }
    }
    var newData = [];
    for (var i = 0; i < distance.length; i++) {
      newData[i] = data[distance[i].aindex]
    }
    return newData;
  },
  //获取用户地址信息
  getUserAddsInfo: function () {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.globalData.latitude = res.latitude;
        that.globalData.longitude = res.longitude;
        that.getLocal(res.latitude, res.longitude)
      }
    })
  },

  //通过腾讯地图解析当前地址
  getLocal: function (latitude, longitude){
    var that = this;
    var locationString = latitude + "," + longitude;
        wx.request({
          url: 'http://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            "key": "ILEBZ-F4KC4-QSBU6-DK5J3-H7W6S-3MFLO",
            "location": locationString
          },
          method: 'GET',
          success: function (res) {
            that.globalData.loadcity = res.data.result.address_component.city;
          }
        })
  },
  //获取手机验证码
  getPhoneCode:function(phone){
    var that = this;
    if(!that.isPoneAvailable(phone)){
      wx.showToast({
        title: '电话号码输入有误',
        icon: 'none',
        duration: 1500
      })
      return true;
    };
    wx.request({
      url: that.data.hostUrl + 'api/services/app/common/GenerateCode',
      data: {
        phone: phone
      },
      method: 'get',
      success: function (res) {
      }
    });
  },

  //获取预约时间
  getAppointment:function(){
      var that = this;
      wx.request({
        url: that.data.hostUrl + '/api/services/app/globalInformation/GetListByType?type=2',
        method: "post",
        success: function (res) {
          if (res.data.success) {
            var result = res.data.result;
            var a = [];
            var b = [];
            for (var i = 0; i < result.length; i++) {
              a[i] = result[i].name;
              b[i] = result[i];
            }
            that.globalData.timeAppointment = a;
            that.globalData.timeAppointmentArr = b
          }
        }
      })
  },
  isPoneAvailable: function (pone) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
      return false;
    } else {
      return true;
    }
  },
  isPoneCodeAvailable: function (code) {
    var myreg = /^\d{6}$/;
    if (!myreg.test(code)) {
      return false;
    } else {
      return true;
    }
  },
  isEmailAvailable: function (email) {
    var myreg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (!myreg.test(email)) {
      return false;
    } else {
      return true;
    }
  },
  //获取车款
  getCarStyleList:function(){
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/services/app/vehicleLevel/GetActiveList',
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
          that.globalData.carStyle = a;
          that.globalData.carStyleArr = b
        }
      }
    });
  },
  //获取车型
  getCarVehicleList: function (id){
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/services/app/vehicleCategory/GetActiveListByParentId?levelId=' + id,
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
          that.globalData.carVehicle = a;
          that.globalData.carVehicleArr = b;
        }
      }
    });
  },
  //获取车型
  getCarList: function (id) {
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/services/app/vehicle/GetActiveList?categoryId=' + id,
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
          that.globalData.carList = a;
          that.globalData.carListArr = b;
        }
      }
    });
  },
  //获取城市 
  getCity:function(){
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/services/app/globalInformation/GetListByType?type=1',
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
          that.globalData.city = a;
          that.globalData.cityArr = b;
        }
      }
    });
  },
  
  //获取维修项目
  getWxType:function(){
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/services/app/globalInformation/GetListByType?type=10',
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
          that.globalData.carWx = a;
          that.globalData.carWxArr = b;
        }
      }
    });
  },
  
  //判断跳转页面
  jumpPageUserInfo: function (url,options){
    var str = "";
    for (var key in options) {
      console.log(options[key]);
      str += key + "=" + options[key]+"&"
    }
    if(str){
      str = "&" + str;
    }
    if (!wx.getStorageSync("hasPersonal")) {
      wx.navigateTo({
        url: "/pages/userCenter/msg/index?pageurl=" + url + str
      })
    }
  }
});