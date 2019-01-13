Page({
  data: {
    fontFamily: 'Bitstream Vera Serif Bold',
    loaded: false,
  },

  onLoad() {
    this.setData({
      loaded: false
    });
    wx.loadFontFace({
      family: this.data.fontFamily,
      source: 'url("https://miniprogram.zfchina.com/fonts/zf/MYingHeiPRC-W3.otf")',
      success(res) {
        console.log(res.status)
        self.setData({ loaded: true })
      },
      fail: function (res) {
        console.log(res.status)
      },
      complete: function (res) {
        console.log(res.status)
      }
    });
  },

  loadFontFace() {
    const self = this
    wx.loadFontFace({
      family: this.data.fontFamily,
      source: 'url("https://miniprogram.zfchina.com/fonts/zf/MYingHeiPRC-W3.otf")',
      success(res) {
        console.log(res.status)
        self.setData({ loaded: true })
      },
      fail: function (res) {
        console.log(res.status)
      },
      complete: function (res) {
        console.log(res.status)
      }
    });
  }
})
