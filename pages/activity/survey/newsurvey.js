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
    optArr:[],
    optArrIndex:0,
    isJump:true,
    surLen:0,
    optIndex:0,
    tindex:0,
    isSelePrev:false,
    textStatus:false,
    isSelected:true,
    StartDateTime: new Date().getTime()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if (!wx.getStorageSync("surphone")){
         wx.setStorageSync("sururl", app.getCurrentPageUrlWithArgs());
         wx.redirectTo({
           url: "/pages/activity/survey/phone/index"
         })
     }
    var that = this;
    that.setData({
      SurveyIdTitle: options.title ? options.title : "",
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
            optId: res.data.result[0].id
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
    var optiongroupid = e.target.dataset.optiongroupid;
    var index = e.target.dataset.index;
    this.setFromData(e, questionid, index, false, optiongroupid);
  
  },

  bindCheckboxOption: function (e) {
    var questionid = e.target.dataset.questionid;
    var index = e.target.dataset.index;
    this.setFromData(e, questionid, index, true);
    
  },
  setFromData: function (e, questionid, index, status = false, optiongroupid = 0) {
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
            questionLinkId: val[4],
            optiongroupid: optiongroupid,
          }
        } else {
          newJsonData = {
            questionId: parseInt(questionid),
            optionId: parseInt(val[0]),
            content: val[1],
            otherOption: val[2],
            questionLinkId:val[4],
            optiongroupid: optiongroupid,
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
          questionLinkId: val[4],
          optiongroupid: optiongroupid
        }
      } else {
        textArrStatus[index] = false;
        newJsonData = {
          questionId: parseInt(questionid),
          optionId: parseInt(val[0]),
          content: val[1],
          otherOption: val[2],
          questionLinkId: val[4],
          optiongroupid: optiongroupid
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
      textArrValue: textArrValue,
      textStatus: false
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
      questions: newquestions,
      textStatus:false
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
    var questions = that.data.questions;
    var optArr = that.data.optArr;
    var newquestions = [];
    for (var i = 0; i < optArr.length;i++){
      for (var j = 0; j < questions.length;j++){
        if (optArr[i] == questions[j].questionId){
          newquestions.push(questions[j]);
        }
      }
    }
    questions = newquestions;
    wx.request({
      url: app.data.hostUrl + 'api/MiniApp/addsurvey',
      method: "post",
      data: {
        surveyId: parseInt(that.data.pageId),
        accountId: wx.getStorageSync('userId'),
        questions: questions,
        phone: wx.getStorageSync("surphone"),
        dealerId: that.data.dealerId,
        StartDateTime: that.data.StartDateTime,
        EndDateTime: new Date().getTime()

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

  /**
   * optId 表示当前页显示的题目id
   * optArr 表示 题目的数组ID
   * optIndex 当前选中题目的Index
   */
  //跳题目 
  jumpOpt:function(value,thisid,index){
    var newValue = value;
    if (!value){
        this.setData({
          isSelected:false
        })
    }else{
      isSelected: true
    }
    var _this = this;
    if(value instanceof Array){
      newValue = value[0];
      for(var i = 0;i<value.length;i++){
         var item =  value[i].split("-|-");
        console.log(item);
         if(item[2] == "true"){
           newValue = value[i];
           _this.setData({
             textStatus:true
           });
           break;
         }else{
           _this.setData({
             textStatus: false
           });
         }
      }
    }
    console.log(newValue);
    console.log(this.data);
    var valArr = newValue.split("-|-");
    var optArr = this.data.optArr;
    var optnew = [];
    for (var i = 0; i < optArr.length;i++){
      if (optnew.length == 0){
        optnew.push(optArr[i]);
      }else{
        var kstauts = true;
        for (var k = 0; k < optnew.length;k++){
          if (optnew[k] == optArr[i]){
            kstauts = false;
            break;
          }
        }
        if (kstauts){
          optnew.push(optArr[i]);
        }
      }
    }
    optArr = optnew;
    console.log(optArr);  
    var nextId = valArr.pop();
    var optIndex = this.data.optIndex;
    var surveyArr = this.data.surveyArr;
    var questions = this.data.questions;
    var nes = [];
    // 去重复
    for (var i = 0; i < questions.length;i++){
      if(nes.length == 0){
        nes.push(questions[i]);
      }else{
        var nesStatus = true;
        for (var j = 0; j < nes.length;j++){
          if (nes[j].questionId == questions[i].questionId){
            nesStatus = false;
           }
        };
        if (nesStatus){
          nes.push(questions[i]);
        }
      }
    }
    var optArrIndex = this.data.optArrIndex;
    if (nextId == "null"){
       //下一题Linkid 未 null 取下一题目的id
      var a = optIndex+1;
      //做替换
      if (optArrIndex < nes.length){
        optArr[optArrIndex+1] = parseInt(surveyArr[a].id);
      }else{
          optArr.push(parseInt(surveyArr[a].id));
      }
    }else{
      if (optArrIndex < nes.length) {
        optArr[optArrIndex+1] = parseInt(nextId);
      } else {
          optArr.push(parseInt(nextId));
      }
       //存在下一题目ID
    }
    console.log(optArr);  
    var optnew = [];
    for (var i = 0; i < optArr.length; i++) {
      if (optnew.length == 0) {
        optnew.push(optArr[i]);
      } else {
        var kstauts = true;
        for (var k = 0; k < optnew.length; k++) {
          if (optnew[k] == optArr[i]) {
            kstauts = false;
            break;
          }
        }
        if (kstauts) {
          optnew.push(optArr[i]);
        }
      }
    }
    optArr = optnew;
    console.log(optArr);
    this.setData({
      optArr: optArr
    })
  },
  next: function () {
    this.timu(true);
  },

  prev: function(){
    this.timu(false);
  },
  timu: function (status) {
    //判断text是否有写入
    if (this.data.textStatus || !this.data.isSelected){
      wx.showToast({
        title: '请回答当前题目',
        icon: "none",
        duration: 1500,
      });
      return;
    }
    var optArr = this.data.optArr;
    var nextId = 0;
    var questions = this.data.questions;
    var optId = this.data.optId;
    console.log(optId);
    var optArrIndex = this.data.optArrIndex;
    var optStatus = false;
    for (var i = 0; i < questions.length; i++) {
      if (optId == questions[i].questionId) {
        optStatus = true;
        break;
      }
    }
    if (!status) {
      //上一题目
      optStatus = true;
      optArrIndex = optArrIndex -1;
    }else{
      optArrIndex = optArrIndex + 1;
    }
    console.log("optindex:" + optArrIndex);
    if (!optStatus) {
      wx.showToast({
        title: '请回答当前题目',
        icon: "none",
        duration: 1500,
      });
      return;
    }
    wx.hideToast();
    nextId = optArr[optArrIndex];
    console.log(this.data);
    console.log(nextId);
    var optIndex = 0;
    var surveyArr = this.data.surveyArr;
    for (var i = 0; i < surveyArr.length;i++){
      if (nextId == surveyArr[i].id){
          break;
      }
      optIndex++;
    }
    var surLen = this.data.surLen;
    var tindex = optIndex+1;
    if (tindex > surLen){
      tindex = surLen;
    }
    this.setData({
      optIndex: optIndex,
      optArr: optArr,
      optArrIndex: optArrIndex,
      count: "(" + tindex + "/" + surLen+")",
      optId: nextId,
      tindex: tindex
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