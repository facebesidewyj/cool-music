<template>
<div class="header">
  <h1 class="title">Vue Music</h1>
</div>
</template>
<script type="text/ecmascript-6">
export default {
  name: 'vheader'
};
</script>
<style type="text/css" lang="less" scoped>
@import '../../common/less/mixin.less';
@import '../../common/less/variable.less';

.header {
  height: 44px;
  text-align: center;
  color: @color-theme;
  .title {
    line-height: 44px;
    font-size: @font-size-large;
    font-weight: 700;
  }
}
</style>
