import Vue from 'vue';
import Router from 'vue-router';
import Rank from 'components/rank/rank';
import Recommend from 'components/recommend/recommend';
import Search from 'components/search/search';
import Singer from 'components/singer/singer';
import SingerDetail from 'components/singer-detail/singer-detail';
import DiscDetail from 'components/disc-detail/disc-detail';
import RankDetail from 'components/rank-detail/rank-detail';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: DiscDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id', // :属性指可以传入属性来当做路径
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    }
  ]
});
