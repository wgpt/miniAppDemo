declare namespace wx {


    /**
     * 请处理函数
     * */
    export interface apiOpions {

        url?: string; // 链接地址
        token?: string;
        data?: object; // 参数
        method?: 'get' | 'post'; // 默认方法 'get'
        auth?: boolean; // 是否开启授权认证
        queue?: boolean; // 授权失败是否进入队列(不希望检验授权，进入未授权缓存队列，授权成功后重新调用)
        contentType?: string; // 请求类型 'application/json'
        preUrl?: string; // 不用默认域名
        backType?: boolean; // 兼容成功返回格式， false;不处理
        isLogin?: boolean; // 检测是否授权;不进行请求
        updateStorage?: boolean; // [name;name] 重新获取缓存存中数据
        hideLoading?: boolean; // 是否关闭loading
        showLoading?: boolean;  // 是否开启loading
        loadingTitle?: string; // 提示名字
        mask?: boolean; // 是否开启罩层
        errorShow?: boolean// 业务错误直接显示， false 会推到 catch

    }

    export function api<T>(options: apiOpions): Promise<T>;

    /**
     * 清空请求列表
     * @param onlySetNull 是否只清空不再请求
     * */
    export function clearApiList(onlySetNull?: boolean): void

}

declare namespace wx.$ {
    export function showToast(options: {
        title: string,
        icon?: string,
        duration?: number,
        mask?: true
    }): void

    export function showModal(options: WechatMiniprogram.ShowModalOption): void

    export function settingWx(): void

    export function random(): void

    export function getPage(): void

    export function go(): void

    export function back(): void

    export interface calc {

    }
}