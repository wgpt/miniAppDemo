const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

// 删除 下标为key 的对象
const removeObject = (data, key) => {

    if (Array.isArray(data)) { // 对象

        data[key] = 0;

        return data.filter(item => item)


    } else if (typeof data == 'object') { // 数组过滤下标不为数字的数据
        let ar = [];
        for (var i in data) {

            if (i == key || isNaN(i)) continue

            ar.push(data[i])
        }

        return ar

    } else {
        console.log('不是对象或数组')
        return data
    }


}

// 弹窗
const showToast = (op) => {

    let def = {
        title: '成功',
        icon: 'success',
        duration: 1200,
        mask: true
    }

    def = Object.assign(def, op)

    // console.log(def)

    setTimeout(() => {

        wx.showToast({
            ...def
        })

    }, 0)
}

// 注入wx
const settingWx = (key, value) => {
    if (!wx) {
        console.log('wx还未初始化')
    } else if (wx[key]) {
        console.log(`utils/util.js: wx中${key}已存在`)
    } else {
        wx[key] = value
        // console.log(wx)
    }
}

// 随机数 n 到 m
const random = (n, m) => {
    return Math.floor(Math.random() * (m - n + 1) + n);
}


/**
 * // 倒计时计算
 *
 * @param Object
 * {
 *   end 终结时间
 *   start 开始时间
 *
 *   flag 自减**毫秒数**  如果存在 time - flag
 * }
 * */
const countTime = ({end, start, flag, time}) => {
    //获取当前时间

    let leftTime
    if (flag) {
        leftTime = time - flag;
    } else {
        leftTime = end - start;
    }

    // console.log(leftTime,end,start,flag)

    if (leftTime >= 0) {
        return {
            d: Math.floor(leftTime / 1000 / 60 / 60 / 24),
            h: formatNumber(Math.floor(leftTime / 1000 / 60 / 60 % 24)),
            m: formatNumber(Math.floor(leftTime / 1000 / 60 % 60)),
            s: formatNumber(Math.floor(leftTime / 1000 % 60)),
            end: leftTime
        }
    } else {
        return 0
    }
}

/*
* 返回上一页，没上一页, 返回首页
*
* */
const back = () => {

    let page = getCurrentPages()

    if (page.length == 1) {

        wx.navigateTo({
            url: '/pages/index/index'
        })

    } else {
        wx.navigateBack()
    }

}


/*验证*/
const verification = {
    mobile(str) {
        str = '' + str
        return /^0\d{2,3}-?\d{7,8}$/.test(str) || /^\d{11}$/.test(str)
    },
    phone(str) {
        str = '' + str
        return /^\d{11}$/.test(str)
    },
    number(str) {
        return /^\d+$/.test(str)
    },
    email(str) {
        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(
            str
        )
    },
    postalCode(str) {
        str = '' + str
        return /^[0-9]{6}$/.test(str)
    }
}

/**
 * 删除数据，重新渲染
 *
 * @param that 当前页面
 * @key data 字段
 * @flag 数组 key
 * @value 过滤值
 *
 * */

const countData = (that, key, flag, value) => {

    let data = that.data[key]

    let ar = []

    let list = []

    for (var i in data) {

        if (data[i][flag] == value) continue
        ar.push(data[i])

    }
    list[key] = ar

    that.setData({...list})

}

/**
* 确定弹窗
* */

const showModal = (op)=>{

    let def = {
        title: '提示',
        content: 'msg',
        showCancel: false
    }

    def = Object.assign(def, op)

    // console.log(def)

    wx.showModal(def)


}


/*
* 当前页
* */
const getPage = ()=>{
    let pages = getCurrentPages()

    return pages[pages.length - 1]  // 当前页

}

/**
* 当前页
* */
const go = (url = false,type=1)=>{
    if(!url){
        console.log('url 不存在')
    }

    if(type == 1){
        wx.navigateTo({
          url
        })
    }else if(type == 2){
        wx.redirectTo({
          url
        })
    }

}


const $ = {
    formatTime,
    removeObject,
    showToast,
    showModal,
    settingWx,
    random,
    countTime, /*倒计时计算*/
    verification, /*验证*/
    countData, /*删除数据，重新渲染*/
    getPage, // 当前页
    go, // 自定跳转
}

const init = (key) => {
    settingWx(key, $)
}

export default init


