<template>
<transition  name="show">
  <div class="singer-detail-wrapper">歌手详情页</div>
</transition>
</template>

<script type="text/ecmascript-6">
// vuex提供计算属性的语法糖
import { mapGetters } from 'vuex';
import { ERR_OK } from 'api/config';
import { getSingerSongs, formatSongs } from 'api/song';

export default {
  name: 'singer-detail',
  props: [],
  data() {
    return {
      songs: []
    };
  },
  computed: {
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
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
// 定义过渡动画
.show-enter-active,
.show-leave-active {
  transition: all 0.3s;
}
.show-enter,
.show-leave-to {
  transform: translate3d(100%, 0, 0);
}

.singer-detail-wrapper {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: @color-background;
}
</style>
