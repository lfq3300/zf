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
    groupId: 0,
    wjajax:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      SurveyIdTitle:"",
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
     //   url: app.data.hostUrl + 'api/services/app/surveyQuestion/GetListBySurveyIdAsync?surveyId=' + parseInt(that.data.pageId) + '&accountId=9828',
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
          var wjajax = false;
          var initopt = [];
          sureyArr.forEach(v => {
            var options = v.options;
            if (v.type == "matrixradio") {
              var optionGroups = v.optionGroups;
              optionGroups.forEach(optv => {
                options.forEach(va => {
                  if (optv.selectedOptionId == va.id) {
                    initopt.push({
                      content: va.title,
                      optionId: va.id,
                      optiongroupid: optv.id,
                      otherOption: "1",
                      point: va.point,
                      questionId: va.questionId,
                      questionLinkId: va.questionLinkId ? va.questionLinkId : 'null'
                    });
                  }
                })
              })
            } else if (v.type == "text") {
              if (v.answerContent) {
                initopt.push({
                  content: v.answerContent,
                  optionId: v.id,
                  optiongroupid: null,
                  otherOption: "other",
                  point: 0,
                  questionId: v.questionId,
                  questionLinkId: v.questionLinkId ? v.questionLinkId : 'null'
                });
              }
            } else {
              options.forEach(va => {
                if (va.isSelected) {
                  initopt.push({
                    content: va.title,
                    optionId: va.id,
                    optiongroupid: null,
                    otherOption: va.otherOption,
                    point: va.point,
                    questionId: va.questionId,
                    questionLinkId: va.questionLinkId ? va.questionLinkId : 'null'
                  });
                }
              });
            }
          });
          console.log(initopt);
          if (initopt.length == 0){
            if (!wx.getStorageSync("surphone")) {
              wx.setStorageSync("sururl", app.getCurrentPageUrlWithArgs());
              wx.redirectTo({
                url: "/pages/activity/survey/phone/index"
              })
              return;
            }
            wjajax = false
          }else{
            wjajax=true;
          }
          that.setData({
            SurveyIdTitle: res.data.result[0].surveyIdName,
            surveyArr: sureyArr,
            textArrStatus: textArrStatus,
            textArrValue: textArrValue,
            loginhidde: false,
            questions: initopt,
            wjajax: wjajax
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
    var questionid = e.target.dataset.questionid;
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
  setFromData: function (e, questionid, index, status = false, optiongroupid=null) {
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
            optiongroupid: optiongroupid ? optiongroupid:null,
            point: val[4]

          }
        } else {
          newJsonData = {
            questionId: parseInt(questionid),
            optionId: parseInt(val[0]),
            content: val[1],
            otherOption: val[2],
            optiongroupid: optiongroupid ? optiongroupid : null,
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
          optiongroupid: optiongroupid ? optiongroupid : null,
          point: val[4]

        }
      } else {
        textArrStatus[index] = false;
        newJsonData = {
          questionId: parseInt(questionid),
          optionId: parseInt(val[0]),
          content: val[1],
          otherOption: val[2],
          optiongroupid: optiongroupid ? optiongroupid : null,
          point: val[4]

        }
      }
      
      if (newJsonData.otherOption == "1") {
        var jz = false;
        var index = 0;
        for (var i = 0; i < newquestions.length; i++) {
          if (newquestions[i].questionId == newJsonData.questionId && newquestions[i].optiongroupid == newJsonData.optiongroupid) {
            jz = true;
            index = i;
          }
        }
        if (jz) {
          newquestions[index] = newJsonData;
        } else {
          newquestions.push(newJsonData);
        }
      } else {
        newquestions.push(newJsonData);
      }
    }
    this.setData({
      questions: newquestions,
      textArrStatus: textArrStatus
    });
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
      var ajx = true;
      var questions = that.data.questions;
      var groupId = that.data.groupId;
      var surveyArr = that.data.surveyArr;
      var surlen = 0;
      try {
        surveyArr.forEach((surItem, i) => {
          surlen += 1;
          if (surItem.isRequired) {
            var reqstatus = false;
            questions.forEach(v => {
              if (v.questionId == surItem.id) {
                reqstatus = true;
              }
            });
            if (!reqstatus) {
              wx.showToast({
                title: '第' + surlen + "题还未完成",
                icon: "none",
                duration: 1500,
              });
              throw new Error("EndIterative");
              ajx = false;
              return;
            }
          }
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
                  title: '第' + ti + "题还未完成",
                  icon: "none",
                  duration: 1500,
                });
                throw new Error("EndIterative");
                ajx = false;
                return;
              }
            }
          }
          if (surItem.type == "checkbox") {
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
            if (minSelected > 0 || maxSelected > 0) {
            if ( optLen < minSelected || optLen > maxSelected) {
              title = '第' + ti + "题只能选 " + minSelected + "-" + maxSelected + "个选项";
              if (minSelected == maxSelected) {
                title = '第' + ti + "题只能选 " + minSelected + "个选项";
              }
              wx.showToast({
                title: title,
                icon: "none",
                duration: 1500,
              });
              throw new Error("EndIterative");
              ajx = false;
              return;
            } else if (minSelected > 0 && optLen < minSelected) {
              title = '第' + ti + "题最少选 " + minSelected + "个选项";
              wx.showToast({
                title: title,
                icon: "none",
                duration: 1500,
              });
              throw new Error("EndIterative");
              ajx = false;
              return;
            } else if (maxSelected > 0 && optLen > maxSelected) {
              title = '第' + ti + "题最多选 " + maxSelected + "个选项";
              wx.showToast({
                title: title,
                icon: "none",
                duration: 1500,
              });
              throw new Error("EndIterative");
              ajx = false;
              return;
            }
            }
          }

        });
      }catch (e){

      }
    if (!ajx){
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
          wx.setStorageSync('surphone', '');
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
    app.ifUserLogin();
   // this.pageInfo(this.data.options);
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
    //
  //  this.pageInfo(this.data.options);
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