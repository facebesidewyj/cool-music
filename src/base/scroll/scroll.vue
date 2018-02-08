<template>
<div ref="scrollWrapper">
  <slot></slot>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';

export default {
  name: 'scroll',
  props: {
    /**
     * 滚动类型
     * @type {Number}
     */
    probeType: {
      type: Number,
      default: 1
    },

    /**
     * 是否可以点击
     * @type {Boolean}
     */
    click: {
      type: Boolean,
      default: false
    },

    /**
     * 需要监听的数据变化
     * @type {Array}
     */
    data: {
      type: Array,
      default: null
    },

    /**
     * 是否开启监听滚动
     * @type {Object}
     */
    listenScroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null
    };
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (this.$refs.scrollWrapper) {
        this.scroll = new BScroll(this.$refs.scrollWrapper, {
          probeType: this.probeType,
          click: this.click
        });

        if (this.listenScroll) {
          let _this = this;
          this.scroll.on('scroll', pos => {
            _this.$emit('scroll', pos);
          });
        }
      }
    },

    /**
     * 代理refresh方法
     */
    refresh() {
      if (this.scroll) {
        this.scroll.refresh();
      }
    },

    /**
     * 代理enable方法
     */
    enable() {
      this.scroll && this.scroll.enable();
    },

    /**
     * 代理disable方法
     */
    disable() {
      this.scroll && this.scroll.disable();
    },

    /**
     * 代理scrollTo方法，滚动到指定位置
     */
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    /**
     * 滚动到指定元素
     */
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  },
  watch: {
    /**
     * 监听数据变化，刷新scroll
     */
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>

</style>
