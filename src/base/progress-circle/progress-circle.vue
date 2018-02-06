<template>
<div class="progress-circle">
  <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>

    <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="perimeter" :stroke-dashoffset="offsetDistance"/>
  </svg>
  <slot></slot>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'progress-circle',
  props: {
    radius: {
      type: Number,
      default: 100
    },
    precent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      perimeter: Math.PI * 100
    };
  },
  computed: {
    offsetDistance() {
      return (1 - this.precent) * this.perimeter;
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/mixin.less';
@import '../../common/less/variable.less';

.progress-circle {
  position: relative;

  circle {
    stroke-width: 8px;
    transform-origin: center;

    &.progress-background {
      transform: scale(0.9);
      stroke: @color-theme-d;
    }

    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: @color-theme;
    }
  }
}
</style>
