<template>
	<div class="card page-box left_card_box">
		<el-button plain @click='clickAdd' style="margin: 10px 5px;" type="primary" icon="Plus"
			size="small">添加定时任务</el-button>

		<el-table :data="state.cronList" style="width: 100%" size="small" border>
			<el-table-column label="创建时间" min-width="180">
				<template #default="scope">
					{{ tools.rTime(scope.row.create_time) }}
				</template>
			</el-table-column>
			<el-table-column prop="name" label="名称" min-width="140"></el-table-column>
			<el-table-column prop="task_name" label="执行任务" min-width="140"></el-table-column>
			<el-table-column prop="env_name" label="执行环境" min-width="140"></el-table-column>
			<el-table-column prop="rule" label="执行规则" min-width="140"></el-table-column>
			<el-table-column label="是否开启" min-width="120">
				<template #default="scope">
					<el-switch @change='switchCronStatus(scope.row)' v-model="scope.row.status" active-color="#13ce66"
						inactive-color="#b1b1b1"></el-switch>
				</template>
			</el-table-column>
			<el-table-column label="操作" min-width="100">
				<template #default="scope">
					<el-tooltip class="item" effect="dark" content="编辑" placement="top">
						<el-button @click='showUpdateCronDlg(scope.row)' type="primary" size="small" plain
							icon="Edit"></el-button>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="删除" placement="top">
						<el-button @click="delCron(scope.row.id)" type="danger" size="small" plain
							icon="Delete"></el-button>
					</el-tooltip>
				</template>
			</el-table-column>
		</el-table>
	</div>
	<!-- 创建or修改定时任务的窗口 -->
	<el-drawer v-model="state.dialogCron" width="30%">
		<template #header>
			<div style="text-align: center" slot='title'>
				<span v-if="state.updateBtn" style="font-size: 18px; font-weight: bold;">修改定时执行任务</span>
				<span v-else style="font-size: 18px; font-weight: bold;">创建定时执行任务</span>
			</div>
		</template>

		<el-form :model="state.cronTabData" label-width="80px">
			<el-form-item label="名称">
				<el-input v-model="state.cronTabData.name"></el-input>
			</el-form-item>
			<el-form-item label="测试环境">
				<el-select v-model="state.cronTabData.env" placeholder="请选择环境" style="width: 100%;">
					<el-option v-for="item in proStore.envList" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="执行计划">
				<el-select style="width: 100%;" v-model="state.cronTabData.task" placeholder="请选择">
					<el-option v-for="item in proStore.taskList" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否开启">
				<el-switch v-model="state.cronTabData.status" active-color="#79d0ff" inactive-color="#c3c3c3"
					size="small">
				</el-switch>
			</el-form-item>

			<el-form-item label="定时规则">
				<el-input v-model="state.cronTabData.rule" placeholder="* * * * *"></el-input>
				<el-row :gutter="20">
					<el-col :span="14">
						<h5>规则说明:</h5>
						<div style="font-size: 12px; line-height: 16px;">* * * * * <span style="color:#909399">分别表示
								minute hour week day
								month </span></div>
						<div style="font-size: 12px; line-height: 16px">minute： <span
								style="color:#909399">表示分钟，可以是从0到59之间的任何整数。</span></div>
						<div style="font-size: 12px; line-height: 16px">hour：<span
								style="color:#909399">表示小时，可以是从0到23之间的任何整数。</span>
						</div>
						<div style="font-size: 12px; line-height: 16px">week：<span
								style="color:#909399">表示星期几，可以是从0到7之间的任何整数，这里的0或7代表星期日。</span>
						</div>
						<div style="font-size: 12px; line-height: 16px">day：<span
								style="color:#909399">表示日期，可以是从1到31之间的任何整数。</span>
						</div>
						<div style="font-size: 12px; line-height: 16px">month：<span
								style="color:#909399">表示月份，可以是从1到12之间的任何整数。</span>
						</div>

					</el-col>
					<el-col :span="10">
						<h5>配置案例：</h5>
						<div style="font-size: 12px;line-height: 16px">5 * * * * : <span
								style="color:#909399">每小时的第5分钟执行一次任务</span>
						</div>
						<div style="font-size: 12px;line-height: 16px">30 9 * * * : <span style="color:#909399">每天上午的
								9:30
								执行一次任务</span></div>
						<div style="font-size: 12px;line-height: 16px">30 9 * 8 * : <span
								style="color:#909399">每月8号上午的9:30执行一次任务
							</span></div>
						<div style="font-size: 12px;line-height: 16px">30 9 * 5 3 : <span style="color:#909399">
								每年的3月5日9:30执行一次任务</span></div>
						<div style="font-size: 12px;line-height: 16px">30 9 0 * * : <span
								style="color:#909399">每星期日的上午9:30执行一次任务</span></div>
					</el-col>
				</el-row>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer" style="text-align: center;">
			<el-button @click="state.dialogCron=false" size="small">取 消</el-button>
			<el-button v-if="state.updateBtn" type="primary" @click="UpdateCron()" size="small">提交修改</el-button>
			<el-button v-else type="primary" @click="createCron()" size="small" plain>创 建</el-button>
		</div>
	</el-drawer>

</template>

<script setup>
	import { ProjectStore } from '@/stores/module/ProStore'
	import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
	import api from '@/api/index'
	import { ref, onMounted, reactive } from 'vue'
	import tools from '@/utils/dateTools'
	const proStore = ProjectStore()
	const state = reactive({
		// 定时任务列表
		cronList: null,
		dialogCron: false,
		updateBtn: true,
		// 添加定时任务
		cronTabData: {
			name: "冒烟测试定期执行",
			rule: "* * * * *",
			status: true,
			task: null,
			env: null
		},
	})
	// 获取所有的定时任务
	async function getAllCron() {
		const response = await api.getCrons(proStore.pro.id)
		if (response.status === 200) {
			state.cronList = response.data
		}
	}
	getAllCron()
	// 开启和关闭定时任务
	async function switchCronStatus(cron) {
		const response = await api.updateCron(cron.id, cron)
		if (response.status === 200) {
			if (cron.status == true) {
				ElMessage({
					type: 'success',
					message: '定时运行已开启',
					duration: 1000
				})
			} else {
				ElMessage({
					type: 'warning',
					message: '定时运行已关闭',
					duration: 1000
				})
			}
		} else {
			ElMessage({
				type: 'error',
				message: '修改状态失败',
				duration: 1000
			})
		}
	}
	//删除定时任务
	function delCron(id) {
		ElMessageBox.confirm('此操作将永久删除该定时任务, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
			.then(async () => {
				// 删除定时任务
				const response = await api.delCron(id)
				if (response.status === 204) {
					ElMessage({
						type: 'success',
						message: '删除成功!'
					});
					// 刷新页面定时任务
					getAllCron()
				}
			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: '已取消删除'
				});
			});
	}
	// 点击添加按钮
	function clickAdd() {
		state.dialogCron = true;
		state.updateBtn = false;

	}
	// 添加定时任务
	async function createCron() {
		const params = {
			project: proStore.pro.id,
			...state.cronTabData
		}
		const response = await api.createCron(params)
		if (response.status === 200) {
			ElMessage({
				type: 'success',
				message: '定时任务添加成功',
				duration: 1000
			})
			state.dialogCron = false
			getAllCron()
		}
	}

	//显示修改定时任务的窗口
	function showUpdateCronDlg(cron) {
		state.cronTabData = { ...cron }
		state.dialogCron = true
		// 显示修改按钮
		state.updateBtn = true
	}
	// 修改定时任务
	async function UpdateCron() {
		const response = await api.updateCron(state.cronTabData.id, state.cronTabData)
		if (response.status === 200) {
			ElMessage({
				type: 'success',
				message: '修改成功',
				duration: 1000
			})
			state.dialogCron = false
			getAllCron()
		}
	}
</script>


<style>
</style>