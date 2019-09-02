// pages/survey/survey.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginhidde: true,
    title: '',
    surveyArr: [],
    questions: [],
    textArrStatus: [],
    textArrValue: [],
    pageId: '',
    hidden: true,
    ajaxstatus: true,
    count:"(1/1)",
    countIndex:0,
    surLen:0,
    StartDateTime: app.getThisDateTime(),
    groupOpt: false,
    groupId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     app.ifUserLogin();
     if (!wx.getStorageSync("surphone")){
        wx.setStorageSync("sururl", app.getCurrentPageUrlWithArgs());
        wx.redirectTo({
          url: "/pages/activity/survey/phone/index"
        })
    }
     var that = this;
    that.setData({
      SurveyIdTitle: options.title ? options.title:"",
      pageId: options.id,
      options: options,
      dealerId: options.dealerId ? options.dealerId : "",
    })
    that.pageInfo(options);
  },
  
  pageInfo: function (options) {
    var that = this;
    wx.request({
      url: app.data.hostUrl + 'api/services/app/surveyQuestion/GetListBySurveyIdAsync?surveyId=' + parseInt(that.data.pageId) + '&accountId=' + wx.getStorageSync('userId'),
      method: 'POST',
      success: function (res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
        if (res.statusCode == 200 && res.data.success) {
          that.setData({
            count:"(1/"+res.data.result.length+")",
            surLen: res.data.result.length
          })
          var textArrStatus = [];
          var textArrValue = [];
          res.data.result.forEach((item, index) => {
            if (item.type != 'text' && item.options.length > 0) {
              var v = false;
              var b = item.options;
              for (var i = 0; i < b.length; i++) {
                if (b[i].otherOption && b[i].isSelected) {
                  v = true;
                  break;
                }
              }
              if (v) {
                textArrStatus.push(true);
              } else {
                textArrStatus.push(false);
              }
            } else {
              textArrStatus.push(false);
            }
            textArrValue.push('');
          })
          var sureyArr = res.data.result;
          that.setData({
            SurveyIdTitle: res.data.result[0].surveyIdName,
            surveyArr: sureyArr,
            textArrStatus: textArrStatus,
            textArrValue: textArrValue,
            loginhidde: false
          });
        }
      },
      fail: function (res) {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    })
  },
  bindRadioOption: function (e) {
    console.log(e);
    var questionid = e.target.dataset.questionid;
    var optiongroupid = e.target.dataset.optiongroupid;
    var index = e.target.dataset.index;
    this.setFromData(e, questionid, index);
  },

  bindMatrRadioOption: function (e) {
    var questionid = e.target.dataset.questionid;
    var optiongroupid = e.target.dataset.optiongroupid;
    var index = e.target.dataset.index;
    this.setFromData(e, questionid, index, false, optiongroupid);
  },

  bindCheckboxOption: function (e) {
    var questionid = e.target.dataset.questionid;
    var index = e.target.dataset.index;
    this.setFromData(e, questionid, index, true);
  },
  setFromData: function (e, questionid, index, status = false, optiongroupid=0) {
    if (optiongroupid) {
      this.setData({
        groupOpt: true,
        groupId: questionid
      })
    }
    var value = e.detail.value;
    var questions = this.data.questions;
    var len = questions.length;
    var textArrStatus = this.data.textArrStatus;
    var textArrValue = this.data.textArrValue;
    if (!optiongroupid) {
      for (var i = 0; i < len; i++) {
        if (parseInt(questions[i].questionId) === parseInt(questionid)) {
          delete questions[i];
        }
      }
    }
    var newquestions = [];
    for (var i = 0; i < len; i++) {
      if (typeof (questions[i]) != 'undefined') {
        newquestions.push(questions[i])
      }
    }
    var newJsonData = {};
    if (status) {
      if (value.length == 0) {
        textArrStatus[index] = false;
      }
      for (var i = 0; i < value.length; i++) {
        var val = value[i].split("-|-");
        console.log(val);
        if (val[2] == 'true') {
          textArrStatus[index] = true;
          break;
        } else {
          textArrStatus[index] = false;
        }
      }
      for (var i = 0; i < value.length; i++) {
        var val = value[i].split("-|-");
        if (val[2] == 'true') {
          newJsonData = {
            questionId: parseInt(questionid),
            optionId: parseInt(val[0]),
            content: textArrValue[index] ? textArrValue[index] : '其他',
            otherOption: val[2],
            optiongroupid: optiongroupid,
            point: val[4]

          }
        } else {
          newJsonData = {
            questionId: parseInt(questionid),
            optionId: parseInt(val[0]),
            content: val[1],
            otherOption: val[2],
            optiongroupid: optiongroupid,
            point: val[4]

          }
        }
        newquestions.push(newJsonData);
      }
    } else {
      var val = value.split("-|-");
      if (val[2] == 'true') {
        textArrStatus[index] = true;
        newJsonData = {
          questionId: parseInt(questionid),
          optionId: parseInt(val[0]),
          content: textArrValue[index] ? textArrValue[index] : '其他',
          otherOption: val[2],
          optiongroupid: optiongroupid,
          point: val[4]

        }
      } else {
        textArrStatus[index] = false;
        newJsonData = {
          questionId: parseInt(questionid),
          optionId: parseInt(val[0]),
          content: val[1],
          otherOption: val[2],
          optiongroupid: optiongroupid,
          point: val[4]

        }
      }
      newquestions.push(newJsonData);
    }
    this.setData({
      questions: newquestions,
      textArrStatus: textArrStatus
    });
    console.log(this.data.questions);
  },
  bingTextarea: function (e) {
    var questionid = e.target.dataset.questionid;
    var index = e.target.dataset.index;
    var value = e.detail.value;
    var optionId = e.target.dataset.id;
    var questions = this.data.questions;
    var textArrValue = this.data.textArrValue;
    var len = questions.length;
    for (var i = 0; i < len; i++) {
      if (parseInt(questions[i].questionId) == parseInt(questionid) && questions[i].otherOption == 'true') {
        questions[i].content = value;
      }
    }
    textArrValue[index] = value;
    this.setData({
      questions: questions,
      textArrValue: textArrValue
    })
  },
  bingOtherTextarea: function (e) {
    var questionid = e.target.dataset.questionid;
    var value = e.detail.value;
    var questions = this.data.questions;
    var len = questions.length;
    for (var i = 0; i < len; i++) {
      if (parseInt(questions[i].questionId) === parseInt(questionid)) {
        delete questions[i];
      }
    }
    var newquestions = [];
    for (var i = 0; i < len; i++) {
      if (typeof (questions[i]) != 'undefined') {
        newquestions.push(questions[i])
      }
    }
    newquestions.push({
      questionId: parseInt(questionid),
      optionId: 0,
      content: value,
      otherOption: 'other',
    })
    this.setData({
      questions: newquestions
    })
  },
  submitFrom: function () {
      var that = this;
      var ajx = false;
      var questions = that.data.questions;
      var groupId = that.data.groupId;
      var surveyArr = that.data.surveyArr;
      surveyArr.forEach((surItem, i) => {
        if (this.data.groupOpt) {
          if (surItem.type == "matrixradio") {
            var groupLen = surItem.optionGroups.length;
            var groupId = surItem.id;
            var optLen = 0;
            questions.forEach(v => {
              if (v.questionId == groupId) {
                optLen += 1;
              }
            });
            if (groupLen != optLen) {
              var ti = i + 1;
              wx.showToast({
                title: '第' + ti +"题还未完成",
                icon: "none",
                duration: 1500,
              });
              ajx = true;
              return;
            }
          }
        }
        if (surItem.type == "checkbox"){
          var maxSelected = parseInt(surItem.maxSelected);
          var minSelected = parseInt(surItem.minSelected);
          var groupId = surItem.id;
          var optLen = 0;
          questions.forEach(v => {
            if (v.questionId == groupId) {
              optLen += 1;
            }
          });
          var title = '';
          var ti = i + 1;
          if ((minSelected > 0 && maxSelected > 0) && optLen < minSelected || optLen > maxSelected) {
            title = '第' + ti + "题只能选 " + minSelected + "-" + maxSelected+"个选项";
            wx.showToast({
              title: title ,
              icon: "none",
              duration: 1500,
            });
            ajx = true;
            return;
          } else if (minSelected > 0 && optLen < minSelected){
            title = '第' + ti + "题最少选 " + minSelected + "个选项";
            wx.showToast({
              title: title,
              icon: "none",
              duration: 1500,
            });
            ajx = true;
            return;
          } else if (maxSelected > 0 && optLen > maxSelected) {
            title = '第' + ti + "题最多选 " + maxSelected + "个选项";
            wx.showToast({
              title: title,
              icon: "none",
              duration: 1500,
            });
            ajx = true;
            return;
          }
            
        }
      });
   
    if (ajx){
      return;
    }
    that.setData({
      groupOpt: false,
      groupId: 0
    })
    if (that.data.questions.length == 0) {
      wx.showToast({
        title: '不能提交空问卷',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (!that.data.ajaxstatus) {
      return;
    }
    that.setData({
      hidden: false,
      ajaxstatus: false
    })
    wx.request({
      url: app.data.hostUrl + 'api/MiniApp/addsurvey',
      method: "post",
      data: {
        surveyId: parseInt(that.data.pageId),
        accountId: wx.getStorageSync('userId'),
        questions: that.data.questions,
        dealerId: that.data.dealerId,
        phone: wx.getStorageSync("surphone"),
        StartDateTime: that.data.StartDateTime,
        EndDateTime: app.getThisDateTime()
      },
      success: function (res) {
        that.setData({
          ajaxstatus: true,
          hidden: true,
        })
        if (res.data.success) {
          wx.showToast({
            title: '提交成功',
            icon: 'none',
            duration: 2000,
            success: function () {
              setTimeout(function () {
                wx.switchTab({
                  url: '/pages/activity/index'
                })
              }, 1500)
              console.log(346);
            }
          })

        } else {
          wx.showToast({
            title: res.data.error.message,
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {
        //未发送请求
        that.setData({
          ajaxstatus: true,
          hidden: true,
        })
        wx.showToast({
          title: '网络异常，请检查网络状态',
          icon: 'none',
          duration: 2500
        })
      }
    })
  },
  next:function(){
    this.timu(1);
  },
  prev:function(){
    this.timu(-1);
  },
  timu:function(num){
    var countIndex = this.data.countIndex;
    var surLen = this.data.surLen;
    countIndex = countIndex + num;
    if (countIndex > surLen){
      countIndex = surLen;
    } else if (countIndex<0){
      countIndex = 0
    }
    var a = countIndex + 1;
    var count = "(" + a + "/" + surLen + ")";
    this.setData({
      countIndex: countIndex,
      count: count
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
    this.pageInfo(this.data.options);
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