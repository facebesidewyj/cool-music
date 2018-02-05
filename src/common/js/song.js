/**
 * 歌曲类
 */
import { ERR_OK } from 'api/config';
import { getUid } from './uid';
import { getVKey } from 'api/song';

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
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
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
