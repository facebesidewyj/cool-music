<template>
  <div id="app">
    <Vheader></Vheader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import Vheader from 'components/header/header';
import Tab from 'components/tab/tab';
import Player from 'components/player/player';

export default {
  components: {
    Vheader,
    Tab,
    Player
  }
};
</script>

<style scoped lang="less">

</style>
