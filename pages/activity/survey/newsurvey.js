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
    tindex:1,
    isSelePrev:false,
    textStatus:false,
    isSelected:true,
    StartDateTime: app.getThisDateTime(),
    groupOpt:false,
    groupId:0,
    wjajax:false,
    rules:null,
    isend:false,
    thanksMsg:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      SurveyIdTitle: "",
      pageId: options.id,
      options: options,
      dealerId: options.dealerId ? options.dealerId : "",
    })
    console.log(this.data);
 //   that.pageInfo(options);
  },
  retunrAbout:function(){
    wx.switchTab({
      url: '/pages/about/index',
    })
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
          var wjajax = false;
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
          var surveyArr = res.data.result;
          var initopt = [];
          var optArr = [];
          surveyArr.forEach(v=>{
            var options = v.options;
            if (v.type == "matrixradio"){
              var optionGroups = v.optionGroups;
              optionGroups.forEach(optv=>{
                options.forEach(va => {
                  if (optv.selectedOptionId == va.id){
                    optArr.push(v.id);
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
            } else if (v.type == "text"){
              if (v.answerContent){
                optArr.push(v.id);
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
            }else{
              options.forEach(va=>{
                if (va.isSelected){
                  optArr.push(va.questionId);
                  initopt.push({
                    content: va.title,
                    optionId: va.id,
                    optiongroupid:null,
                    otherOption: va.otherOption,
                    point: va.point,
                    questionId: va.questionId,
                    questionLinkId: va.questionLinkId ? va.questionLinkId:'null'
                  });
                }
              });
            }
          });
          var c = [res.data.result[0].id];
          if (optArr.length>0){
            wjajax = true;
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
            c = optnew;
          }else{
            wjajax = false;
            if (!wx.getStorageSync("surphone")) {
              console.log(app.getCurrentPageUrlWithArgs());
              wx.setStorageSync("sururl", app.getCurrentPageUrlWithArgs());
              wx.redirectTo({
                url: "/pages/activity/survey/phone/index"
              })
              return;
            }
          }
          console.log(initopt);
      //    c = [48];
          that.setData({
            SurveyIdTitle: res.data.result[0].surveyIdName,
            surveyArr: surveyArr,
            textArrStatus: textArrStatus,
            textArrValue: textArrValue,
            loginhidde: false,
            optArr:c,
            questions: initopt,
            surLen: res.data.result.length,
            optId: res.data.result[0].id,
            rules: res.data.result[0].rules,
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
    var optiongroupid = e.target.dataset.optiongroupid;
    var index = e.target.dataset.index;
    this.setFromData(e, questionid, index, false);
  
  },
  bindMatrRadioOption:function(e){
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
  setFromData: function (e, questionid, index, status = false, optiongroupid = null) {
    if (optiongroupid){
        this.setData({
          groupOpt:true,
          groupId: questionid
        })
        
    }
    var value = e.detail.value
    this.jumpOpt(value, questionid, index);
    var questions = this.data.questions;
    var no = e.target.dataset.no;
    var len = questions.length;
    var textArrStatus = this.data.textArrStatus;
    var textArrValue = this.data.textArrValue;
    if (!optiongroupid){
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
          var point = val[5] == "null" ? 0 : val[5];
          newJsonData = {
            questionId: parseInt(questionid),
            optionId: parseInt(val[0]),
            content: textArrValue[index] ? textArrValue[index] : '其他',
            otherOption: val[2],
            questionLinkId: val[4],
            optiongroupid: optiongroupid ? optiongroupid:null,
            point: point,
            rules: no + "=" + point,
          }
        } else {
          var point = val[5] == "null" ? 0 : val[5];
          newJsonData = {
            questionId: parseInt(questionid),
            optionId: parseInt(val[0]),
            content: val[1],
            otherOption: val[2],
            questionLinkId:val[4],
            optiongroupid: optiongroupid ? optiongroupid : null,
            point: point,
            rules: no + "=" + point,
          }
        }
        newquestions.push(newJsonData);
      }
    } else {
      var val = value.split("-|-");
      if (val[2] == 'true') {
        textArrStatus[index] = true;
        var point = val[5] == "null" ? 0 : val[5];
        newJsonData = {
          questionId: parseInt(questionid),
          optionId: parseInt(val[0]),
          content: textArrValue[index] ? textArrValue[index] : '其他',
          otherOption: val[2],
          questionLinkId: val[4],
          optiongroupid: optiongroupid ? optiongroupid : null,
          point: point,
          rules: no + "=" + point,

        }
      } else {
        textArrStatus[index] = false;
        var point = val[5] == "null" ? 0 : val[5];
        newJsonData = {
          questionId: parseInt(questionid),
          optionId: parseInt(val[0]),
          content: val[1],
          otherOption: val[2],
          questionLinkId: val[4],
          optiongroupid: optiongroupid ? optiongroupid : null,
          point: point,
          rules: no + "=" + point,
        }
      }
      if (newJsonData.otherOption == "1"){
        var jz = false;
        var index = 0;
        for (var i = 0; i < newquestions.length;i++){
          if (newquestions[i].questionId == newJsonData.questionId && newquestions[i].optiongroupid == newJsonData.optiongroupid){
            jz = true;
            index = i;
          }
        }
        if (jz){
          newquestions[index] = newJsonData;
        }else{
          newquestions.push(newJsonData);
        }
      }else{
        newquestions.push(newJsonData);
      }
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
  bingOtherTextarea: function (e){
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
    console.log(questions);
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
      if (value.length == 0){
        return;
      }
      newValue = value[0];
      for(var i = 0;i<value.length;i++){
         var item =  value[i].split("-|-");
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
    var valArr = newValue.split("-|-");
    var optArr = this.data.optArr;
    var optnew = [];
    if (valArr[2] == "true"){
      newValue = value[i];
      _this.setData({
        textStatus: true
      });
    }else{
      _this.setData({
        textStatus: false
      });
    }
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
    var nextId = valArr[valArr.length-2];
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
    if (nextId == -1){
        this.setData({
          isend:true,
          thanksMsg: surveyArr[0].thanksMsg
        })
        return;
    }
    if (nextId == "null"){
       //下一题Linkid 未 null 取下一题目的id
      var a = optIndex+1;
      //做替换
      if (surveyArr.length == a){
        a = a - 1;
      }

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
    console.log(optnew);
    this.setData({
      optArr: optArr
    })
  },
  next: function () {
    this.timu(true);
  },
  
  prev: function(){
    var questions = this.data.questions;
    console.log(questions);
    var optArrIndex = this.data.optArrIndex;
    var optArr = this.data.optArr;
    var optId = this.data.optId;
    var surveyArr = this.data.surveyArr;
    //获取最后一题的ID
    var lastId = questions[questions.length - 1].questionId;
    //获取当前题目的id
    console.log(lastId);
    //
    //如果和当前ID相同 则表示
    var newquestions = [];
    var id = 0;
    for (var i = 0; i < questions.length;i++){
      if (questions[i].questionId != lastId){
          newquestions.push(questions[i]);
          id = questions[i].questionId;
        }
    }
   
    optArrIndex = newquestions.length;
    console.log("前面:"+this.data.tindex);
    var tindex = this.data.tindex - 1;
    console.log("后:" +tindex);
    var surLen = this.data.surLen;
    if (tindex > surLen) {
      tindex = surLen;
    };
   
    // if (id != 0 && id == surveyArr[0].id){
    //      tindex = 1;
    //      newquestions = [];
    //      console.log("11111");
    // }
    console.log(newquestions);
    console.log(newquestions.length);
    if (newquestions.length == 0){
      lastId = surveyArr[0].id;
    } else if (optId == lastId) {
      lastId = newquestions[newquestions.length - 1].questionId;
    } 
    
    // else{
    //    lastId = newquestions[newquestions.length - 1].questionId;
    // }
    console.log("lastId"+lastId);
    optArr.pop();
    this.setData({
      questions: newquestions,
      optArr: optArr,
      optArrIndex: optArr.length-1,
      count: "(" + tindex + "/" + surLen + ")",
      tindex: tindex,
      optId: lastId
    })

  },
  timu: function (status) {
    var optId = this.data.optId;
    //判断 当前 是否是 复选框 复选题目 
    var questions = this.data.questions;
    console.log(questions);
    var surveyArr = this.data.surveyArr;
    for (var i = 0; i < surveyArr.length;i++){
      if (surveyArr[i].id == optId && surveyArr[i].type == "checkbox"){
        var maxSelected = surveyArr[i].maxSelected;
        var minSelected = surveyArr[i].minSelected;
        var optLen = 0;
        for (var a = 0; a < questions.length;a++){
          if (questions[a].questionId == optId){
            optLen+=1;
          }
        }
        var title = "";
        if (minSelected > 0 || maxSelected > 0){
          if (optLen < minSelected || optLen > maxSelected) {
            title = "当前题目只能选 " + minSelected + "-" + maxSelected + "个选项";
            if (minSelected == maxSelected) {
              title = "当前题目只能选 " + minSelected + "个选项.";
            }
            wx.showToast({
              title: title,
              icon: "none",
              duration: 1500,
            });
            return;
          } else if (minSelected > 0 && optLen < minSelected) {
            title = "当前题目最少选 " + minSelected + "个选项";
            wx.showToast({
              title: title,
              icon: "none",
              duration: 1500,
            });
            return;
          } else if (maxSelected > 0 && optLen > maxSelected) {
            title = "当前题目最多选 " + maxSelected + "个选项.";
            wx.showToast({
              title: title,
              icon: "none",
              duration: 1500,
            });
            return;
          }
        }
      }
    }
    //当前是否是矩阵单选
    if (this.data.groupOpt){
        var questions = this.data.questions;
        var groupId = this.data.groupId;
        var surveyArr = this.data.surveyArr;
        var groupLen = 0;
        surveyArr.forEach(surItem=>{
          if (surItem.id == groupId){
            groupLen  = surItem.optionGroups.length;
          }
        });
        var optLen = 0;
        questions.forEach(v=>{
          if (v.questionId == groupId){
            optLen+=1;
          }
        })
      if (groupLen != optLen){
        wx.showToast({
          title: '请回答当前题目',
          icon: "none",
          duration: 1500,
        });
        return;
      }else{
        this.setData({
          groupOpt: false,
          groupId: 0
        })
      }
    }
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
      optArrIndex = optArrIndex -1; //删掉之后的那些题目 后面的题目 以及当前的题目
    }else{
      optArrIndex = optArrIndex + 1;
    }
    //判断 
    if (!optStatus) {
      wx.showToast({
        title: '请回答当前题目',
        icon: "none",
        duration: 1500,
      });
      return;
    }
    console.log(optArr);
    wx.hideToast();
    nextId = optArr[optArrIndex];
    console.log(optArrIndex);
    console.log("nextId:" + nextId);
    //就是在index中判断 
    var optIndex = 0;
    var rules = "";
    var surveyArr = this.data.surveyArr;
    for (var i = 0; i < surveyArr.length;i++){
      if (nextId == surveyArr[i].id){
          //获取到需要跳转下一题目的规则
          rules = surveyArr[i].rules;
          break;
      }
      optIndex++;
    }
    if (!this.data.wjajax){
      console.log("验证前：" + optIndex);
      var data = this.rules(rules, optArr, questions, surveyArr, nextId, optIndex);
      console.log(data);
      console.log("验证后" + data.optIndex)
      console.log("验证规则完毕");
      console.log(data);
      optArr = data.optArr;
      nextId = data.nextId;
      optIndex = data.optIndex;
      console.log(this.data.questions);
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



  rules: function (ru, optArr, questions, surveyArr, nextId, optIndex){
    console.log("进来验证")
    console.log(ru);
    console.log(questions)
    var that = this;
    if (!ru){
      //下一题没有规则 
      return {
        "a":1,
        optArr: optArr,
        nextId: nextId,
        optIndex: optIndex
      };
    }
    //
    if (ru.indexOf("|") != -1){
      ru = ru.split("|");
      console.log("是数组");
      console.log(ru);
      //都要等于才进去 否在跳下一题
      var status = [];
      for (var a = 0; a < ru.length; a++) {
        for (var i = 0; i < questions.length; i++) {
          console.log(questions[i].rules);
          if (ru[a].indexOf("!") != -1) {
            var neru = ru[a].split("!=");
            var quru = questions[i].rules.split("=");
            if (neru[0] == quru[0] && neru[1] != quru[1]){
              status.push(true);
              break;
            }
          }else
          if (ru[a] == questions[i].rules){
              status.push(true);
              break;
          }
        }
      }
      console.log(status);
      if (status.length == ru.length){
        return {
          "e": 1,
          optArr: optArr,
          nextId: nextId,
          optIndex: optIndex
        };
      }else{
        //获取下一题目
        var nextoptIndex = optIndex + 1;
        console.log(nextoptIndex);
        if (nextoptIndex > surveyArr.length - 1) {
          return {
            "c": 1,
            optArr: optArr,
            nextId: nextId,
            optIndex: optIndex
          }
        } else {
          var nextRules = surveyArr[nextoptIndex].rules;
          var nextnId = surveyArr[nextoptIndex].id;
          //需要删除掉
          optArr.pop();
          //将下一题目的换上去
          optArr.push(nextnId);
          console.log("-------------------------");
          return that.rules(nextRules, optArr, questions, surveyArr, nextnId, nextoptIndex);
        }

      }
    }else{
      console.log("进这里");
      ru = ru.split("|");
      console.log(ru);
      var status = [];
      for (var i = 0; i < questions.length; i++) {
        for (var a = 0; a < ru.length; a++) {
          console.log(ru[a] + "--123")
          if (ru[a].indexOf("!") != -1) {
            var neru = ru[a].split("!=");
            var quru = questions[i].rules.split("=");
            if (neru[0] == quru[0]){
               if(neru[1] == quru[1]){
                 status.push(true) //跳题目
                  break;
                }else {
                 status.push(false) //不跳
                  break;
                }
            }
          } else if (ru.indexOf("=")) {
            //可以进入
            if (questions[i].rules == ru[a]) {
              status.push(false) //不跳
              console.log("不跳 1 " + questions[i].rules + "====" + ru[a])
              break;
            } else {
              status.push(true) //跳题目
              console.log("跳题目 1  " + questions[i].rules + "====" + ru[a])
              break;
            }
          }
        }
      }
      var bb = false;
      console.log(status);
      for (var i = 0; i < status.length; i++) {
        if (status[i]) {
          bb = true;
          break;
        }
      }
      if (bb) {
        //不可以进入 需要去下一题目  下一题目  获取下一题目的规则 判断
        //获取下一题目
        var nextoptIndex = optIndex + 1;
        console.log(nextoptIndex);
        if (nextoptIndex > surveyArr.length - 1) {
          return {
            "c": 1,
            optArr: optArr,
            nextId: nextId,
            optIndex: optIndex
          }
        } else {
          var nextRules = surveyArr[nextoptIndex].rules;
          var nextnId = surveyArr[nextoptIndex].id;
          //需要删除掉
          optArr.pop();
          //将下一题目的换上去
          optArr.push(nextnId);
          console.log("-------------------------");
          return that.rules(nextRules, optArr, questions, surveyArr, nextnId, nextoptIndex);
        }
      } else {
        return {
          "b": 1,
          optArr: optArr,
          nextId: nextId,
          optIndex: optIndex
        };
      }
    }
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
    this.setData({
      loginhidde: true,
      title: '',
      surveyArr: [],
      questions: [],
      textArrStatus: [],
      textArrValue: [],
      hidden: true,
      ajaxstatus: true,
      count: "(1/1)",
      countIndex: 0,
      optId: 0,
      optArr: [],
      optArrIndex: 0,
      isJump: true,
      surLen: 0,
      optIndex: 0,
      tindex: 1,
      isSelePrev: false,
      textStatus: false,
      isSelected: true,
      StartDateTime: app.getThisDateTime(),
      groupOpt: false,
      groupId: 0,
      wjajax: false,
      rules: null,
      isend: false,
      thanksMsg: ""
    });
    this.pageInfo(this.data.options);
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
    //this.pageInfo(this.data.options);
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