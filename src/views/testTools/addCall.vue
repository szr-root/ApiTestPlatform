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
			<div class="add_form">
				<el-form :model="addForm"  ref="addFormRef">
					<el-form-item prop="anchor">
						<el-input v-model="addForm.anchor" placeholder=" 主播uid ">
							<template #prepend>
								<span>主播uid</span>
							</template>
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-tag type="info" size="large">主播等级</el-tag>
						<el-input-number min=0 max=10 v-model="addForm.level">
						</el-input-number>
					</el-form-item>
					
					<el-form-item> 
						<el-tag type="info" size="large">通话时长(分)</el-tag>
						
						<el-input-number v-model="addForm.min">
						</el-input-number>
						 ～ 			
						<el-input-number v-model="addForm.max">
						</el-input-number>
					</el-form-item>
					
					<el-form-item  prop="times">
						<el-input  v-model="addForm.times" placeholder=" 添加的通话次数 " >
						<template #prepend>
							<span>通话次数</span>
						</template>
						</el-input>
					</el-form-item>
					<el-form-item label="通话类型:" prop="call_type">
						    <el-radio-group v-model="addForm.call_type">
						       <el-radio :value="0" size="large">用户发起普通通话</el-radio>
						       <el-radio :value="1" size="large">匹配通话</el-radio>
						    </el-radio-group>	
					</el-form-item>
					
					
					<el-form-item>
						<el-button @click='addSubmit(addFormRef)' type="primary" round
							style="width: 185px;">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { ref, reactive } from 'vue'
	import api from '@/api/index'
	import { ElNotification,ElMessage } from 'element-plus'
	import LeftMenu from './LeftMenu.vue'
	
	const addForm = reactive({
		anchor: "",
		level: 4,
		times: "",
		min:2,
		max:3,
		call_type: 0
	})
	const addFormRef = ref()

	async function addSubmit() {
		ElMessage({
			type: 'success',
			message: '开始添加,请稍后!',
			duration: 5000
		});
		console.log(addForm)
		const response = await api.addCall(addForm)
			// console.log(response)
		if (response.status === 200) {
			ElNotification({
				title: '添加成功',
				message: '已成功添加数据',
				type: 'success',
			})
		}
			else{
				ElNotification({
					title: '添加失败',
					message: '阿巴阿巴',
					type: 'error',
				})
			}
	}
	function test(){
		console.log(addForm.max)
	}

	
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
			width:430px;
			margin: 5px;
			padding: 10px;
		}

		.title {
			font-weight: bold;
			text-align: center;
			height: 40px;
			line-height: 40px;

		}

	}
</style>