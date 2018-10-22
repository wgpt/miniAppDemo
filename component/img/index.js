// 新用户登录弹窗


Component({
    properties: {
        src: {
            type: String,
            value: ''
        },
        mode: {
            type: String,
            value: ''
        }
    },
    data: {},
    methods: {
        load(e) {

            this.setData({
                'srcR': this.data.src,
                src: ''
            }, () => {
                this.setData({ // 动画
                    animate: 'tran'
                })
            })
        },

    }

})

