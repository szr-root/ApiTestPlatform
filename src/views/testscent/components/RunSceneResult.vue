<template>
	<el-descriptions title="执行结果" column=4 border>
		<el-descriptions-item label="总数">{{results.all}}</el-descriptions-item>
		<el-descriptions-item label="通过">{{results.success}}</el-descriptions-item>
		<el-descriptions-item label="失败">{{results.fail}}</el-descriptions-item>
		<el-descriptions-item label="错误">{{results.error}}</el-descriptions-item>
	</el-descriptions>
	
	<el-table :data="results.cases"  style="width: 100%">
	    <el-table-column type="expand">
	      <template #default="props">
				<Result :result='props.row'></Result>
	      </template>
	    </el-table-column>
	    <el-table-column label="用例名称" prop="name" />
	    <el-table-column label="请求方法" prop="method" />
		<el-table-column label="响应状态码" prop="status_code" />
		<el-table-column label="执行结果" prop="status" />
	  </el-table>

</template>

<script setup>
	import { ref, defineProps } from 'vue'
	import Result from '@/components/Result.vue'

	const prop = defineProps({
		results: []
	})
</script>

<style>
</style>