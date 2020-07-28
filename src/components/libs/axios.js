import axios from 'axios'
import { Spin, Message } from 'view-design'
Message.config({ top: 100 })

class HttpRequest {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  config(url, token) {
    this.baseUrl = url
    this.access_token = token
  }
  getInsideConfig() {
    const config = {
      baseURL: `${this.baseUrl}`,
      headers: {
        'Authorization': `Bearer ${this.access_token}`,
      },
      withCredentials: false,
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      Spin.hide()
    }
  }
  interceptors(instance, url) {
    // 请求拦截
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      if (!Object.keys(this.queue).length) {
        // Spin.show() // 不建议开启，因为界面不友好
      }
      this.queue[url] = true
      config.headers['Content-Type'] = 'application/json'
      return config
    }, error => {
      return Promise.reject(error)
    })
    // 响应拦截
    instance.interceptors.response.use(res => {
      this.destroy(url)
      const { data, status } = res
      if (data.code === 'OK' || data.code === '201') {
        return Promise.resolve(data);
      }
      return Promise.reject(data)
    }, error => {
      if (error.message === "Network Error") {
        Message.error({
          content: '网络错误，无法连接到服务！',
          background: true,
          duration: 6
        });
        return Promise.reject(error)
      }
      this.destroy(url)
      return Promise.reject(error)
    })
  }
  request(options) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options.url)
    return instance(options)
  }
}
export default HttpRequest
