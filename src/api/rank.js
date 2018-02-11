/**
 * 获取榜单数据
 */
import { commonParams } from './config';
// import { createSong, isVaildSong } from 'common/js/song';
import axios from 'axios';

/**
 * 获取榜单列表
 */
export function getRankList() {
  const url = '/api/getRankList';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  });

  return axios(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
