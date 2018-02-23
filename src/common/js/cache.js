/**
 * 缓存相关操作
 */
import Store from 'store';

const SEARCH_KEY = '__search__';

// 最多保留10条历史记录
const MAX_SIZE = 10;

/**
 * 封装一个队列，将检索词插入数组
 * @param  {Array} arr          搜索历史数组
 * @param  {String} searchWord  检索词
 * @param  {Function} compare   比较函数
 * @param  {Number} size        最大长度限制
 */
function insertArray(arr, searchWord, compare, size) {
  // 查找是否存在相同的检索词
  let index = arr.findIndex(compare);

  // 判断索引位置
  if (index === 0) {
    return;
  }
  if (index > 0) {
    arr.splice(index, 1);
  }

  // 入队
  arr.unshift(searchWord);

  // 判断长度
  if (size && arr.length > size) {
    arr.pop();
  }
}

/**
 * 保存搜索词到本地存储
 * @param  {String} searchWord 检索词
 * @return {Array}            搜索历史数组
 */
export function saveSearchHistory(searchWord) {
  let res = Store.get(SEARCH_KEY);
  if (!res) {
    res = [];
  }
  insertArray(
    res,
    searchWord,
    item => {
      return item === searchWord;
    },
    MAX_SIZE
  );

  // 存入本地存储
  Store.set(SEARCH_KEY, res);
  return res;
}

/**
 * 从本地存储中获取搜索历史
 */
export function getSearchHistory() {
  let res = Store.get(SEARCH_KEY);
  if (!res) {
    res = [];
  }
  return res;
}
