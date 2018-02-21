/**
 * 常用工具类
 * @type {Object}
 */
export const util = {
  /**
   * 格式化时间戳
   * @param  {Number} time 传入的时间戳
   * @return {Number}      格式化好的时间戳
   */
  formatTime(time) {
    time = Math.floor(time);

    let min = Math.floor(time / 60);

    let second = time % 60;
    if (second.toString().length === 1) {
      second = '0' + second;
    }

    return `${min}:${second}`;
  },

  /**
   * 打乱数组
   * @param  {Array} arr 传入的数组
   * @return {Array}     打乱之后的数组
   */
  randomArray(arr) {
    let tempArr = arr.slice();
    for (let i = 0; i < tempArr.length; i++) {
      // 获取随机数
      let randomNum = Math.floor(Math.random() * (i - 0 + 1) + 0);
      let temp = tempArr[i];
      tempArr[i] = tempArr[randomNum];
      tempArr[randomNum] = temp;
    }
    return tempArr;
  },

  /**
   * 节流函数
   * @param  {Function} func  要执行节流的函数
   * @param  {Number} delay   延迟时间
   * @return {Function}       执行节流函数的函数
   */
  debounce(func, delay) {
    let timer = null;

    return function(...args) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
};
