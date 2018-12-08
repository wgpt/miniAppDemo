/*
* 小程序 自定义 ajax
*
* */
let authFlag = false // 是否正在授权，不重得授权
let errorModal = false // 是否已弹一个错误弹窗

let apiList = [] // 请求失败队列

import md5 from './md5'

function api(op) {

  return new Promise((resolve, reject) => {

    let def = {
      token: wx.getStorageSync('token'),
      data: {},
      url: false, // 请求url
      method: 'get', // 默认方法
      auth: true, // 是否开启授权认证
      queue: false, // 授权失败是否进入队列(不希望检验授权，进入未授权缓存队列，授权成功后重新调用)
      contentType: 'application/json', // 请求类型
      preUrl: op.preUrl ? op.preUrl : wx.config.URL, // 不用默认域名
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

    showLoading(op)

    if (op.isLogin) { // 只检测登录, 会重新授权

      if (op.token) {
        resolve()
      } else {
        auth(op)
      }

      hideLoading(op)

      return
    }


    if (op.auth && (!op.token)) { // 用户信息缺失

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
    hideLoading(op)
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

            showLoading(op)

            clearApiList()
          }
        })
      }

    } else if (data.code == 500) {
      op.errorShow && wx.$.showToast({
        title: data.msg || '获取信息错误（错误码：4000）',
        icon: 'none'
      })

      op.reject(data)

    } else {
      hideLoading(op)
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

    let time = new Date().getTime()
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
        'token': op.token,
        'appKey': 'wx', // 加密验证
        'sign': md5.hexMD5('hg9ll7ylq5eiojc3uj' + time),
        'time': time
      },
      success(e) {

        if (e.data.code == 401) { // token 有误

          wx.removeStorageSync('token');

          reject(401)
          return
        }


        if (op.backType) { // 处理后返回
          if (e.data.code == 200) {

            resolve(e.data.data)

          } else {

            wx.hideLoading()

            if (!e) {
              e = []
              e.data = []
            }
            e.data['code'] = 500

            reject(e.data)  // 数据错误

          }


        } else {
          resolve(e.data)
        }

      },
      fail(e) {
        wx.hideLoading()

        e['code'] = 404
        e['message'] = '网络连接失败，请检测网络是否正常（错误码：5000）'

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
        url: wx.config.URL + '/token/getLogin',
        data: {
          code: res.code,
        },
        method: 'post',
        header: {
          'content-type': 'application/json'
        },
        success(json) {

          if (json.data.code == 401) { // 新用户

            let pages = getCurrentPages()
            let that = pages[pages.length - 1]  // 当前页

            that.setData({
              'userInfoShowStatus': true
            })
            wx.hideLoading()

            // return this.userInfoSure()
          } else if (json.data.code == 200) {
            let data = json.data.data
            if (data.token) {

              wx.setStorageSync("token", data.token);
              wx.setStorageSync("nickname", data.nickname);
              wx.setStorageSync("unionid", data.unionid);
              wx.setStorageSync("headimgurl", data.headimgurl);
              wx.setStorageSync("uid", data.uid);
              wx.setStorageSync("openid", data.openid);


              clearApiList()

              authFlag = false


            } else {
              wx.hideLoading()

              wx.showModal({
                title: '提示',
                showCancel: false,
                content: json.data.message || '获取信息失败，请重试（错误码：1000）',
                success() {
                  auth(op, false)
                }
              })


            }
          } else {
            wx.hideLoading()

            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '登录失败，请重试（错误码：2000）',
              success() {
                auth(op, false)
              }
            })
          }


        },
        fail() {
          wx.hideLoading()

          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '网络连接失败，请检测网络是否正常（错误码：3000）',
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
      hideLoading(data[i])
    } else {
      rBack(data[i])
    }


  }


}


function showLoading(op) {
  op.showLoading && wx.$.showLoading({
    title: op.loadingTitle,
    mask: op.mask
  })
}

function hideLoading(op) {
  op.hideLoading && wx.hideLoading()
}


export default (key) => {
  wx.$.settingWx(key, api)
  wx.$.settingWx('clearApiList', clearApiList)
}
