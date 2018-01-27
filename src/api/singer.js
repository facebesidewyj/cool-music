/**
 * 获取歌手列表数据并对数据进行处理
 */
import { commonParams } from './config';
import axios from 'axios';
import Singer from 'common/js/singer';

/**
 * 用于获取歌手列表的接口
 * @return {Object} 返回Promise
 */
export function getSingers() {
  const url = '/api/getSingers';
  const data = Object.assign(commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  });

  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

/**
 * 用于获取歌手详情的接口
 * @return {Object} 返回Promise
 */
export function getSingerDetail(singerId) {
  const url = '/api/getSingerDetail';
  const data = Object.assign(commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  });

  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

// 声明格式化数据需要用到的常量
const HOT_NAME = '热门';
const HOT_LIST_SIZE = 10;

/**
 * 格式化传入的数据，将数据转成通讯录需要的
 * @param  {Array} singerList 传入要格式化的数组
 * @return {Array}            格式化好的数组
 */
export function formatList(singerList) {
  // 封装一个热门歌手列表
  let hotList = [
    {
      title: HOT_NAME,
      data: []
    }
  ];

  // 封装热门歌手列表数据
  singerList.forEach((item, index) => {
    if (index < HOT_LIST_SIZE) {
      hotList[0].data.push(
        new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        })
      );
    }
  });

  // 初始化字母索引列表
  let wordArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  // 初始化一个存放分类歌手数据的列表
  let dataList = [];

  // 根据首字母进行排序和分组
  for (let i = 0; i < wordArray.length; i++) {
    let singerGroup = {
      title: '',
      data: []
    };
    for (let j = 0; j < singerList.length; j++) {
      if (wordArray[i] === singerList[j].Findex) {
        singerGroup.data.push(
          new Singer({
            id: singerList[j].Fsinger_mid,
            name: singerList[j].Fsinger_name
          })
        );
      }
    }

    // 如果数组中有数据，则添加分组字母
    if (singerGroup.data.length) {
      singerGroup.title = wordArray[i];
      dataList.push(singerGroup);
    }
  }
  return hotList.concat(dataList);
}
