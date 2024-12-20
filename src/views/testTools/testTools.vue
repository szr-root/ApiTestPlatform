<template>
	<div class="main_box">
		<!-- 左侧内容 -->
		<div class="card left_box">
			<!-- 标题 -->
			<div class="title">
				<LeftMenu></LeftMenu>
			</div>
		</div>
		<!-- 右侧内容 -->
		<div class="card right_box">
			<router-view></router-view>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive } from 'vue'
	import api from '@/api/index'
	import { ElNotification,ElMessage } from 'element-plus'
	import LeftMenu from './LeftMenu.vue'
	// import addCall from './addCall.vue'
	
	// const addForm = reactive({
	// 	anchor: "",
	// 	times: ""
	// })
	// const addFormRef = ref()
	
	// async function addSubmit() {
	// 	ElMessage({
	// 		type: 'success',
	// 		message: '开始添加!',
	// 		duration: 2000
	// 	});
	// 	const response = await api.addCall(addForm)
	// 		// console.log(response)
	// 	if (response.status === 200) {
	// 		ElNotification({
	// 			title: '添加成功',
	// 			message: '已成功添加数据',
	// 			type: 'success',
	// 		})
	// 	}
	// 		else{
	// 			ElNotification({
	// 				title: '添加失败',
	// 				message: '阿巴阿巴',
	// 				type: 'error',
	// 			})
	// 		}
	// }
	
</script>

<style lang="scss" scoped>
	.main_box {
		display: flex;
		height: calc(100% - 42px);

		.left_box {
			padding: 5px;
			width:200px
		}

		.right_box {
			flex: 1;
		}
		
		.add_form{
			height:300px;
			width:400px;
		}
		
		.title {
			font-weight: bold;
			text-align: center;
			height: 40px;
			line-height: 40px;

		}

	}
</style>