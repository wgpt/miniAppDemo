/*
* 小程序 ajax
*
* */
let authFlag = false // 是否正在授权，不重得授权
let errorModal = false // 是否已弹一个错误弹窗

let apiList = [] // 请求失败队列


function api(op) {

    return new Promise((resolve, reject) => {


        let def = {
            token: wx.getStorageSync('token'),
            openid: wx.getStorageSync('open_id'),
            data: {},
            url: false, // 请求url
            method: 'get', // 默认方法
            auth: true, // 是否开启授权认证
            queue: false, // 授权失败是否进入队列(不希望检验授权，进入未授权缓存队列，授权成功后重新调用)
            contentType: 'application/json', // 请求类型
            preUrl: op.preUrl ? op.preUrl : wx.config.url, // 不用默认域名
            backType: true, // 兼容成功返回格式， false,不处理
            isLogin: false, // 检测是否授权,不进行请求
            updateStorage: false, // [name,name] 重新获取缓存存中数据
            hideLoading: true, // 是否关闭loading
            showLoading: true,  // 是否开启loading
            loadingTitle: '加载中', // 提示名字
            mask: true, // 是否开启罩层
            errorShow: true // 业务错误直接显示， false 会推到 catch
        }


        op = Object.assign(def, op) // 合并

        op.resolve = resolve
        op.reject = reject

        op.showLoading && wx.showLoading({
            title: op.loadingTitle,
            mask: op.mask
        })

        if (op.isLogin) { // 只检测登录, 会重新授权

            if (op.token && op.openid) {
                resolve()
            } else {
                auth(op)
            }

            op.hideLoading && wx.hideLoading()

            return
        }

        if (!op.url) {

            console.log('url参数错误')
            wx.hideLoading()

            reject()
            return


        }


        if (op.auth && (!op.token || !op.openid)) { // 用户信息缺失

            auth(op)

        } else {

            if (authFlag && op.auth) { // 有正在授权 直接进入队列
                apiList.push(op)

            } else {
                rBack(op)
            }

        }


    })
}


/**
 * 调用接口上层处理，再resolve 结果
 * */

function rBack(op) {
    r(op).then((data) => {
        op.hideLoading && wx.hideLoading()
        op.resolve(data)
    }).catch((data) => {


        if (data == 401) { // 未授权进入队列
            (op.auth || op.queue) && auth(op)
        } else if (data.code == 404) { // 错误确认重调
            apiList.push(op)

            if (!errorModal) {
                errorModal = true
                wx.$.showModal({
                    content: data.message,
                    success() {
                        errorModal = false

                        let cache = apiList[0]

                        cache.showLoading && wx.showLoading({ // 罩层
                            title: cache.loadingTitle,
                            mask: cache.mask
                        })

                        clearApiList()
                    }
                })
            }

        } else if (data.code == 500) {
            wx.$.showToast({
                title: data.message,
                icon: 'none'
            })

        } else {
            op.hideLoading && wx.hideLoading()
            op.reject(data)
        }

    })
}


function r(op) { // 调用接口

    return new Promise((resolve, reject) => {


        if (op.updateStorage) { // 添加 除openid token外 缓存中的key
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
                // openid: op.openid
            },
            header: {
                'content-type': op.contentType,
                'Authorization': 'Bearer ' + op.token
            },
            success(e) {

                if (e.data.status_code == 401) { // 过期

                    wx.removeStorageSync('token');


                    reject(401)
                    return
                }


                if (op.backType) { // 处理后返回
                    if (e.data.status_code == 200 || e.data.code == 200) {

                        if (e.data.hasOwnProperty('error_code')) { // 新样版返加数据

                            if (e.data.error_code == 0) { // 业务数据正确
                                resolve(e.data.data)

                            } else {
                                op.errorShow && wx.$.showToast({
                                    title: e.data.message,
                                    icon: 'none'
                                })
                                reject(e.data)
                            }

                        } else {
                            e.data.hasOwnProperty('data') ? resolve(e.data.data) : resolve(e.data)
                        }

                    } else {
                        wx.hideLoading()

                        e.data['code'] = 500

                        reject(e.data)  // 系统错误

                        // reject(e.data)
                    }


                } else {
                    resolve(e.data)
                }

            },
            fail(e) {
                wx.hideLoading()

                e['code'] = 404
                e['message'] = '网络连接失败，请复试'

                reject(e)


            }

        })

    })


}

/**
 * 授权
 * @param op 请求信息
 * @param reGet flase: 重新请求
 *
 * */

function auth(op, reGet = true) { // 授权


    reGet && apiList.push(op) // 进入队列

    if (authFlag && reGet) { // 有正在授权

        return
    }


    authFlag = true


    wx.login({
        success(res) {
            wx.request({
                url: wx.config.url + 'getWxUserInfo',
                data: {
                    code: res.code,
                },
                method: 'post',
                header: {
                    'content-type': 'application/json'
                },
                success(json) {

                    if (json.data.status_code == 403) { // 新用户

                        let pages = getCurrentPages()
                        let that = pages[pages.length - 1]  // 当前页

                        that.setData({
                            'userInfoShowStatus': true
                        })
                        wx.hideLoading()

                        // return this.userInfoSure()
                    } else {
                        let data = json.data.data
                        if (data.token) {

                            wx.setStorageSync("token", data.token);
                            wx.setStorageSync("open_id", data.open_id);
                            wx.setStorageSync("nick_name", data.nick_name);
                            wx.setStorageSync("avatar_url", data.avatar_url);
                            wx.setStorageSync("uid", data.uid);
                            wx.setStorageSync("invite_code", data.invite_code);

                            clearApiList()

                            authFlag = false
                            /*that.onLoad(that.options)

                            that.onShow()*/


                        } else {
                            wx.hideLoading()

                            wx.showModal({
                                title: '提示',
                                showCancel: false,
                                content: json.data.message || '获取信息失败，请重试',
                                success() {
                                    auth(op, false)
                                }
                            })


                        }
                    }


                },
                fail() {
                    wx.hideLoading()

                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '获取信息失败，请重试',
                        success() {
                            auth(op, false)
                        }
                    })


                }
            })
        }
    })

}

function clearApiList() { // 清空队列,重新回调

    let token = wx.getStorageSync('token'),
        openid = wx.getStorageSync('open_id')

    let data = apiList
    authFlag = false
    apiList = []


    for (let i in data) {

        data[i].token = token
        data[i].openid = openid

        if (data[i].isLogin) { // 只重新授权
            data[i].resolve()
        } else {
            rBack(data[i])
        }


    }

    wx.hideLoading()


}


export default (key) => {
    wx.$.settingWx(key, api)
    wx.$.settingWx('clearApiList', clearApiList)
}
