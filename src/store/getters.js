/**
 * 封装一些取值方法
 */
export const singer = state => state.singer;

export const disc = state => state.disc;

export const playState = state => state.playState;

export const fullScreen = state => state.fullScreen;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const playMode = state => state.playMode;

export const currentIndex = state => state.currentIndex;

/**
 * 获取当前播放的歌曲
 * @param  {Object} state vuex里的数据对象
 * @return {Object}       当前播放的歌曲
 */
export const currentSong = state => {
  // 没有初始化成功时应该赋予空对象，否则v-bind就会报错，因为对象是undefined
  return state.playList[state.currentIndex] || {};
};
