import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const Recommend = () => import('components/recommend/recommend');
const Rank = () => import('components/rank/rank');
const Singer = () => import('components/singer/singer');
const Search = () => import('components/search/search');
const SingerDetail = () => import('components/singer-detail/singer-detail');
const DiscDetail = () => import('components/disc-detail/disc-detail');
const RankDetail = () => import('components/rank-detail/rank-detail');

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
      component: Search,
      children: [
        {
          path: ':id', // :属性指可以传入属性来当做路径
          component: SingerDetail
        }
      ]
    }
  ]
});
