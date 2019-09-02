App({
  /*
    用户进来后发起微信授权 必须授权获取到用户信息后才可以
  */
  data: {
    hostUrl: "https://miniprogramuat.zfchina.com/",
   // hostUrl: "https://miniprogram.zfchina.com/",
    appid: "wx4d69fe23e65ae0ca",
    appKey: "f3ee574e618801a984354749b2657b21",
  },
  globalData:{
    appcode: "",
    carDis:"",
    carDisAddr:""
  },
  onLaunch: function() {
    wx.getStorageInfo({
      success(res) {
      }
    })
    try {
      const res = wx.getStorageInfoSync()
    } catch (e) {
      // Do something when catch error
    }
  //  this.ifUserLogin();
  //  this.getUserAddsInfo();
  },
  /*判断用户是否登陆*/
  ifUserLogin: function(e) {
    var that = this;
    wx.showLoading({
      title: '授权中...',
      mask: true,
      icon: 'loading'
    });
    if (!wx.getStorageSync('userId')) {
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
                  wx.hideLoading();
                    wx.navigateTo({
                      url: "/pages/login/index"
                    })
                  }
              }
            }
          })
        },
        fail:function(res){
        }
      })
    }else{
      wx.hideLoading();
    }


  },
  bdMap_to_txMap: function (lng, lat) {
    let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
    let x = lng - 0.0065;
    let y = lat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    let lngs = z * Math.cos(theta);
    let lats = z * Math.sin(theta);
    return {
      lng: lngs,
      lat: lats
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
            c.erTel = data[i].erTel;
            c.address = data[i].address;
            c.isSalesDealer = data[i].isSalesDealer;
            c.isServiceDealer = data[i].isServiceDealer;
            c.servicePhone = data[i].servicePhone;
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
  //道路救援
  getERDealerAsync:function(city){
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/services/app/dealer/GetERDealerAsync?city=' + city,
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
            c.erTel = data[i].erTel;
            c.isSalesDealer = data[i].isSalesDealer;
            c.isServiceDealer = data[i].isServiceDealer;
            addrs[i] = c;
          }
          that.globalData.carAddrDis = jsx;
          that.globalData.carAddrDisAddr = addrs;
        }
      },
    })
  },
  //根据地址和车型获取经销商
  getAddrDealerAndVehicleId: function (addr,vehicleId = 1) {
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/services/app/dealer/GetSalesDealerAsync?city=' + addr + "&vehicleId=" + vehicleId,
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
         if(jsx.length == 0){
           addrs[0] = { "id": -1, "name":"当前城市暂无经销商支持"};
           jsx[0] = "当前城市暂无经销商支持"
         }
         that.globalData.carAddrDis = jsx;
         that.globalData.carAddrDisAddr = addrs;
        }
      },
    })
  },
  //根据地址和车型获取经销商
  getQuotaDealerAsync: function (addr, vehicleId = 1) {
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/services/app/dealer/GetQuotaDealerAsync?city=' + addr + "&vehicleId=" + vehicleId,
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
          if (jsx.length == 0) {
            addrs[0] = { "id": -1, "name": "当前城市暂无经销商支持" };
            jsx[0] = "当前城市暂无经销商支持"
          }
          that.globalData.carAddrDis = jsx;
          that.globalData.carAddrDisAddr = addrs;
        }
      },
    })
  },
  getServiceDealerAsync: function (addr){
    var that = this;
    wx.request({
      url: that.data.hostUrl + 'api/services/app/dealer/GetServiceDealerAsync?city=' + addr,
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
    //输出为公里
    s = Math.round(s * 10000) / 10000; 
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

    for (var i = 0; i < newData.length; i++){
      var c = that.bdMap_to_txMap(newData[i].longitude, newData[i].latitude)
      newData[i].longitude = c.lng;
      newData[i].latitude = c.lat;
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
          url: 'https://apis.map.qq.com/ws/geocoder/v1/',
          data: {
            "key": "ILEBZ-F4KC4-QSBU6-DK5J3-H7W6S-3MFLO",
            "location": locationString
          },
          method: 'GET',
          success: function (res) {
            var city = res.data.result.address_component.city;
            that.globalData.loadcity = city;
            wx.setStorageSync('loadcity', city);
          },
          fail:function(res){
          },
          complete:function(res){
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
    var myreg = /^[0-9]*$/;
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
  getCurrentPageUrlWithArgs: function () {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = currentPage.route
    const options = currentPage.options
    let urlWithArgs = `/${url}?`
    for (let key in options) {
      const value = options[key]
      urlWithArgs += `${key}=${value}&`
    }
    urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    return urlWithArgs
  },
  getThisDateTime:function(){
    var date = new Date();
    //年
    var year = date.getFullYear();
    //月
    var month = date.getMonth() + 1;
    //日
    var day = date.getDate();
    //时
    var hh = date.getHours();
    //分
    var mm = date.getMinutes();
    //秒
    var ss = date.getSeconds();
    var rq = year + "-" + month + "-" + day + " " + hh + ":" + mm + ":" + ss;
    return rq;
  }
});