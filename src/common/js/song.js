/**
 * 歌曲类
 */
import { ERR_OK } from 'api/config';
import { getUid } from './uid';
import { getVKey, getLyric } from 'api/song';
import { Base64 } from 'js-base64';

let urlMap = {};

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.filename = `C400${this.mid}.m4a`;

    // 确保一首歌曲的 id 只对应一个 url
    if (urlMap[this.id]) {
      this.url = urlMap[this.id];
    } else {
      this._genUrl();
    }
  }

  /**
   * 获取歌词
   * @return {Object} Promise
   */
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject(new Error('no lyric'));
        }
      });
    });
  }

  /**
   * 获取歌曲播放地址
   */
  _genUrl() {
    if (this.url) {
      return;
    }
    getVKey(this.mid, this.filename).then(res => {
      if (res.code === ERR_OK) {
        const vkey = res.data.items[0].vkey;
        this.url = `http://dl.stream.qqmusic.qq.com/${this.filename}?vkey=${vkey}&guid=${getUid()}&uin=0&fromtag=66`;
        urlMap[this.id] = this.url;
      }
    });
  }
}

/**
 * 工厂方法创建对象
 * @param  {Object} musicData 传入的对象
 * @return {Song}             返回的Song实例
 */
export function createSong(song) {
  return new Song({
    id: song.songid,
    mid: song.songmid,
    singer: filterSinger(song.singer),
    name: song.songname,
    album: song.albumname,
    duration: song.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`
  });
}

/**
 * 改名歌手名的展示形式
 * @param  {Object} singer 传入歌手对象
 * @return {String}        歌手名
 */
export function filterSinger(singer) {
  if (singer) {
    let res = [];
    singer.forEach(item => {
      res.push(item.name);
    });
    return res.join('/');
  } else {
    return '';
  }
}

export function isVaildSong(song) {
  return song.songid && song.albummid && (!song.pay || song.pay.payalbumprice === 0);
}
