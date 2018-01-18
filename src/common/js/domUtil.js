/**
 * DOM操作相关工具类
 * @type {Object}
 */
export const domUtil = {

  /**
   * 添加样式名
   * @param {Element} el        传入的元素
   * @param {String} className  类名
   */
  addClass(el, className) {
    if (!this.hasClass(el, className)) {
      let classNameArray = el.className.split(' ');
      classNameArray.push(className);
      el.className = classNameArray.join(' ');
    }
  },
  /**
   * 判断当前元素是否含有该类名
   * @param  {Element}  el       传入的元素
   * @param  {String}  className 类名
   * @return {Boolean}           是否含有类名
   */
  hasClass(el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
  }
};
