<template>
<transition name="show">
  <div class="top-tip" v-show="showFlag" @click.stop="hide">
    <div class="tip-title">
      <i :class="getIconClass" class="icon"></i>
      <span class="tip-text">{{text}}</span>
    </div>
  </div>
</transition>
</template>
<script type="text/ecmascript-6">
const OK = 0;
const ERROR = 1;

export default {
  name: 'top-tip',
  props: {
    /**
     * 延迟关闭时间
     */
    delay: {
      type: Number,
      default: 2000
    },

    /**
     * 提示文案
     */
    text: {
      type: String,
      default: ''
    },

    /**
     * 图标类型
     */
    type: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getIconClass() {
      if (this.type === OK) {
        return 'icon-ok';
      } else if (this.type === ERROR) {
        return 'icon-error';
      }
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    /**
     * 显示
     */
    show() {
      this.showFlag = true;

      // 延时关闭
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.hide();
      }, this.delay);
    },

    /**
     * 隐藏
     */
    hide() {
      this.showFlag = false;
    }
  }
};
</script>
<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';

.top-tip {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  background-color: @color-dialog-background;

  &.show-enter-active,
  &.show-leave-active {
    transition: all 0.3s linear;
  }

  &.show-enter,
  &.show-leave-to {
    transform: translate3d(0, -100%, 0);
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    .icon {
      margin-right: 4px;
      font-size: @font-size-small;
      color: @color-sub-theme;
    }
    .tip-text {
      font-size: @font-size-medium;
      color: @color-text-l;
    }
  }
}
</style>
