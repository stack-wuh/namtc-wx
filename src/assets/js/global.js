const commonFn = {
  j2s(obj) {
    return JSON.stringify(obj)
  },
  getQueryParam(url) {
    let query = url.match(/\?(\S*)/);
    if (query) {
      query = query[1];
      let query_arr = query.split('&');
      let query_obj = {};
      query_arr.forEach(item => {
        let arr = item.split('=');
        query_obj[arr[0]] = arr[1]

      });
      return query_obj
    } else {
      return {}
    }
  },
  shallowRefresh(name) {
    router.replace({
      path: '/refresh',
      query: {
        name: name
      }
    })
  },
  closeGlobalLoading() {
    setTimeout(() => {
      store.dispatch('showLoading', false)
    }, 0)
  },
  openGlobalLoading() {
    setTimeout(() => {
      store.dispatch('showLoading', true)
    }, 0)
  },
  cloneJson(obj) {
    return JSON.parse(JSON.stringify(obj))
  },
}

export default commonFn
