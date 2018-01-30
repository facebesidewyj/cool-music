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
  },

  /**
   * 元素属性相关操作
   * @param  {Element} el   要设置属性的元素
   * @param  {String} name  属性名
   * @param  {String} val   属性值
   * @return {String}       属性值
   */
  attr(el, name, val) {
    if (val) {
      return el.setAttribute(name, val);
    } else {
      return el.getAttribute(name);
    }
  },

  /**
   * 元素样式操作
   * @param  {Element} el   要设置样式的元素
   * @param  {String} name  样式名
   * @param  {String} val   样式值
   */
  setCss(el, name, val) {
    let elementStyle = document.createElement('div').style;

    let transformNames = {
      webkit: 'webkitTransform',
      Moz: 'MozTransform',
      O: 'OTransform',
      ms: 'msTransform',
      standard: 'transform'
    };

    let keyName = '';
    for (let key in transformNames) {
      if (typeof elementStyle[transformNames[key]] !== 'undefined') {
        keyName = key;
      }
    }

    if (keyName) {
      if (keyName !== 'standard') {
        name = keyName + name.charAt(0).toUpperCase() + name.substr(1);
      }
    }

    el.style[name] = val;
  }
};
