<template>
<scroll class="listView-wrapper" :data="data">
  <ul>
    <li class="listView-group" v-for="(singerGroup, index) in data" :key="index">
      <h2 class="title">{{singerGroup.title}}</h2>
      <ul>
        <li class="listView-item" v-for="(singer, index) in singerGroup.data" :key="index">
          <img v-lazy="singer.avatar" alt="userImage">
          <span class="name">{{singer.name}}</span>
        </li>
      </ul>
    </li>
  </ul>
</scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll';

export default {
  name: 'listView',
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {};
  },
  methods: {},
  components: {
    Scroll
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
.listView-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: @color-background;
  .listView-group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background-color: @color-highlight-background;
    }
    .listView-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      img {
        flex: 0 0 50px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        flex: 1;
        margin-left: 20px;
        color: @color-text-l;
        font-size: @font-size-medium;
      }
    }
  }
}
</style>
