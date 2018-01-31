<template lang="html">
<div class="song-list">
  <ul>
    <li class="song-item" v-for="(song,index) in songs" :key="song.id" @click="selectSong(song, index)">
      <div class="song-content">
        <h1 class="title">{{song.name}}</h1>
        <p class="desc">{{getSongDesc(song)}}</p>
      </div>
    </li>
  </ul>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'song-list',
  props: {
    songs: {
      type: Array,
      default: null
    }
  },
  methods: {
    /**
     * 获取歌曲描述
     * @param  {Object} song 歌曲对象
     */
    getSongDesc(song) {
      return `${song.name}-${song.album}`;
    },

    /**
     * 派发点击事件
     * @param  {Object} song  歌曲对象
     * @param  {Number} index 歌曲索引
     */
    selectSong(song, index) {
      this.$emit('selectSong', song, index);
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
@import '../../common/less/mixin.less';

.song-item {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 64px;
  font-size: @font-size-medium;
  .song-content {
    flex: 1;
    overflow: hidden;
    line-height: 20px;
    .title {
      .no-wrap;
      color: @color-text;
    }
    .desc {
      margin-top: 4px;
      .no-wrap;
      color: @color-text-d;
    }
  }
}
</style>
