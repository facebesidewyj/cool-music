<template>
<div class="loading">
  <img src="./loading.gif" alt="loading图" class="icon" height="36" width="36">
  <p class="text">{{text}}</p>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'loading',
  props: {
    /**
     * 传入的文案
     * @type {String}
     */
    text: {
      type: String,
      default: '正在加载...'
    }
  },
  methods: {}
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';

.loading {
  width: 100%;
  text-align: center;
  .icon {
    width: 36px;
    height: 36px;
  }
  .text {
    line-height: 20px;
    font-size: @font-size-small;
    color: @color-text-l;
  }
}
</style>
