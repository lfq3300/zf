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
    count: "(1/1)",
    countIndex: 0,
    optId:0,
    isAnswer:false,
    optArr:[],
    isJump:true,
    surLen:0,
    optIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (!wx.getStorageSync("surphone")){
    //     wx.setStorageSync("sururl", app.getCurrentPageUrlWithArgs());
    //     wx.redirectTo({
    //       url: "/pages/activity/survey/phone/index"
    //     })
    // }
    var that = this;
    that.setData({
      SurveyIdTitle: options.title ? options.title : "",
      pageId: options.id,
      options: options
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
            count: "(1/" + res.data.result.length + ")",
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
          that.setData({
            SurveyIdTitle: res.data.result[0].surveyIdName,
            surveyArr: res.data.result,
            textArrStatus: textArrStatus,
            textArrValue: textArrValue,
            loginhidde: false,
            optArr:[res.data.result[0].id],
            surLen: res.data.result.length,
            optId: [res.data.result[0].id] 
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
    console.log(e);
    this.setData({
      isAnswer:true
    })
  },

  bindCheckboxOption: function (e) {
    var questionid = e.target.dataset.questionid;
    var index = e.target.dataset.index;
    this.setFromData(e, questionid, index, true);
    this.setData({
      isAnswer: true
    })
  },
  setFromData: function (e, questionid, index, status = false) {
    var value = e.detail.value
    this.jumpOpt(value, questionid, index);
    var questions = this.data.questions;
    var len = questions.length;
    var textArrStatus = this.data.textArrStatus;
    var textArrValue = this.data.textArrValue;
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
          }
        } else {
          newJsonData = {
            questionId: parseInt(questionid),
            optionId: parseInt(val[0]),
            content: val[1],
            otherOption: val[2],
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
        }
      } else {
        textArrStatus[index] = false;
        newJsonData = {
          questionId: parseInt(questionid),
          optionId: parseInt(val[0]),
          content: val[1],
          otherOption: val[2],
        }
      }
      newquestions.push(newJsonData);
    }
    this.setData({
      questions: newquestions,
      textArrStatus: textArrStatus
    })
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
        questions: that.data.questions
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
                  url: '/pages/survey/index'
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

  //跳题目 
  jumpOpt:function(value,thisid,index){
    if (value instanceof Array){
      value = value[0];
    }
    var valueArr = value.split("-|-");
    var nextId = valueArr.pop();
    console.log(nextId);
    if (nextId == "null"){
      console.log("为空"); 
      var opt = this.data.surveyArr;
      console.log(opt);
      //nextId 就是 下一个
      console.log(index);
      nextId = opt[index+1].id;
    }else{
      console.log("不为空"); 
    }
    var isJump = this.data.isJump;
    var optArr = this.data.optArr;
    if (isJump){
      this.setData({
        isJump: false
      });
    }else{
      // 删除最后一个  在添加 
      optArr.pop();
    }
    optArr.push(parseInt(nextId));
    this.setData({
      optArr: optArr
    });
    console.log(optArr);
  },
  next: function () {
    wx.hideToast();
    var isAnswer = this.data.isAnswer;
    if(isAnswer){
      this.timu(true);
    }else{
      wx.showToast({
        title:"当前题目未回答",
        icon:'none',
        duration:1500
      })
    }
    this.setData({
      isAnswer:false
    })
  },
  prev: function () {
    this.timu(false);
  },
  timu: function (status) {
    this.setData({
      isJump:true
    })
    var optArr = this.data.optArr;
    if (!status) {
      optArr.pop();
      //需要将 optArr 去掉最后一个 返回上一题
      this.setData({
        optArr: optArr
      })
      console.log("上一题");
    }
    console.log(optArr);
    var nextId = optArr[optArr.length-1];
    console.log(optArr);
    console.log(nextId);
    var surveyArr = this.data.surveyArr;
    var optId = 0;
    var countIndex = 0;
    for (var i = 0; i < surveyArr.length;i++){
      if (surveyArr[i].id == nextId){
        optId = nextId;
        break;
      }
      countIndex += 1;
    }
    
    console.log(this.data);
    var count = "(" + countIndex + 1 + "/" + surveyArr.length + ")";
    this.setData({
      optId: optId,
      count: count,
      optIndex: countIndex
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