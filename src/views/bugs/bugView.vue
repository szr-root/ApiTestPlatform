<template>
	<div class="card page-box">

		<span class="el-icon-s-data" style="color: #17abe3;"><b>bug统计</b></span>
		<el-row :gutter="10">
			<el-col :span="12">
				<div class="chartBox" id="chart1Box"></div>
			</el-col>
			<el-col :span="12">
				<div class="chartBox" id="chart2Box"></div>
			</el-col>
		</el-row>
		<div class='card' style="margin-top: 10px;padding: 10px;">
			<el-row>
				<el-button @click="showBugs = bugs" type="primary" plain size="small">所有bug</el-button>
				<el-badge :value="bugs1.length" :hidden="bugs1.length === 0" class="item" :max="99"
					style="margin: 0 10px;">
					<el-button @click="showBugs = bugs1" type="danger" plain size="small">未处理bug</el-button>
				</el-badge>
				<el-button @click="showBugs = bugs2" type="warning" plain size="small">处理中bug</el-button>
				<el-button @click="showBugs = bugs3" type="success" plain size="small">处理完bug</el-button>
				<el-button @click="showBugs = bugs4" type="info" plain size="small">无效bug</el-button>
			</el-row>
			<el-table :data="showBugs" style="width: 100%;" size="small" border>
				<el-table-column label="提交时间" min-width="120" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ tools.rTime(scope.row.create_time) }}</span>
					</template>
				</el-table-column>
				<el-table-column show-overflow-tooltip prop="desc" label="bug描述" min-width="120"></el-table-column>
				<el-table-column show-overflow-tooltip prop="interface_url" label="所属接口"
					min-width="00"></el-table-column>
				<el-table-column prop="status" label="bug状态" min-width="80"></el-table-column>
				<el-table-column min-width="180">
					<template #default="scope">
						<div style="text-align: right;">
							<el-tooltip class="item" effect="dark" content="查看bug详情" placement="top">
								<el-button icon="View" @click="showBugInfo(scope.row)" size="small" type="primary"
									plain></el-button>
							</el-tooltip>
							<el-tooltip class="item" effect="dark" content="修改bug状态" placement="top">
								<el-button icon="Edit" @click="
										state.updateBugDlg = true;
										state.updateBugForm =scope.row;
									" size="small" type="primary" plain></el-button>
							</el-tooltip>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>

	<!-- 查看bug信息 -->
	<el-drawer v-model="state.showBug"  :with-header="false" size='50%'>
		<el-scrollbar height="calc(100vh - 20px)">
			<el-card>
				<b>bug信息</b>
				<div style="margin-top: 10px;">
					<el-descriptions :column="4" direction="vertical" border>
						<el-descriptions-item label="提交者">{{state.bugInfo.user}}</el-descriptions-item>
						<el-descriptions-item label="bug状态">{{ state.bugInfo.status }}</el-descriptions-item>
						<el-descriptions-item label="所属接口">{{ state.bugInfo.interface_url }}</el-descriptions-item>
						<el-descriptions-item
							label="提交时间">{{ tools.rTime(state.bugInfo.create_time) }}</el-descriptions-item>
					</el-descriptions>
				</div>
			</el-card>
			<el-card style="margin:5px 0;min-height: 400px;" v-if='state.bugLogs.info.url'>
				<b>用例执行信息</b>
				<div style="margin-top: 10px;">
					<Result :result="state.bugLogs.info" :hideBtn="true"></Result>
				</div>
			</el-card>
			<el-card style="min-height: 400px;" v-if="state.bugLogs">
				<b>bug处理记录</b>
				<div style="margin-top: 10px;">
					<el-timeline>
						<el-timeline-item v-for="(activity, index) in state.bugLogs.handle" :key="index"
							:timestamp="tools.rDate(activity.create_time)" placement="top">
							<el-card>
								<h4>{{ activity.handle }}</h4>
								<p>{{ activity.update_user }}操作于 {{ tools.rTime(activity.create_time) }}</p>
							</el-card>
						</el-timeline-item>
					</el-timeline>
				</div>
			</el-card>
			<el-empty v-else description="无" :image-size="400"></el-empty>
		</el-scrollbar>
	</el-drawer>

	<!-- 修改状态 -->
	<el-dialog title="修改bug状态" v-model="state.updateBugDlg" width="30%">
		<el-form :model="state.updateBugForm">
			<el-form-item label="bug状态">
				<el-select style="width: 100%;" v-model="state.updateBugForm.status" placeholder="请选择bug状态">
					<el-option label="未处理" value="未处理"></el-option>
					<el-option label="处理中" value="处理中"></el-option>
					<el-option label="处理完" value="处理完"></el-option>
					<el-option label="无效bug" value="无效bug"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button size="small" @click="state.updateBugDlg = false">取 消</el-button>
				<el-button size="small" type="success" @click="updateBug">确 定</el-button>
			</div>
		</template>
	</el-dialog>
</template>
<script setup>
	import tools from '@/utils/dateTools'
	import chart from '@/utils/chart'
	import api from '@/api/index'
	import { ref, onMounted, reactive, computed } from 'vue'
	import { ProjectStore } from '@/stores/module/ProStore'
	import Result from '@/components/Result.vue';
	import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'

	const state = reactive({
		showBug: false,
		bugInfo: null,
		bugLogs: null,
		updateBugDlg: false,
		updateBugForm: {},
		
	})
	const proStore = ProjectStore()
	let bugs = ref([])
	let showBugs= ref([])


	//获取所有的bug
	async function getAllBug() {
		const response = await api.getBugs({
			project: proStore.pro.id
		});
		if (response.status === 200) {
			bugs.value = response.data;
			// 渲染图表
			showTable();
		}
	}

	const bugs1 = computed(() => {
		let res = bugs.value.filter((item) => {
			return item.status === '未处理';
		});
		return res
	})
	const bugs2 = computed(() => {
		return bugs.value.filter((item) => {
			return item.status === '处理中';
		});
	})
	const bugs3 = computed(() => {
		return bugs.value.filter((item) => {
			return item.status === '处理完';
		});
	})
	const bugs4 = computed(() => {
		return bugs.value.filter((item) => {
			return item.status === '无效bug';
		});
	})

	function showTable() {
		// 渲染图表
		const ele = document.querySelector('#chart1Box');
		const data = [bugs.value.length, bugs3.value.length, bugs2.value.length, bugs1.value.length, bugs4.value.length];
		const dataLabel = ['bug总数', '处理完', '处理中', '未处理', '无效bug'];
		chart.chart1(ele, data, dataLabel);
		const ele2 = document.querySelector('#chart2Box');
		chart.chart2(ele2, [
			{ value: bugs3.value.length, name: '处理完' },
			{ value: bugs2.value.length, name: '开发处理中' },
			{ value: bugs1.value.length, name: '未处理' },
			{ value: bugs4.value.length, name: '无效bug' }
		]);
	}
	// 显示bug详情
	async function showBugInfo(bug) {
		state.bugInfo = bug;
		const response = await api.getBugInfo(bug.id);
		if (response.status === 200) {
			state.bugLogs = response.data;
		}
		state.showBug = true
	}
	// 修改bug状态
	async function updateBug() {
		const reposne = await api.updateBug(state.updateBugForm.id, state.updateBugForm);
		if (reposne.status === 200) {
			ElMessage({
				type: 'success',
				message: '修改成功',
				duration: 1000
			});
			getAllBug()
			state.updateBugDlg = false;
		}
	}

	onMounted(async () => {
		// 获取数据
		await getAllBug()
		showBugs.value = bugs.value
		
	})
</script>

<style scoped>
	.bug_list {
		height: calc(100vh - 290px);
		overflow-y: auto;
		margin-top: 5px;
	}

	.chartBox {
		height: 200px;
		background: rgba(78, 78, 80, 0.1);
	}
</style>