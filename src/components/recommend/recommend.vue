<template>
  <div class="recommend-wrapper">
    <div class="slider-wrapper" v-if="recommends.length">
      <slider>
        <div v-for="item in recommends" :key="item.id">
          <a :href="item.linkUrl">
            <img :src="item.picUrl" alt="轮播图">
          </a>
        </div>
      </slider>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Slider from 'base/slider/slider';
import { getRecommend } from 'api/recommend';
import { ERR_OK } from 'api/config';
export default {
  name: 'recommend',
  props: [],
  data() {
    return {
      recommends: []
    };
  },
  created() {
    this._getRecommendData();
  },
  methods: {
    _getRecommendData() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    }
  },
  components: {
    Slider
  }
};

</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';

.recommend-wrapper {
  position: fixed;
  top: 88px;
  width: 100%;
  bottom: 0;
  .slider-wrapper {
    width: 100%;
    overflow: hidden;
  }
}

</style>
