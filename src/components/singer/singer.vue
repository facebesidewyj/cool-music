<template>
<div class="singer-wrapper" ref="singerWrapper">
  <listview :data="singers" @selectSinger="selectSinger" ref="listview"></listview>
  <router-view></router-view>
  <div class="loading-wrapper">
    <loading v-show="!singers.length"></loading>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import { getSingers, formatList } from 'api/singer';
import { ERR_OK } from 'api/config';
import Listview from 'base/listView/listView';
import Loading from 'base/loading/loading';
import { domUtil } from 'common/js/domUtil';
import { playListMixin } from 'common/js/mixin';

// vuex提供的语法糖
import { mapMutations } from 'vuex';

export default {
  name: 'singer',
  mixins: [playListMixin],
  props: {},
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingers();
  },
  methods: {
    /**
     * 覆盖mixin中的方法
     */
    handlePlayList(playList) {
      let bottom = '';
      if (playList.length > 0) {
        bottom = '60px';
      }
      domUtil.setCss(this.$refs.singerWrapper, 'bottom', bottom);
      this.$refs.listview.refresh();
    },

    /**
     * 触发点击事件，进入歌手详情页
     * @param  {Object} singer 传入的singer对象
     */
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },

    /**
     * 获得列表数据
     */
    _getSingers() {
      getSingers().then(res => {
        if (res.code === ERR_OK) {
          this.singers = formatList(res.data.list);
        }
      });
    },

    /**
     * vuex提供的存数据的语法糖，映射mutations里的方法
     * @type {String}
     */
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    Listview,
    Loading
  }
};
</script>

<style type="text/css" lang="less" scoped>
.singer-wrapper {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  .loading-wrapper {
    position: absolute;
    top: 50%;
    width: 100%;
    transform: translateY(-50%);
  }
}
</style>
