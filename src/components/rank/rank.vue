<template>
  <div class="rank-wrapper">
    <div class="rank-list">
      <ul>
        <li class="rank-item" v-for="(item,index) in rankList" :key="index">
          <div class="item-icon">
            <img :src="item.picUrl" alt="榜单图片" width="100" height="100">
          </div>
          <ul class="item-song-list">
            <li class="item-song" v-for="(song,index) in item.songList" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.songname}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="loading-wrapper">
      <loading v-if="!rankList.length"></loading>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from 'base/loading/loading';
import { getRankList } from 'api/rank';
import { ERR_OK } from 'api/config';

export default {
  name: 'rank',
  props: {},
  data() {
    return {
      rankList: []
    };
  },
  created() {
    this._getRankList();
  },
  methods: {
    /**
     * 获取榜单列表的私有方法
     */
    _getRankList() {
      getRankList().then(res => {
        if (res.code === ERR_OK) {
          this.rankList = res.data.topList;
        }
      });
    }
  },
  components: {
    Loading
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
@import '../../common/less/mixin.less';

.rank-wrapper {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .rank-list {
    height: 100%;
    overflow: hidden;

    .rank-item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }

      .item-icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }

      .item-song-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background-color: @color-highlight-background;
        color: @color-text-d;
        font-size: @font-size-small;

        .item-song {
          .no-wrap;
          line-height: 26px;
        }
      }
    }
  }

  .loading-wrapper {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
  }
}
</style>
