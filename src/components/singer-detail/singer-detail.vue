<template>
<transition  name="show">
  <div class="singer-detail-wrapper">歌手详情页</div>
</transition>
</template>

<script type="text/ecmascript-6">
import { getSingerDetail } from 'api/singer';
import { formatSongs } from 'api/song';
import { ERR_OK } from 'api/config';

// vuex提供的语法糖
import { mapGetters } from 'vuex';

export default {
  name: 'singer-detail',
  props: [],
  data() {
    return {
      songs: []
    };
  },
  computed: {
    /**
     * vuex提供的取数据的语法糖，映射getters里的方法
     * @type {String}
     */
    ...mapGetters(['singer'])
  },
  created() {
    this._getSingerDetail();
  },
  methods: {
    _getSingerDetail() {
      // vuex中没有对象直接返回歌手界面
      if (!this.singer.id) {
        this.$router.push('/singer');
        return;
      }

      getSingerDetail(this.singer.id).then(res => {
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
