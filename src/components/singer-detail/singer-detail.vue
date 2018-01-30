<template>
<transition  name="show">
  <music-list :singerName="singerName" :bgImage="bgImage" :songs="songs"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
// vuex提供计算属性的语法糖
import { mapGetters } from 'vuex';
import { ERR_OK } from 'api/config';
import { getSingerSongs, formatSongs } from 'api/song';
import MusicList from 'components/music-list/music-list';

export default {
  name: 'singer-detail',
  props: [],
  data() {
    return {
      songs: []
    };
  },
  computed: {
    singerName() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(['singer'])
  },
  created() {
    this._getSingerSongs();
  },
  methods: {
    /**
     * 获得与歌手对应的歌曲列表
     */
    _getSingerSongs() {
      if (!this.singer.id) {
        this.$router.push('/singer');
        return;
      }

      getSingerSongs(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = formatSongs(res.data.list);
        }
      });
    }
  },
  components: {
    MusicList
  }
};
</script>

<style type="text/css" lang="less" scoped>
// 定义过渡动画
.show-enter-active,
.show-leave-active {
  transition: all 0.3s;
}
.show-enter,
.show-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
