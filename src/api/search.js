/**
 * 搜索页相关接口
 */
import { commonParams } from './config';
import axios from 'axios';

/**
 * 获取搜索热词
 */
export function getHotWord() {
  const url = '/api/getHotWord';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });

  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

/**
 * 搜索接口
 * @param  {String} word 检索词
 */
export function searchWord(word) {}
