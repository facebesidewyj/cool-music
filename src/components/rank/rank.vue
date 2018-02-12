<template>
  <div class="rank-wrapper" ref="rankWrapper">
    <scroll class="rank-list" :data="rankList" ref="scroll">
      <ul>
        <li class="rank-item" v-for="(item,index) in rankList" :key="index" @click="selectRank(item)">
          <div class="item-icon">
            <img v-lazy="item.picUrl" alt="榜单图片" width="100" height="100">
          </div>
          <ul class="item-song-list">
            <li class="item-song" v-for="(song,index) in item.songList" :key="index">
              <span>{{index+1}}</span>
              <span>{{song.songname}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <div class="loading-wrapper">
      <loading v-if="!rankList.length"></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import Loading from 'base/loading/loading';
import Scroll from 'base/scroll/scroll';
import { getRankList } from 'api/rank';
import { ERR_OK } from 'api/config';
import { playListMixin } from 'common/js/mixin';
import { domUtil } from 'common/js/domUtil';
import { mapMutations } from 'vuex';

export default {
  name: 'rank',
  mixins: [playListMixin],
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
     * 点击进入榜单详情
     * @param  {Object} rank 榜单对象
     */
    selectRank(rank) {
      this.$router.push({
        path: `/rank/${rank.id}`
      });
      this.setRank(rank);
    },

    /**
     * 覆盖mixin中的方法
     */
    handlePlayList(playList) {
      let bottom = '';
      if (playList.length > 0) {
        bottom = '60px';
      }
      domUtil.setCss(this.$refs.rankWrapper, 'bottom', bottom);
      this.$refs.scroll.refresh();
    },

    /**
     * 获取榜单列表的私有方法
     */
    _getRankList() {
      getRankList().then(res => {
        if (res.code === ERR_OK) {
          this.rankList = res.data.topList;
        }
      });
    },

    /**
     * vuex提供的存数据的语法糖，映射mutations里的方法
     * @type {String}
     */
    ...mapMutations({
      setRank: 'SET_RANK'
    })
  },
  components: {
    Loading,
    Scroll
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
