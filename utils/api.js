const app = getApp()

const url = wx.config.url // 线上

let preOp = 0;

let userInfoApi = 0;

function api(op) {
    wx.showLoading({
        title: '加载中',
        mask: true
    })
    let def = {
        token: false,
        openid: false,
        data: {},
        url: false,
        method: 'get',
        cp: false,
        auth: true,
        contentType: 'application/json',
        preUrl: '',
        preOp: false,
        backType: true, // 兼容成功返回格式， false,不处理
        isLogin: false, // 检测是否授权,不进行请求
        updateStorage: false, // [name,name] 重新获取缓存存中数据
        hideLoading: true, // 是否关闭loading
        success(e) {

        },
        complete(e) {

        },
        fail(e) {

        }
    }

    console.log(op)

    if (op.preOp && preOp) { // 指 op

        op = preOp
        preOp = 0;

        // console.log(op);

    } else {
        op = Object.assign(def, op);

        op.preUrl = op.preUrl ? op.preUrl : url;

    }

    op.token = wx.getStorageSync('token');
    op.openid = wx.getStorageSync('open_id');


    if (!op.url && !op.isLogin) {

        console.log('url参数错误')

        wx.hideLoading()
        return
    } else if (op.auth && !op.token) {

        if (!op.cp) {

            console.log('this不存在')
        }

        // op.fail({
        //     mes: '还未登录',
        //     status: 'false'
        // });


        wx.login({
            success: (res) => {
                // console.log(e)
                // wx.setStorageSync('code', res.code);

                wx.request({
                    url: wx.config.url + 'getWxUserInfo',
                    data: {
                        code: res.code,
                    },
                    method: 'post',
                    header: {
                        'content-type': 'application/json'
                    }, success: (json) => {

                        if(json.data.status_code == 400){ // 新用户

                            userInfoApi = op;

                            // 展示点击授权框
                            preOp = op


                            op.cp.setData({
                                'userInfoShowStatus': true
                            })

                            wx.hideLoading()

                            // return this.userInfoSure()
                        }else{
                            if (json.data.token) {

                                wx.setStorageSync("token", json.data.token);
                                wx.setStorageSync("open_id", json.data.open_id);
                                wx.setStorageSync("nick_name", json.data.nick_name);
                                wx.setStorageSync("avatar_url", json.data.avatar_url);
                                wx.setStorageSync("uid", json.data.uid);
                                wx.setStorageSync("invite_code", json.data.invite_code);

                                api(op)


                            } else {
                                op.fail && op.fail(json);
                                wx.showToast({
                                    title: json.data.message || '授权被拒',
                                    icon: 'loading',
                                })


                            }
                        }



                    }
                })
            }
        })




        return false


    }

    if (op.isLogin) {
        if (op.hideLoading) {
            wx.hideLoading()
        }
        op.success && op.success()
        return
    }

    if (op.updateStorage) { // 添加除 openid token 外的唯一key
        for (var i in op.updateStorage) {

            op.data[op.updateStorage[i]] = wx.getStorageSync(op.updateStorage[i])
        }

    }


    wx.request({
        url: op.preUrl + op.url,
        method: op.method,
        data: {
            ...op.data,
            // token: op.token,
            openid: op.openid
        },
        header: {
            'content-type': op.contentType,
            'Authorization': 'Bearer ' + op.token
        },
        success(e) {

            if(e.data.status_code == 401){

                wx.removeStorageSync('token');

                api(op)
                return
            }

            if (op.hideLoading) {
                wx.hideLoading()
            }


            if (op.backType) {
                if (e.data.status_code == 200) {
                    op.success && op.success(e.data)
                }else {
                    setTimeout(() => {
                            wx.showToast({
                                title: e.data.message || '网络错误',
                                duration: 3000,
                                icon: 'none'
                            })

                        }, 0)

                        op.fail && op.fail(e.data)
                }


            } else {
                op.success && op.success(e.data)
            }


        },
        fail(e) {

            if (op.hideLoading) {
                wx.hideLoading()
            }
            setTimeout(() => { // 防与Loading冲突
                wx.showToast({
                    title: e.message,
                    duration: 3000,
                    icon: 'none'
                })
            }, 0)

        },
        complete(e) {
            op.complete && op.complete(e)
        }

    })


}

module.exports = api;
