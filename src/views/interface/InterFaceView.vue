<template>
	<div class="main_box">
		<!-- 左侧内容 -->
		<div class="card left_box">
			<!-- 标题 -->
			<div class="title">
				接口调试
			</div>
			<!-- 接口调试组件 -->
			<InterFaceDebug></InterFaceDebug>
		</div>
		<!-- 右侧内容 -->
		<div class="card right_box">
			<div class="title">项目接口管理</div>
			<el-tabs type="border-card" class="demo-tabs">
				<el-tab-pane label="项目接口">
					<InterFaceList :interface='pstore.interfaces1'></InterFaceList>
				</el-tab-pane>
				<el-tab-pane label="第三方接口">
					<InterFaceList :interface='pstore.interfaces2'></InterFaceList>
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script setup>
	import InterFaceDebug from './components/InterfaceDebug.vue'
	import { ProjectStore } from '@/stores/module/ProStore'
	import InterFaceList from './components/InterFaceList.vue'
	const pstore = ProjectStore()

	
</script>

<style lang="scss" scoped>
	.main_box {
		display: flex;
		height: calc(100% - 42px);

		.left_box {
			padding: 5px;
			flex: 1;
		}

		.right_box {
			flex: 1;
		}

		.title {
			font-weight: bold;
			text-align: center;
			height: 40px;
			line-height: 40px;

		}

	}
</style>