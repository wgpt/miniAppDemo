// 新用户登录弹窗


import md5 from "../../utils/md5";

Component({
  properties: {
    collect: {
      type: Object,
      value: {},
    }
  },
  data: {
    userInfoApi: 0,
  },
  methods: {
    hide(e){
      this.setData({
        [e.currentTarget.dataset.name]: false
      })
    },
    userClick(e) {

      this.setData({
        show: false
      })

      // let op = this.data.userInfoApi;

      // this.data.userInfoApi = 0;

      if (e.currentTarget.dataset.name == 1) {
        let that = this
        wx.$.showModal({
          content: '授权失败，请重试',
          success() {
            that.setData({
              show: true
            })
          }
        })
      } else {
        this.userInfoSure(e)
      }
    },

    userInfoSure(e) {
      this.setData({"collect.authModal": false})
      wx.showLoading({
        title: '正登录中...'
      })

      wx.login({
        success: (res) => {
          let time = new Date().getTime()
          wx.request({
            url: wx.config.URL + '/auth/mp_register',
            data: {
              code: res.code,
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData
            },
            method: 'post',
            header: {
              'content-type': 'application/json',
              'x-api-appkey': 'mp', // 加密验证
              'x-api-sign': md5.hexMD5(wx.config.secretKey + time),
              'x-api-clientTime': time
            }, success: (json) => {

              if (json.data.token) {

                wx.$.setUserInfo(json.data.token)


                wx.$.showToast({
                  title: '登录成功'
                })

                setTimeout(() => {
                  wx.clearApiList() // 清除队列

                }, 300)

              } else {
                wx.hideLoading()

                let that = this
                wx.$.showModal({
                  content: '授权失败，请重试',
                  success() {
                    that.setData({
                      "collect.authModal": true
                    })
                  }
                })

              }
            }
          })
        }
      });

    },
  }
})

