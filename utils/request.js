import Request from '@/uni_modules/luch-request'
import { baseURL } from '@/api'
import { debounce } from './uni/debounce.js'

/**
 *重复请求拦截 - 如果上一次请求还没有结束，相同的请求不会继续发送
 * cachcRequest：用与缓存每次请求的key
 * cacheRequestToast：用于缓存每次请求的key，用于判断是否需要弹出提示
 */
let cachcRequest = {}
let cacheRequestToast = {}

const http = new Request({
  baseURL,
  timeout: 60 * 1000,
  custom: {
    loading: false, // 是否增加loading，可以设置为true 或者 string
    retry: 1, // 设置自动发送请求次数，默认1次
    closerePeatIntercept: false, // 是否关闭该接口重复请求拦截
    isSignatrue: true, // 是否开启验签
    withoutErrorToast: false // 是否关闭错误提示
  },
  // 重复请求拦截
  getTask: (task, config) => {
    if (config.custom.closerePeatIntercept) return
    let reqKey = generateReqKey(config)
    if (cachcRequest[reqKey]) {
      cacheRequestToast[reqKey] = 1
      task.abort()
    } else {
      cachcRequest[reqKey] = 1
    }
  }
})

// 请求拦截
http.interceptors.request.use((config) => {
  // token
  const token = uni.getStorageSync('token')
  if (token) {
    config.header['Authorization'] = 'Bearer ' + token
  }

  /**
   * loading
   */
  if (config.custom?.loading) {
    uni.showLoading({
      title: typeof config.custom?.loading === 'string' ? config.custom?.loading : '加载中...',
      mask: true
    })
  }

  return config
})

// 响应拦截
http.interceptors.response.use(
  (response) => {
    return new Promise((resolve, reject) => {
      // 清除 loading
      if (response.config.custom?.loading) {
        uni.hideLoading()
      }

      // 重复请求拦截 请求成功 删除缓存
      let reqKey = generateReqKey(response.config)
      delete cachcRequest[reqKey]

      // 处理返回结果
      const resData = response.data

      switch (resData.code) {
        case 200:
          resolve(resData)
          break
        case 401:
          uni.showToast({
            title: '登录过期，请重新登录',
            icon: 'none',
            mask: true
          })
          // 回跳登录页
          debounce(() => {
            uni.reLaunch({
              url: '/pages/common-user/login'
            })
          }, 2000)
          reject(resData.msg)
          break
        case 500:
          response.config.custom.withoutErrorToast ||
            uni.showToast({
              title: resData.msg,
              icon: 'none',
              duration: 4000
            })
          reject(response)
          break
        default:
          resolve(response)
          break
      }
    })
  },
  //  错误处理 (statusCode !== 200)
  async (response) => {
    // 清除 loading
    if (response.config.custom?.loading) {
      uni.hideLoading()
    }

    const config = response.config
    // 重复请求拦截 - 如果是重复请求，不会继续发送请求，直接返回上一次请求的结果
    let reqKey = generateReqKey(response.config)
    if (cacheRequestToast[reqKey]) {
      delete cacheRequestToast[reqKey]
      return Promise.reject(response)
    }
    if (!config || !config.custom.retry) return Promise.reject(response)
    // 请求超时判断
    if (response?.errMsg === 'request:fail timeout') {
      uni.showToast({
        title: '请求超时',
        icon: 'error',
        duration: 3000,
        mask: true
      })
      return Promise.reject(response)
    }

    if (response.statusCode) {
      return Promise.reject({ type: 'none', msg: '系统维护中，请稍后再试' })
    }
    // 网络断开 或者 后端卡死
    if (!response.statusCode) {
      // 重复请求拦截 请求失败 删除缓存
      delete cachcRequest[reqKey]
      // custom.retryCount用来记录当前是第几次发送请求
      config.custom.retryCount = config.custom.retryCount || 0
      // 如果当前发送的请求大于等于设置好的请求次数时，不再发送请求，返回最终的错误信息
      if (config.custom.retryCount >= config.custom.retry) {
        uni.showToast({
          title: '当前网络不稳定,请检查您的网络设置',
          icon: 'none',
          duration: 3000,
          mask: true
        })
        return Promise.reject(response)
      }
      // 记录请求次数+1
      config.custom.retryCount += 1
      // 设置请求间隔 在发送下一次请求之前停留一段时间，时间为上方设置好的请求间隔时间
      let backOff = new Promise((resolve) => {
        setTimeout(() => {
          resolve(null)
        }, 500)
      })

      // 再次发送请求
      await backOff
      return await http.request(config)
    }
    return Promise.reject(response)
  }
)

/**
 * 工具函数
 */
// 生成请求key
function generateReqKey(config) {
  const { method, url, params, data } = config
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
}
