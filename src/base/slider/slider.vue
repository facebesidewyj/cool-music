<template>
  <div class="slider" ref="slider">
    <div class="slider-list" ref="sliderList">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot-item" v-for="(dot, index) in dots" :class="{ active: currentPageIndex === index}" :key="index"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import {
  domUtil
} from 'common/js/domUtil';
import BScroll from 'better-scroll';
export default {
  name: 'slider',
  props: {
    /**
     * 设置自动轮播
     * @type {Boolean}
     */
    autoLoop: {
      type: Boolean,
      default: true
    },
    /**
     * 设置无缝轮播
     * @type {Boolean}
     */
    loop: {
      type: Boolean,
      default: true
    },
    /**
     * 自动轮播间隔
     * @type {Number}
     */
    interval: {
      type: Number,
      default: 2000
    },
    /**
     * 是否显示圆点索引
     * @type {Boolean}
     */
    showDots: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dots: [],
      slider: {},
      currentPageIndex: 0,
      timer: {}
    };
  },
  mounted() {
    setTimeout(() => {
      this._setWidth();
      this._initDots();
      this._initSlider();
      this._autoLoop();
    }, 20);

    // 监听屏幕变化初始化slider
    window.addEventListener('resize', () => {
      if (this.slider) {
        this._setWidth(true);
        this.slider.refresh();
      }
    });
  },
  destroyed() {
    clearTimeout(this.timer);
  },
  methods: {
    /**
     * 设置轮播图列表宽度，将轮播图排成一行
     */
    _setWidth(resizeFlag) {
      // 获得视口宽度
      let clientWidth = this.$refs.slider.clientWidth;
      // 获得所有子元素
      let children = this.$refs.sliderList.children;
      let totalWidth = 0;
      for (var i = 0; i < children.length; i++) {
        let sliderItem = children[i];
        // 子元素添加样式和宽度
        domUtil.addClass(sliderItem, 'slider-item');
        sliderItem.style.width = clientWidth + 'px';
        // 计算总宽度
        totalWidth += clientWidth;
      }
      // 如果开启无缝轮播列表最前和最后还要各复制一张图片
      if (this.loop && !resizeFlag) {
        totalWidth += 2 * clientWidth;
      }
      this.$refs.sliderList.style.width = totalWidth + 'px';
    },
    /**
     * 初始化圆点索引
     */
    _initDots() {
      if (this.showDots) {
        this.dots = new Array(this.$refs.sliderList.children.length);
      }
    },
    /**
     * 初始化better-scroll
     */
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, // 取消惯性
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      });
      this.slider.on('scrollEnd', () => {
        if (this.showDots) {
          // 获得当前轮播图的索引页数
          let pageIndex = this.slider.getCurrentPage().pageX;
          // 更新圆点索引
          this.currentPageIndex = pageIndex;
          this._autoLoop();
        } else {
          this._autoLoop();
        }
      });
    },
    /**
     * 开启自动轮播
     */
    _autoLoop() {
      if (this.autoLoop) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.slider.next();
        }, this.interval);
      }
    }
  }
};

</script>
<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
.slider {
  min-height: 1px;
  .slider-list {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      a {
        display: block;
        width: 100%;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
  .dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 12px;
    text-align: center;
    font-size: 0;
    .dot-item {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: @color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background-color: @color-text-ll;
      }
    }
  }
}

</style>
