/**
 * toast 原生提示框
 * @param {String} title
 */
export function toast(title, icon = 'none') {
  title &&
    uni.showToast({
      title,
      icon,
      duration: 2000
    })
}

/**
 * modal 原生弹窗
 * @param {String} title
 * @param {String} content
 * @param {Function} callback
 * @param {Boolean} showCancel
 * @param {String} confirmColor
 * @param {String} confirmText
 */
export function modal(title, content, callback, showCancel, confirmColor, confirmText) {
  uni.showModal({
    title,
    content,
    showCancel: showCancel || false,
    cancelColor: '#7f7f7f',
    confirmColor: confirmColor || '#465CFF',
    confirmText: confirmText || '确定',
    success(res) {
      if (res.confirm) {
        callback && callback(true)
      } else {
        callback && callback(false)
      }
    },
    fail(err) {
      console.error(err)
    }
  })
}
