<template>
	<el-container>
		<!-- 左侧侧边栏 -->
		<el-aside :style="{width:ustore.isCollapse? '65px':'200px'}">
			<LeftMenu></LeftMenu>
		</el-aside>

		<el-container>
			<!-- 页面头部内容 -->
			<el-header>
				<Header></Header>
			</el-header>
			<!-- 页面主体内容 -->
			<el-main>
				<!-- 标签栏 -->
				<Tabs></Tabs>
				<!-- 主体内容区域 -->
				<router-view></router-view>
			
			</el-main>
			<!-- 页面底部内容 -->
			<el-footer>
				<Footer></Footer>
			</el-footer>
		</el-container>
	</el-container>
</template>

<script setup>
	import LeftMenu from './components/LeftMenu.vue'
	import Footer from './components/Footer.vue'
	import Header from './components/Header.vue'
	import Tabs from './components/Tabs.vue'

	import { UserStore } from '@/stores/module/UserStore'
	import {ProjectStore} from '@/stores/module/ProStore'

	const ustore = UserStore()
	const pstore = ProjectStore()
	
	// 获取项目所有的接口
	pstore.getInterFaceList()
	// 获取项目下面所有的测试业务流
	pstore.getSceneList()
	// 获取项目下面所有的测试计划
	pstore.getTestTaskList()
	
</script>

<style scoped lang="scss">
	.el-container {
		height: 100%;

		.el-aside {
			border-right: solid 1px #6a6a6a;
		}

		.el-header {
			border-bottom: solid 1px #6a6a6a;
			padding: 0;
			height: 55px;
		}

		.el-footer {
			border-top: solid 1px #6a6a6a;
			height: 29px;
		}
		.el-main{
			padding: 0;
		}

	}
</style>