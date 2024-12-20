<template>
	<div>bug管理页面</div>
	<div class="box" id="chat1"></div>
	<div class="box" id="chat2"></div>
</template>

<script setup>
	import { onMounted } from 'vue'

	import * as echarts from 'echarts';

	const showChat = function(chatData,eleDom) {
		// chatData:渲染的数据
		// eleDem：显示的元素
		var myChart = echarts.init(eleDom);
		var option;

		option = {
			tooltip: {
				trigger: 'item'
			},
			legend: {
				top: '5%',
				left: 'center'
			},
			series: [{
				name: 'Access From',
				type: 'pie',
				radius: ['40%', '70%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontSize: 40,
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: false
				},
				data: chatData
			}]
		};

		option && myChart.setOption(option);
	}


	onMounted(() => {
		var chartDom = document.getElementById('chat1');
		let datas = [
			{ value: 1, name: '处理完' },
			{ value: 2, name: '处理中' },
			{ value: 1, name: '未处理' }
		]
		showChat(datas,chartDom)
		
		var chartDom2 = document.getElementById('chat2');
		let datas2 = [
			{ value: 11, name: '处理完' },
			{ value: 22, name: '处理中' },
			{ value: 18, name: '未处理' }
		]
		showChat(datas2,chartDom2)
	})
</script>

<style scoped lang="scss">
	.box {
		width: 500px;
		height: 400px;
	}
</style>