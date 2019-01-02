App({
  /*
    用户进来后发起微信授权 必须授权获取到用户信息后才可以
  */
  data: {
    hostUrl: "https://miniprogram.zfchina.com/",
    appid: "wx4d69fe23e65ae0ca",
    appKey: "f3ee574e618801a984354749b2657b21",
  },
  onLaunch: function() {
    this.ifUserLogin();
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
                  //判断用户是否授权过
                  wx.getSetting({
                    success: function(res) {
                      //授权过
                      if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                          success: function(e) {
                            var userInfo = e.userInfo;
                          }
                        })
                      } else {
                        //未授权 ，引导授权
                        wx.navigateTo({
                          url: "/pages/Login/index"
                        })
                      }
                    }
                  })
                }
              }
            }
          })
        }
      })
    }


  }
})