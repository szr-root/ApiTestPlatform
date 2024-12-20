import { createRouter, createWebHashHistory } from 'vue-router'
import {UserStore} from '@/stores/module/UserStore'

const routes = [

	{
		path: '/',
		name: 'index',
		redirect:'/users/login'
	},
	// 登录页面的路由
	{
		path: '/users/login',
		name: 'login',
		component: () => import( /* webpackChunkName: "about" */ '../views/login/LoginView.vue')
	},
	{
		path: '/project/manage',
		name: 'pro_manage',
		component: () => import( /* webpackChunkName: "about" */ '../views/proManage/ProManageView.vue')
	},
	{
		path: '/project/home',
		name: 'home',
		component: () => import( /* webpackChunkName: "about" */ '../views/home/HomeView.vue'),
		redirect: '/project/testenv',
		children: [{
				path: '/project/testenv',
				name: 'test_env',
				component: () => import( /* webpackChunkName: "about" */ '../views/testEnv/TestEnvView.vue'),
				meta: {
					name: "测试环境",
				}
			},
			{
				path: '/project/interface',
				name: 'interface',
				component: () => import( /* webpackChunkName: "about" */
					'../views/interface/InterFaceView.vue'),
				meta: {
					name: "接口管理",
				}
			},
			{
				path: '/project/interCase',
				name: 'interCase',
				component: () => import( /* webpackChunkName: "about" */
					'../views/interCase/interCaseView.vue'),
				meta: {
					name: "接口用例",
				}
			},
			{
				path: '/project/testscent',
				name: 'scent',
				component: () => import( /* webpackChunkName: "about" */
					'../views/testscent/testScentView.vue'),
				meta: {
					name: "业务流测试",
				}
			},
			{
				path: '/project/testtask',
				name: 'testtask',
				component: () => import( /* webpackChunkName: "about" */ '../views/testTask/TestTaskView.vue'),
				meta: {
					name: "测试计划",
				}
			},
			{
				path: '/project/crontab',
				name: 'crontab',
				component: () => import( /* webpackChunkName: "about" */ '../views/crontab/crontabView.vue'),
				meta: {
					name: "定时任务",
				}
			},
			{
				path: '/project/bugs',
				name: 'bugs',
				component: () => import( /* webpackChunkName: "about" */ '../views/bugs/bugView.vue'),
				meta: {
					name: "bug管理",
				}
			},
			{
				path: '/project/records',
				name: 'records',
				component: () => import( /* webpackChunkName: "about" */ '../views/records/recordsView.vue'),
				meta: {
					name: "数据看板",
				}
			},
			{
				path: '/records/report/:id',
				name: 'report',
				component: () => import( /* webpackChunkName: "about" */ '../views/testReport/Report.vue'),
				meta: {
					name: "测试报告",
				}
			},
			{
				path: '/project/testtools',
				name: 'testtools',
				component: () => import( /* webpackChunkName: "about" */ '../views/testTools/testTools.vue'),
				meta: {
					name: "测试工具",
				}
			},
			{
				path: '/project/testtools/addCall',
				name: 'addCall',
				component: () => import( /* webpackChunkName: "about" */ '../views/testTools/addCall.vue'),
				meta: {
					name: "添加通话记录",
				}
			},
			
		]

	},




]

const router = createRouter({
	history: createWebHashHistory(),
	routes
})


// 添加路由导航守卫
router.beforeEach(async (to, from) => {
	const ustore = UserStore()
	// 把路由访问的记录保存到pinia中（tabs）
	if(to.meta.name){
		ustore.addTabs(to)
	}
	
	// 获取用户是否登录的状态
	let isAuthenticated = ustore.$state.isAuthenticated
	if (!isAuthenticated && to.name !== 'login' && to.name !== 'report') {
		// 将用户重定向到登录页面
		return { name: 'login' }
	}
})


export default router