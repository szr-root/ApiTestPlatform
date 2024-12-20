<template>
	<!-- url地址 -->
	<el-input v-model="caseData.interface.url" placeholder="输入接口地址">
		<template #prepend>
			<el-select v-model="caseData.interface.method" placeholder="选择请求方法" style="width: 115px">
				<el-option label="GET" value="get" />
				<el-option label="POST" value="post" />
				<el-option label="PUT" value="put" />
				<el-option label="PATCH" value="patch" />
				<el-option label="DELETE" value="delete" />
			</el-select>
		</template>
		<template #append>
			<el-button @click='runInterFaseCase'>运行</el-button>
		</template>
	</el-input>

	<!-- 请求信息 -->
	<el-divider content-position="left">请求信息</el-divider>
	<el-tabs type="border-card" class="demo-tabs">
		<el-tab-pane label="请求头(headers)">
			<Editor lang="json" v-model="caseData.headers"></Editor>
		</el-tab-pane>
		<el-tab-pane label="查询参数(params)">
			<Editor lang="json" v-model="caseData.request.params"></Editor>
		</el-tab-pane>
		<el-tab-pane label="请求体(Body)" :disabled="caseData.interface.method == 'get'">
			<el-radio-group v-model="bodyType">
				<el-radio label="json">Json</el-radio>
				<el-radio label="data">X-www-form-urlencoded</el-radio>
				<el-radio label="form-data">form-data</el-radio>
			</el-radio-group>
			<!-- json参数 -->
			<div v-if='bodyType==="json"'>
				<Editor lang="json" v-model="caseData.request.json"></Editor>
			</div>
			<div v-else-if='bodyType==="data"'>
				<Editor lang="json" v-model="caseData.request.data"></Editor>
			</div>
			<div v-else>
				<FromData v-model="caseData.file"></FromData>
			</div>
		</el-tab-pane>
		<el-tab-pane label="前置脚本">
			<Editor lang="python" v-model="caseData.setup_script"></Editor>
		</el-tab-pane>
		<el-tab-pane label="后置脚本">
			<Editor lang="python" v-model="caseData.teardown_script"></Editor>
		</el-tab-pane>
	</el-tabs>
	<!-- 响应信息 -->
	<el-divider content-position="left">响应信息</el-divider>
	<Result :result='responseData'></Result>

</template>

<script setup>
	import FromData from '@/components/FormData.vue'
	import { ref, reactive,computed} from 'vue'
	import Editor from '@/components/Editor.vue'
	import Result from '@/components/Result.vue'
	import api from '@/api/index'
	import { ProjectStore } from '@/stores/module/ProStore'

	const pstore = ProjectStore()
	const caseData = reactive({
		interface: {
			method: "get",
			url: ""
		},
		headers: '{}',
		request: {
			json: '{}',
			data: '{}',
			params: '{}'
		},
		file: [],
		setup_script: '',
		teardown_script: ''

	})


	// const isDisabled = computed(
	// 	()=>{return caseData.interface.method == 'get'? 'true':'false'}
	// )

	let bodyType = ref('json')
	// ===============运行接口用例===========
	let responseData = ref({})
	async function runInterFaseCase() {
		// 接口用例的参数
		const params = {
			env: pstore.env,
			cases: {
				title: "调试运行",
				interface: caseData.interface,
				headers: JSON.parse(caseData.headers),
				setup_script: caseData.setup_script,
				teardown_script: caseData.teardown_script,
				request: {
					params: JSON.parse(caseData.request.params)
				},
			}
		}
		// 判断请求体参数类型
		if (bodyType.value === 'json') {
			params.cases.request.json = JSON.parse(caseData.request.json)
		} else if (bodyType.value === 'data') {
			params.cases.request.data = JSON.parse(caseData.request.data)
		} else if (bodyType.value === 'form-data') {
			params.cases.file = caseData.request.file
		}
		const response = await api.runInterFaceCaseApi(params)
		if (response.status === 200) {
			console.log('运行成功')
			responseData.value = response.data
		}
	}
</script>

<style>
</style>