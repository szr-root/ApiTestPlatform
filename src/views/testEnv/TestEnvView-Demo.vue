<template>
	<div>测试环境页面</div>
	<Editor lang="json" v-model="jsonData" height='250px'></Editor>
	<Editor lang="python" v-model="pyData" height='250px'></Editor>

</template>

<script setup>
	import Editor from '@/components/Editor'
	import {ref} from 'vue'
	
	let pyData = ref('')
	let jsonData = ref('{}')
	
	

</script>

<style>
</style>