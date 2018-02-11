<template>
<transition  name="show">
  <music-list :singerName="discTitle" :bgImage="discBgImg" :songs="songs"></music-list>
</transition>
</template>

<script type="text/ecmascript-6">
// vuex提供计算属性的语法糖
import { mapGetters } from 'vuex';
import { ERR_OK } from 'api/config';
import MusicList from 'components/music-list/music-list';
import { getDiscDetail, formatDiscSongs } from 'api/recommend';

export default {
  name: 'disc-detail',
  props: {},
  data() {
    return {
      songs: []
    };
  },
  computed: {
    discTitle() {
      return this.disc.dissname;
    },
    discBgImg() {
      return this.disc.imgurl;
    },
    ...mapGetters(['disc'])
  },
  created() {
    if (!this.disc.dissid) {
      this.$router.push('/recommend');
    } else {
      this._getDiscDetail(this.disc.dissid);
    }
  },
  methods: {
    _getDiscDetail(id) {
      getDiscDetail(id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = formatDiscSongs(res.cdlist[0].songlist);
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
