<template>

	<el-tabs type="border-card" class="demo-tabs" v-if='result.name'>
		<el-tab-pane label="响应体">
			<Editor lang="json" v-model='result.response_body'></Editor>
		</el-tab-pane>
		<el-tab-pane label="响应头">
			<div v-for='(v,k) in result.response_header'>
				<el-tag type="info">
					<b><el-tag effect="light">{{k}} :</el-tag> {{v}}</b>
				</el-tag>
			</div>
		</el-tab-pane>
		<el-tab-pane label="请求信息">
			<el-collapse>
				<el-collapse-item title="General" name="1">
					<div> <el-tag effect="light">Requests Methods:</el-tag> {{result.method}}</div>
					<div> <el-tag effect="light">Requests URL:</el-tag> {{result.url}}</div>
				</el-collapse-item>

				<el-collapse-item title="Request Header" name="2">
					<div v-for='(v,k) in result.requests_header'>
						<el-tag effect="light">{{k}} :</el-tag> {{v}}
					</div>
				</el-collapse-item>
				<el-collapse-item title="Request Payload" name="3">
					{{result.requests_body}}
				</el-collapse-item>
			</el-collapse>
		</el-tab-pane>
		<el-tab-pane label="日志">
			<div style="overflow-x: auto;">
				<div v-for='item in result.log_data'>
					<el-tag v-if='item[0] ==="INFO"' type="info">{{item[1]}}</el-tag>
					<el-tag v-else-if='item[0] ==="DEBUG"'>{{item[1]}}</el-tag>
					<el-tag v-else type="danger">{{item[1]}}</el-tag>
				</div>
			</div>

		</el-tab-pane>
		<el-tab-pane disabled>
			<template #label>
				<span v-if='result.status==="成功"' style="color: #55aa7f;"> Assert:{{result.status}}</span>
				<span v-else style="color: #aa0000;"> Assert:{{result.status}}</span>
			</template>
		</el-tab-pane>
		<el-tab-pane disabled>
			<template #label>
				<span v-if='result.status_code < 300' style="color: #55aa7f;">Status:{{result.status_code}}</span>
				<span v-else style="color: #aa0000;"> Status:{{result.status_code}}</span>
			</template>
		</el-tab-pane>
		<el-tab-pane disabled>
			<template #label>
				Time:{{result.run_time}}
			</template>
		</el-tab-pane>

	</el-tabs>

	<div style="margin-top: 10px;width: 100%;text-align: center;" v-if="result.state === '失败'">
		<el-button v-show='!hideBtn' @click="addBugDlg = true" plain size="small">提交bug{{showbBtn}}</el-button>
	</div>
	<!-- 添加bug的弹框 -->
	<el-dialog title="提交bug" v-model="addBugDlg" width="30%">
		<el-form :model="bugForm">
			<el-form-item label="所属接口">
				<el-select size="small" v-model="bugForm.interface" placeholder="bug对应的接口" style="width: 100%;">
					<el-option :label="iter.name + ' ' + iter.url" :value="iter.id" v-for="iter in interfaces"
						:key="iter.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="bug描述"><el-input :autosize="{ minRows: 3, maxRows: 4 }" v-model="bugForm.desc"
					type="textarea" autocomplete="off"></el-input></el-form-item>
		</el-form>
		<template #footer>
			<div class="dialog-footer">
				<el-button size="small" @click="addBugDlg = false">取 消</el-button>
				<el-button size="small" type="primary" plain @click="saveBug">确 定</el-button>
			</div>
		</template>
	</el-dialog>

</template>

<script setup>
	import { ref, reactive, defineProps } from 'vue'
	import Editor from '@/components/Editor.vue'
	import api from '@/api/index'
	import { ElNotification } from 'element-plus'
	import { ProjectStore } from '@/stores/module/ProStore'
	const prop = defineProps({
		result: {},
		hideBtn: false
	})
	// 实例化store对象
	const proStores = ProjectStore()
	const pro = proStores.pro
	const interfaces = proStores.interfaces
	const activeNames = reactive(['1', '2', '3'])
	const addBugDlg = ref(false)
	const bugForm = reactive({
		interface: null,
		desc: '',
		info: '',
		status: '未处理'
	})
	// 保存bug的方法
	async function saveBug() {
		bugForm.project = proStores.pro.id;
		bugForm.info = prop.result;
		const response = await api.createBugs(bugForm);
		if (response.status === 201) {
			ElNotification({
				type: 'success',
				title: 'bug提交成功',
				duration: 1000
			});
			addBugDlg.value = false;
		}
	}
</script>

<style>
</style>