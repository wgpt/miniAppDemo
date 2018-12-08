//import { Token } from 'utils/token.js';
import patch from "utils/patch" // es6 补丁
import util from 'utils/util' // 公用库

import mpa from 'utils/mpa' // ajax

import config from 'utils/config' // 公用配置


//app.js
App({
    onLaunch: function () {

        patch()
        config()
        util('$')
        mpa('api')

        wx.getSystemInfo({
            success: function (res) {
                wx.setStorageSync('sysInfo', res); // 手机信息
            }
        })

    }


})