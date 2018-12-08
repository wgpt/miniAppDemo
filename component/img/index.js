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
        },
        loadText: {
            type: String,
            value: ''
        }
    },
    data: {
        loading: true
    },
    methods: {

        load(e) {
      
            let detail = {
                width: e.detail.width,
                height: e.detail.height
            }


            this.setData({
                'srcR': this.data.src,
                src: '',
                detail,
            }, () => {
                this.setData({ // 动画
                    animate: 'tran'
                })
            })

            this.triggerEvent("load", detail)
        },
        error(e) {
            this.setData({
                loadText: '图片加载失败',
                loading: false
            })

        }
    },
    ready() {
        if (!this.data.src) {
            this.setData({
                loadText: '图片不存在',
                loading: false
            })
        }
    },

})

