<template>
<transition  name="show">
  <music-list :singerName="rankTitle" :bgImage="rankBgImg" :songs="songs"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
// vuex提供计算属性的语法糖
import { mapGetters } from 'vuex';
import { ERR_OK } from 'api/config';
import MusicList from 'components/music-list/music-list';
import { getRankDetail, formatRankSongs } from 'api/rank';

export default {
  name: 'rank-detail',
  props: {},
  data() {
    return {
      songs: []
    };
  },
  computed: {
    rankTitle() {
      return this.rank.topTitle;
    },
    rankBgImg() {
      return this.rank.picUrl;
    },
    ...mapGetters(['rank'])
  },
  created() {
    if (!this.rank.id) {
      this.$router.push('/rank');
    } else {
      this._getRankDetail(this.rank.id);
    }
  },
  methods: {
    _getRankDetail(id) {
      getRankDetail(id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = formatRankSongs(res.songlist);
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
