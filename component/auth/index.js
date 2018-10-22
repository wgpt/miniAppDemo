// 新用户登录弹窗


Component({
    properties: {
        // 这里定义了innerText属性，属性值可以在组件使用时指定
        show: {
            type: Boolean,
            value: true
        }
    },
    data: {
        // 这里是一些组件内部数据
        userInfoApi: 0,
    },
    methods: {
        // 这里是一个自定义方法
        UserInfo_click(e) {

            this.setData({
                show: false
            })

            // let op = this.data.userInfoApi;

            // this.data.userInfoApi = 0;

            if (e.currentTarget.dataset.name == 1) {
                let that = this
                wx.$.showModal({
                    content: '授权失败，请重试',
                    success(){
                        that.setData({
                            show: true
                        })
                    }
                })
            }else{
                this.userInfoSure(e)
            }
        },

        userInfoSure(e){
            this.setData({show: false })
            wx.showLoading({
                title: '正登录中...'
            })

            wx.login({
                success: (res) => {

                    wx.request({
                        url: wx.config.url + 'newUser',
                        data: {
                            code: res.code,
                            iv: e.detail.iv,
                            encryptedData: e.detail.encryptedData
                        },
                        method: 'post',
                        header: {
                            'content-type': 'application/json'
                        }, success: (json) => {

                            let data = json.data.data


                            if (data.token) {


                                wx.setStorageSync("token", data.token);
                                wx.setStorageSync("open_id", data.open_id);
                                wx.setStorageSync("nick_name",  data.nick_name);
                                wx.setStorageSync("avatar_url",  data.avatar_url);
                                wx.setStorageSync("uid", data.uid);
                                wx.setStorageSync("invite_code", data.invite_code);


                                wx.$.showToast({
                                    title: '登录成功'
                                })

                                setTimeout(()=>{
                                    wx.clearApiList() // 清除队列

                                },300)

                            } else {
                                wx.hideLoading()

                                let that = this
                                wx.$.showModal({
                                    content: json.data.message || '授权失败，请重试',
                                    success(){
                                        that.setData({
                                            show: true
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

