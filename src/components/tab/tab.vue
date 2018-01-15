<template>
  <div class="tab">
    <router-link to="/recommend" class="tab-item" tag="div">
      <span class="tab-text">推荐</span>
    </router-link>
    <router-link to="/rank" class="tab-item" tag="div">
      <span class="tab-text">榜单</span>
    </router-link>
    <router-link to="/singer" class="tab-item" tag="div">
      <span class="tab-text">歌手</span>
    </router-link>
    <router-link to="/search" class="tab-item" tag="div">
      <span class="tab-text">搜索</span>
    </router-link>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'tab',
  props: [],
  data() {
    return {};
  },
  methods: {}
};

</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';

.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: @font-size-medium;
  .tab-item {
    flex: 1;
    text-align: center;
    .tab-text {
      color: @color-text-l;
    }
    &.router-link-active {
      .tab-text {
        color: @color-theme;
        border: 2px solid @color-theme;
      }
    }
  }
}

</style>
