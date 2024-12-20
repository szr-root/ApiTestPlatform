<template>

	<div class="main">
		<!-- 渲染图标的元素 -->
		<div id="chat_pro_record" class="box1">
		</div>

		<!-- 渲染表格的组价 -->
		<el-table :data="recordList" border style="width: 100%" size="small">
			<el-table-column label="执行时间" min-width="180">
				<template #default="scope">
					{{dateTools.rDate(scope.row.create_time)}}
				</template>
			</el-table-column>
			<el-table-column prop="env" label="执行环境" />
			<el-table-column prop="task" label="测试计划" />
			<el-table-column prop="all" label="总用例" />
			<el-table-column prop="success" label="通过数" />
			<el-table-column prop="pass_rate" label="通过率" />
			<el-table-column label="测试报告" width="180">
				<template #default="scope">
					<el-button @click="showReport(scope.row)" icon="View" type="primary" plain
						size="small">查看报告</el-button>
				</template>

			</el-table-column>
		</el-table>
	</div>


</template>

<script setup>
	import { ProjectStore } from '@/stores/module/ProStore'
	import mychat from '@/utils/chart.js'
	import dateTools from '@/utils/dateTools.js'
	import api from '@/api/index.js'
	import { ref, reactive, onMounted, watch } from 'vue'
	import { useRouter } from 'vue-router'
	const router = useRouter()
	// 存储项目的执行记录
	let recordList = ref([])

	const proStore = ProjectStore()
	// 获取项目的所有测试执行记录
	const getRecords = async function() {
		const response = await api.getAllRecords({
			project: proStore.pro.id
		})
		recordList.value = response.data

		showChat()
	}


	const showChat = function() {
		let pass_rate = []
		let times = []
		recordList.value.forEach((item) => {
			pass_rate.push(item.pass_rate)
			times.push(dateTools.rDate(item.create_time))
		})
		// console.log(pass_rate, times)

		const dom = document.getElementById('chat_pro_record')

		mychat.chart3(dom, pass_rate, times)
	}

	function showReport(record) {
		router.push({
			name: "report",
			params: {
				id: record.id
			}
		})
	}

	// 数据挂载完之后渲染图标
	onMounted(() => {
		// 保存通过率的数组
		getRecords()

	})
</script>

<style scoped lang="scss">
	.box1 {
		height: 260px;
		background: #282828;
		margin-bottom: 10px;
	}

	.main {
		padding: 10px;
	}
</style>