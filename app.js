App({
  /*
    用户进来后发起微信授权 必须授权获取到用户信息后才可以
  */
  data: {
    hostUrl: "https://zungfu.azurewebsites.net/",
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
              console.log(res);
              if (res.statusCode == 200 && res.data.success) {
                wx.setStorageSync('sessionId', res.data.result);
                if (wx.getStorageSync('userId').length == 0) {
                  console.log('1233')
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
            addrs[i] = c;
          }
          that.globalData.carDis = jsx;
          that.globalData.carDisAddr = addrs;
        }
      },
    })
  },

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
        console.log(res)
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
});