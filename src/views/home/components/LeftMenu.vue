<template>
	<!-- 顶部的logo图标 -->
	<div class="logo">
		<img src="@/assets/images/logo.png" alt="">
	</div>
	<!-- 菜单 -->
	<el-menu :default-active="$route.path" router :collapse="ustore.isCollapse">
		<el-menu-item :index="item.path" v-for='item in MenuList' key="item.path">
			<img :src="item.iconImg" width="20" style="margin-right: 10px;">
			<span>{{item.name}}</span>
		</el-menu-item>
	</el-menu>




</template>

<script setup>
	import { UserStore } from '@/stores/module/UserStore'

	const ustore = UserStore()

	const MenuList = [{
			name: '项目环境',
			path: '/project/testenv',
			iconImg: require("@/assets/icons/data.png")
		},
		{
			name: '接口管理',
			path: '/project/interface',
			iconImg: require("@/assets/icons/dropbox.png")
		},

		{
			name: '接口用例',
			path: '/project/interCase',
			iconImg: require("@/assets/icons/icon-api-b.png")
		},
		{
			name: '业务流测试',
			path: '/project/testscent',
			iconImg: require("@/assets/icons/liucheng.png")
		},
		{
			name: '测试计划',
			path: '/project/testtask',
			iconImg: require("@/assets/icons/repair.png")
		},

		{
			name: '定时任务',
			path: '/project/crontab',
			iconImg: require("@/assets/icons/hourglass.png")
		},
		{
			name: 'bug管理',
			path: '/project/bugs',
			iconImg: require("@/assets/icons/debug.png")
		},
		{
			name: '数据看板',
			path: '/project/records',
			iconImg: require("@/assets/icons/analysis.png")
		},
		{
			name: '测试工具',
			path: '/project/testtools',
			iconImg: require("@/assets/icons/trace.png")
		}

	]
</script>

<style lang="scss" scoped>
	.logo {
		height: 60px;
		text-align: center;

		img {
			height: 60px;
		}
	}
	.el-menu{
		border-right: none;
	}
</style>