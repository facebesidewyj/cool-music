<template lang="html">
  <div class="music-list-wrapper">
    <div class="icon-back-wrapper" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="singerName"></h1>
    <div class="background-image" :style="backgroundImage" ref="bgImage">
      <div class="play-btn-wrapper" v-show="songs.length" ref="playBtn">
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 遮罩层 -->
      <div class="image-filter" ref="filter"></div>
    </div>
    <!-- 上滑时遮住图片 -->
    <div class="image-layer" ref="layer"></div>
    <scroll :data="songs" :listenScroll="true" :probeType="3" @scroll="scroll" class="scroll-list" ref="scrollList">
      <div class="song-list-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
      <div class="loading-wrapper" v-if="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import SongList from 'base/song-list/song-list';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { domUtil } from 'common/js/domUtil';

const TITLE_HEIGTH = 40;

export default {
  props: {
    /**
     * 歌手名
     * @type {String}
     */
    singerName: {
      type: String,
      default: ''
    },

    /**
     * 背景图
     * @type {String}
     */
    bgImage: {
      type: String,
      default: ''
    },

    /**
     * 歌曲列表
     * @type {Array}
     */
    songs: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      // Y轴滚动距离
      scrollY: 0,
      // 背景图高度
      imageHeight: 0,
      // 图片最大滚动距离
      maxImageScroll: 0
    };
  },
  computed: {
    backgroundImage() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  mounted() {
    // 获取背景图高度
    this.imageHeight = this.$refs.bgImage.clientHeight;

    // $el:根据Vue组件获取原生对象，设置滚动列表显示位置
    domUtil.setCss(this.$refs.scrollList.$el, 'top', `${this.imageHeight}px`);

    // 设置背景图最大滚动距离(露出歌手名)
    this.maxImageScroll = this.imageHeight - TITLE_HEIGTH;
  },
  methods: {
    /**
     * 回退
     */
    back() {
      this.$router.back();
    },

    /**
     * 监听滚动，记录滚动距离
     * @param  {Object} pos 坐标对象
     */
    scroll(pos) {
      this.scrollY = -pos.y;
    }
  },
  watch: {
    scrollY(newY) {
      // 获取频繁操作的Dom对象
      let bgImageDom = this.$refs.bgImage;

      // 列表上滑时遮住图片
      let translateY = Math.min(newY, this.maxImageScroll);
      domUtil.setCss(this.$refs.layer, 'transform', `translate3d(0, -${translateY}px, 0)`);

      let zIndex = 0;
      let blur = 0;
      let scale = 1;

      // 计算放大和模糊比例
      const precent = Math.abs(newY / this.imageHeight);

      // 下拉时，背景图放大
      if (newY < 0) {
        scale = 1 + precent;
        zIndex = 10;
      } else {
        blur = Math.min(20, precent * 20);
      }

      domUtil.setCss(bgImageDom, 'transform', `scale(${scale})`);
      domUtil.setCss(this.$refs.filter, 'backdrop', `blur(${blur}px)`);

      // 列表上滑到最大距离，露出歌手名，修改背景图高度和z-index
      if (newY > this.maxImageScroll) {
        domUtil.setCss(bgImageDom, 'height', `${TITLE_HEIGTH}px`);
        domUtil.setCss(bgImageDom, 'paddingTop', 0);
        domUtil.setCss(this.$refs.playBtn, 'display', 'none');
        zIndex = 10;
      } else {
        domUtil.setCss(bgImageDom, 'height', 0);
        domUtil.setCss(bgImageDom, 'paddingTop', '70%');
        domUtil.setCss(this.$refs.playBtn, 'display', '');
      }
      domUtil.setCss(bgImageDom, 'zIndex', zIndex);
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
@import '../../common/less/mixin.less';

.music-list-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: @color-background;
  .icon-back-wrapper {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: @font-size-large-x;
      color: @color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    line-height: 40px;
    z-index: 50;
    .no-wrap;
    text-align: center;
    font-size: @font-size-large;
    color: @color-text;
  }
  .background-image {
    position: relative;
    width: 100%;
    padding-top: 70%;
    // 定义Y轴起始位置
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      width: 100%;
      z-index: 50;
      .play-btn {
        width: 135px;
        box-sizing: border-box;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid @color-theme;
        border-radius: 100px;
        color: @color-theme;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: @font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: @font-size-small;
        }
      }
    }
    .image-filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(7, 17, 27, 0.3);
    }
  }
  .image-layer {
    position: relative;
    height: 100%;
    background-color: @color-background;
  }
  .scroll-list {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: @color-background;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loading-wrapper {
      position: absolute;
      top: 50%;
      width: 100%;
      text-align: center;
      transform: translateY(-50%);
    }
  }
}
</style>
