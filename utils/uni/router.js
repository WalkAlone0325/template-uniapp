import { queryParams, deepMerge, page } from './util'

class Router {
  constructor() {
    this.config = {
      type: 'navigateTo',
      url: '',
      delta: 1, // navigateBack页面回退层数
      params: {} // 参数
    }
    // 重新绑定this
    this.router = this.router.bind(this)
  }

  // 补 /
  addRootPath(url) {
    return url[0] === '/' ? url : `/${url}`
  }

  // 混合路由参数
  mixinParam(url, params) {
    url = url && this.addRootPath(url)

    let query = ''
    if (/.*\/.*\?.*=.*/.test(url)) {
      query = queryParams(params, false)
      return (url += `&${query}`)
    }

    query = queryParams(params)
    return (url += query)
  }

  // 跳转方法
  router(options = {}, params = {}) {
    let mergeConfig = {}

    if (typeof options === 'string') {
      mergeConfig.url = this.mixinParam(options, params)
      mergeConfig.type = 'navigateTo'
    } else {
      mergeConfig = deepMerge(this.config, options)
      mergeConfig.url = this.mixinParam(options.url, options.params)
    }
    if (mergeConfig.url === page()) return

    if (params.intercept) {
      this.config.intercept = params.intercept
    }

    mergeConfig.params = params
    mergeConfig = deepMerge(this.config, mergeConfig)

    this.openPage(mergeConfig)
  }

  openPage(config) {
    // 解构参数
    const { url, type, delta } = config
    if (config.type == 'navigateTo' || config.type == 'to') {
      uni.navigateTo({
        url
      })
    }
    if (config.type == 'redirectTo' || config.type == 'redirect') {
      uni.redirectTo({
        url
      })
    }
    if (config.type == 'switchTab' || config.type == 'tab') {
      uni.switchTab({
        url
      })
    }
    if (config.type == 'reLaunch' || config.type == 'launch') {
      uni.reLaunch({
        url
      })
    }
    if (config.type == 'navigateBack' || config.type == 'back') {
      uni.navigateBack({
        delta
      })
    }
  }
}

export default new Router().router
