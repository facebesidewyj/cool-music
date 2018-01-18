<template>
  <div class="slider" ref="slider">
    <div class="slider-list" ref="sliderList">
      <slot></slot>
    </div>
    <div class="dots">
      <span class="dot-item"></span>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { domUtil } from 'common/js/domUtil';
export default {
  name: 'slider',
  props: {
    autoLoop: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {};
  },
  mounted() {
    setTimeout(() => {
      this._setHeight();
      this._initDots();
      this._initSlider();
    }, 20);
  },
  methods: {
    _setHeight() {
      let children = this.$ref.sliderList.children;
      let sliderWidth = 0;
      // 获取元素内部内容的宽度
      let clientWidth = this.$ref.slider.clientWidth;
      for (let i = 0; i < children.length; i++) {
        let sliderItem = children[i];
        sliderItem.style.width = clientWidth + 'px';
        sliderWidth += clientWidth;
        domUtil.addClass(sliderItem, 'slider-item');
      }
      if (this.loop) {
        sliderWidth += 2 * clientWidth;
      }
      this.$ref.sliderList.style.width = sliderWidth + 'px';
    },
    _initDots() {},
    _initSlider() {}
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
