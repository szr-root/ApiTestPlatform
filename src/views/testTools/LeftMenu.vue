<template>
	<!-- 顶部的logo图标 -->
	<div class="logo">
		测试工具
	</div>
	
	<!-- 菜单 -->
	<el-menu :default-active="$route.path" router >
		<el-menu-item :index="item.path" v-for='item in MenuList' key="item.path">
			<el-icon width="20" style="margin-right: 10px;"> <DocumentAdd /></el-icon>
			<span>{{item.name}}</span>
		</el-menu-item>
	</el-menu>

</template>

<script setup>
	import { UserStore } from '@/stores/module/UserStore'

	const ustore = UserStore()

	const MenuList = [
		{
			name: '添加通话记录',
			path: '/project/testtools/addCall',
		},
		{
			name: '测试view',
			path: '/project/testtools/addCall1',
		},

	]
</script>

<style lang="scss" scoped>
	.logo {
		height: 40px;
		text-align: center;
		border-bottom: solid 1px #6a6a6a;
	}
	.el-menu{
		border-right: none;
	}
</style>