<template>

	<el-row v-if="state.report">
		<el-col :span="12">
			<el-scrollbar height="calc(100vh - 65px)">
				<el-card v-if='state.record'>
					<div class="report_title">
						<i class="el-icon-s-marketing"></i>
						测试报告
						<el-button type="primary" @click="sendFeishu">发送测试报告</el-button>
					</div>
					<el-descriptions :column="5" border title="执行信息" direction="vertical">
						<el-descriptions-item label="执行时间">{{ tools.rTime(state.record.create_time) }}</el-descriptions-item>
						<el-descriptions-item label="执行任务">{{ state.record.task }}</el-descriptions-item>
						<el-descriptions-item label="测试环境">{{ state.record.env }}</el-descriptions-item>
						<el-descriptions-item label="通过率">{{ state.record.pass_rate + '%' }}</el-descriptions-item>
					</el-descriptions>
				</el-card>
				<el-card body-style="padding:5px">
					<el-row :gutter="5">
						<!-- 用例信息图表 -->
						<el-col :span="14">
							<div class="chartBox" id="chart11"></div>
						</el-col>
						<!-- 通过率图表 -->
						<el-col :span="10">
							<div class="chartBox" id="chart22"></div>
						</el-col>
					</el-row>
				</el-card>
				<el-card>
					<el-descriptions :column="4" border title="测试业务流统计" direction="vertical">
						<el-descriptions-item label="业务流总数">{{ state.report.results.length }}</el-descriptions-item>
						<el-descriptions-item label="通过业务流">{{ successscent.length }}</el-descriptions-item>
						<el-descriptions-item label="失败业务流">{{ failscent.length }}</el-descriptions-item>
						<el-descriptions-item label="错误业务流">{{ errorscent.length }}</el-descriptions-item>
					</el-descriptions>
				</el-card>
				<el-card>
					<b style="line-height: 30px;">未通过业务流</b>
					<div>
						<el-button plain size="small" @click="showScentDatas = [su]" type="danger"
							v-for="su in errorscent">{{ su.name }}</el-button>
						<el-button plain size="small" @click="showScentDatas = [su]" type="warning"
							v-for="su in failscent">{{ su.name }}</el-button>
					</div>
				</el-card>
				<el-card>
					<b style="line-height: 30px;">通过业务流</b>
					<div>
						<el-button plain size="small" @click="showScentDatas = [su]" type="success"
							v-for="su in successscent">{{ su.name }}</el-button>
					</div>
				</el-card>
			</el-scrollbar>
		</el-col>

		<el-col :span="12">
			<div>
				<div style="margin: 5px;">
					<el-button size="small" type="primary" plain
						@click="state.showScentDatas = { ...state.report.results }">所有业务流</el-button>
					<el-button size="small" type="success" plain
						@click="state.showScentDatas = successscent">成功业务流</el-button>
					<el-button size="small" type="warning" plain @click="state.showScentDatas = failscent">失败业务流</el-button>
					<el-button size="small" type="danger" plain @click="state.showScentDatas = errorscent">错误业务流</el-button>
				</div>
				<el-scrollbar height="calc(100vh - 117px)">
					<div class="right_box">
						<el-card v-for="(scent, index) in state.showScentDatas" :key="index">
							<div class="title" v-if="scent.state == 'success'">
								<i class="el-icon-upload"></i>
								{{ '测试业务流 : ' + scent.name + '【通过】' }}
							</div>
							<div class="title" v-else-if="scent.state == 'fail'" style="color: coral;">
								<i class="el-icon-upload"></i>
								{{ '测试业务流 : ' + scent.name + '【失败】' }}
							</div>
							<div class="title" v-else style="color: red;">
								<i class="el-icon-upload"></i>
								{{ '测试业务流 : ' + scent.name + '【错误】' }}
							</div>

							<el-table :data="scent.cases" style="width: 100%;" class="result" :show-header="false">
								<el-table-column type="expand">
									<template #default="scope">
										<Result :result="scope.row"></Result>
									</template>
								</el-table-column>
								<el-table-column :show-overflow-tooltip="true" label="用例名称" prop="name"
									min-width="100px"></el-table-column>
								<el-table-column label="请求方法" prop="method" min-width="40px"></el-table-column>
								<el-table-column label="状态码" prop="status_cede" min-width="40px"></el-table-column>
								<el-table-column label="断言结果" prop="state" min-width="40px">
									<template #default="scope">
										<span v-if="scope.row.state == '成功'" style="color: #00AA7F;">成功</span>
										<span v-else-if="scope.row.state == '失败'" style="color: #ffaa00">失败</span>
										<span v-else style="color:#F56C6C">错误</span>
									</template>
								</el-table-column>
							</el-table>
						</el-card>
					</div>
				</el-scrollbar>
			</div>
		</el-col>

	</el-row>

</template>

<script setup>
	import chart from '@/utils/chart'
	import Result from '@/components/Result.vue';
	import tools from '@/utils/dateTools'
	import api from '@/api/index.js'
	import { ElMessage } from 'element-plus'
	import { reactive, ref, onMounted, onUpdated, computed } from 'vue'
	import { useRoute } from 'vue-router'

	const route = useRoute()


	const state = reactive({
		// record 运行记录信息
		record: null,
		// 报告信息
		report: null,
		// 显示的测试业务流数据
		showScentDatas: null
	})

	async function getReportInfo(id) {
		const response = await api.getTaskReport(id);
		// 判断http响应状态码
		if (response.status === 200) {
			state.report = response.data.info;
			state.showScentDatas = { ...state.report.results };
			console.log(state.report)
		}
	}
	async function getRecordsInfo(id){
		const response = await api.getRecordsInfo(id);
		if (response.status === 200) {
			state.record = response.data;
			console.log(state.record)
		}
	}
	async function sendFeishu(){
		const id = route.params.id;
		const params = {
			'result':state.report,
			'info':state.record,
			'id':id
		};
		// console.log(params)
		const response = await api.sendFeishu(params);
		if (response.status === 200) {
			ElMessage({
				type: 'success',
				message: '成功发送到飞书',
				duration: 3000
			});
		}
	}
	// 执行信息图表
	function chart1() {
		const value = [state.report.all, state.report.success, state.report.fail, state.report.error];
		const label = ['用例总数', '通过用例', '失败用例', '错误用例'];
		const ele = document.querySelector('#chart11')
		chart.chart1(ele, value, label);
	}
	// 通过率图表
	function chart2() {
		const datas = [{ value: state.report.success, name: '通过' }, { value: state.report.fail, name: '失败' },
			{ value: state.report.error, name: '错误' }
		];
		const ele = document.querySelector('#chart22')
		chart.chart2(ele, datas);
	}
	const successscent = computed(() => {

		return state.report.results.filter(function(val, index, array) {
			return val.state === 'success';
		})

	})
	const failscent = computed(() => {
		return state.report.results.filter(function(val, index, array) {
			return val.state === 'fail';
		})
	})

	const errorscent = computed(() => {
		return state.report.results.filter(function(val, index, array) {
			return val.state === 'error';
		})
	})


	onMounted(() => {
		const id = route.params.id;
		getReportInfo(id);
		getRecordsInfo(id)
	})

	onUpdated(() => {
		if (document.querySelector('#chart11')) chart1();
		if (document.querySelector('#chart22')) chart2();
	})
</script>


<style scoped>
	.right_box .title {
		font: bold 18px/20px 'microsoft yahei';
		text-indent: 10px;
		color: #00aaff;
	}

	.el-card {
		margin: 5px;
	}

	.report_title {
		font: bold 24px/50px 'microsoft yahei';
		text-align: center;
		color: #00aaff;
	}

	/* 图标盒子样式 */
	.chartBox {
		height: 200px;
		background: rgba(52, 52, 53, 0.1);
	}

	/* 业务流标签样式 */
	.el-tag {
		margin: 5px;
		cursor: pointer;
	}
</style>