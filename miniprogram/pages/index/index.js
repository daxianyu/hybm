//index.js
const app = getApp();

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    data: {},
    reason: [],
    checkboxData: [],
    sex: '',
    current_lesson: '',
    goalarea: '',
    apply_courses: '',
    relationship: '',
    reason: ''
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.setData({
      data: e.detail.value
    });
  },
  onLoad: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },
  toPrivacy: () => {
    console.log('toPrivacy')
    wx.navigateTo({
      url: '../privacy/privacy',
    })
  },
  checkboxChange(e) {
    console.log(e)
    this.setData({
      checkboxData: e.detail.value
    })
  },
  sexChange: function(e) {
    this.setData({
      sex: e.detail.value
    });
  },
  currentLessonChange: function(e) {
    this.setData({
      current_lesson: e.detail.value
    });
  },
  goalAreaChange: function(e) {
    this.setData({
      goalarea: e.detail.value
    });
  },
  applyCoursesChange: function(e) {
    this.setData({
      apply_courses: e.detail.value
    });
  },
  relationshipChange: function(e) {
    this.setData({
      relationship: e.detail.value
    });
  },
  reasonChange: function(e) {
    this.setData({
      reason: e.detail.value
    });
  },
  
  // 映射关系字段为数字
  mapRelationToNumber: function(relation) {
    const relationMap = {
      '学生本人': 0,
      '爸爸': 1,
      '妈妈': 2,
      '其他监护人': 3
    };
    return relationMap[relation] !== undefined ? relationMap[relation] : 0;
  },
  
  // 映射了解途径为数字
  mapChannelToNumber: function(channel) {
    const channelMap = {
      '亲友介绍': 0,
      '他人推荐': 1,
      '学校官微': 2,
      '网络信息': 3,
      '其他': 4
    };
    return channelMap[channel] !== undefined ? channelMap[channel] : 0;
  },
  
  // 映射课程为数字
  mapCourseToNumber: function(course) {
    return course ? course : 0;
  },
  
  // 映射报考课程为数字
  mapApplyCoursesToNumber: function(courses) {
    const coursesMap = {
      'A-level课程': 1,
      'A-level课程+艺术课程': 2
    };
    return coursesMap[courses] !== undefined ? coursesMap[courses] : 1;
  },
  
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      console.log(1);
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      });
      var data = this.data.data;
      console.log(data)
      if (data.relationship == "") {
        wx.showToast({
          title: '请选择您的身份',
          icon: 'none',
          duration: 2000
        });
      } else if (data.name == "") {
        wx.showToast({
          title: '请填写学生姓名',
          icon: 'none',
          duration: 2000
        });
      } else if (data.sex == "") {
        wx.showToast({
          title: '请选择性别',
          icon: 'none',
          duration: 2000
        });
      } else if (data.class == "") {
        wx.showToast({
          title: '请填写就读年级',
          icon: 'none',
          duration: 2000
        });
      } else if (data.mobile == "" || !/^0?1[3456789]\d{9}$/.test(data.mobile)) {
        wx.showToast({
          title: '请填写正确的手机号',
          icon: 'none',
          duration: 2000
        });
      } else if (data.email == "" || !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(data.email)) {
        wx.showToast({
          title: '请填写正确的邮箱',
          icon: 'none',
          duration: 2000
        });
      } else if (data.school == "") {
        wx.showToast({
          title: '请填写在读学校',
          icon: 'none',
          duration: 2000
        });
      } else if (data.current_lesson == "") {
        wx.showToast({
          title: '请选择在读课程',
          icon: 'none',
          duration: 2000
        });
      } else if (data.apply_courses == "") {
        wx.showToast({
          title: '请选择报考课程',
          icon: 'none',
          duration: 2000
        });
      } else if (data.goalarea == "") {
        wx.showToast({
          title: '请选择留学目的地',
          icon: 'none',
          duration: 2000
        });
      } else if (data.reason == "") {
        wx.showToast({
          title: '请选择了解途径',
          icon: 'none',
          duration: 2000
        });
      } else {
        wx.showLoading({
          title: '提交中',
        });
        
        // 映射字段
        const relationNumber = this.mapRelationToNumber(data.relationship);
        const channelNumber = this.mapChannelToNumber(data.reason);
        const courseNumber = this.mapCourseToNumber(data.class);
        const applyCoursesNumber = this.mapApplyCoursesToNumber(data.apply_courses);
        
        // 构建请求URL
        const url = 'https://www.huayaopudong.com/system/api-application';
        
        // 构建请求参数
        const params = {
          name: data.name,
          phone: data.mobile,
          wechat: data.wx || '',
          email: data.email,
          school: data.school,
          course: courseNumber,
          channel: channelNumber,
          relation: relationNumber,
          current_lesson: data.current_lesson,
          apply_courses: applyCoursesNumber,
          source: "miniapp",
          _t: Date.now()
        };
        
        // 发起HTTP请求
        wx.request({
          url: url,
          method: 'GET',
          data: params,
          success: (res) => {
            wx.hideLoading();
            console.log('接口调用成功:', res);
            
            // 根据接口返回判断是否成功
            if (res.statusCode === 200 && res.data && res.data.status == 0) {
              wx.showModal({
                title: '提交成功',
                content: '招生老师将在3个工作日内与您联系，敬请关注',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              });
            } else {
              wx.showModal({
                title: '提交失败',
                content: res.data && res.data.message ? res.data.message : '请稍后重试或联系招生老师',
                showCancel: false
              });
            }
          },
          fail: (err) => {
            wx.hideLoading();
            console.error('接口调用失败:', err);
            wx.showModal({
              title: '提交失败',
              content: '网络异常，请稍后重试或联系招生老师',
              showCancel: false
            });
          }
        });
      }
    }
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
})