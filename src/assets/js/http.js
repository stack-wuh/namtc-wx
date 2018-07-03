import qs from 'qs'
const apiMethods = {
  methods: {
    apiGet(url, data) {
      _g.openGlobalLoading()
      url = PATH + url
      return new Promise((resolve, reject) => {
        axios.get(url, data).then((response) => {
          resolve(response.data)
          _g.closeGlobalLoading()
        }, (response) => {
          reject(response)
          _g.closeGlobalLoading()
          // bus.$message({
          //   message: '请求超时，请检查网络',
          //   type: 'warning'
          // })
        })
      })
    },
    apiPost(url, data) {
      _g.openGlobalLoading()
      url = PATH + url
      data = qs.stringify(data)
      return new Promise((resolve, reject) => {
        axios.post(url, data).then((response) => {
          _g.closeGlobalLoading()
          resolve(response.data)
        }).catch((response) => {
          _g.closeGlobalLoading()
          resolve(response)
          // bus.$message({
          //   message: '请求超时，请检查网络',
          //   type: 'warning'
          // })
        })
      })
    },
  },
  computed: {
    showLoading() {
      return store.state.globalLoading
    }
  }
}

export default apiMethods
