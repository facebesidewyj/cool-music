export default class Song {
  constructor({ id, mid, singer, name, album, duartion, image, url }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duartion = duartion;
    this.image = image;
    this.url = url;
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
    duartion: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
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
