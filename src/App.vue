<template>
  <div id="app">
    <Vheader></Vheader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
import Vheader from 'components/header/header';
import Tab from 'components/tab/tab';

export default {
  components: {
    Vheader,
    Tab
  }
};

</script>

<style scoped lang="less">

</style>
