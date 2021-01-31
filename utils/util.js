/**
 * 扩展Date原型，增加格式化方法
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：(new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
 * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
 */
Date.prototype.Format = function (fmt = 'yyyy-MM-dd hh:mm:ss') {
    const o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds(), // 毫秒
    }
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            `${this.getFullYear()}`.substr(4 - RegExp.$1.length),
        )
    for (const k in o)
        if (new RegExp(`(${k})`).test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length),
            )
    return fmt
}


// 弹窗
const showToast = (op) => {

    let def = {
        title: 'xxxx',
        icon: 'none',
        duration: 1500,
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


/**
 * 确定弹窗
 * */

const showModal = (op) => {

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
const getPage = () => {
    let pages = getCurrentPages()
    return pages[pages.length - 1]  // 当前页
}

/**
 * 当前页
 * */
const go = (url = false, type = 1) => {
    if (!url) {
        console.log('url 不存在')
    }

    if (type == 1) {
        wx.navigateTo({
            url
        })
    } else if (type == 2) {
        wx.redirectTo({
            url
        })
    }

}


/*
* 精确计算
* */
const calc = {
    /*
    函数，加法函数，用来得到精确的加法结果
    说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
    参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
    调用：Calc.Add(arg1,arg2,d)
    返回值：两数相加的结果
    */
    Add: function (arg1, arg2) {
        arg1 = arg1.toString(), arg2 = arg2.toString();
        var arg1Arr = arg1.split("."), arg2Arr = arg2.split("."), d1 = arg1Arr.length == 2 ? arg1Arr[1] : "", d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
        var maxLen = Math.max(d1.length, d2.length);
        var m = Math.pow(10, maxLen);
        var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
        var d = arguments[2];
        return typeof d === "number" ? Number((result).toFixed(d)) : result;
    },
    /*
    函数：减法函数，用来得到精确的减法结果
    说明：函数返回较为精确的减法结果。
    参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
    调用：Calc.Sub(arg1,arg2)
    返回值：两数相减的结果
    */
    Sub: function (arg1, arg2) {
        return Calc.Add(arg1, -Number(arg2), arguments[2]);
    },
    /*
    函数：乘法函数，用来得到精确的乘法结果
    说明：函数返回较为精确的乘法结果。
    参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
    调用：Calc.Mul(arg1,arg2)
    返回值：两数相乘的结果
    */
    Mul: function (arg1, arg2) {
        var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
        m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    },
    /*
    函数：除法函数，用来得到精确的除法结果
    说明：函数返回较为精确的除法结果。
    参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
    调用：Calc.Div(arg1,arg2)
    返回值：arg1除于arg2的结果
    */
    Div: function (arg1, arg2) {
        var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
        m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    }
};

/**
*过滤规则
*
* */
const valid = {
    nullable(value){ // 去空格 能换行
       return  value.replace(/[^\S\n\r]/g, '')
    },
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



const $ = {
    showToast,
    showModal,
    settingWx,
    random,
    getPage, // 当前页
    go, // 自定跳转
    back,
    calc, // 精确计算
    valid // 过滤规则
}

const init = (key) => {
    settingWx(key, $)
}

export default init


