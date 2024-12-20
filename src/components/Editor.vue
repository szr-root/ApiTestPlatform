<template>
	<VAceEditor :options="editOption" v-model:value="dataEdit" :lang="lang" :theme="theme"
		:style="{ minHeight: height }" />
	<el-button type="primary" size="small" @click="formatJson" v-if="lang === 'json'" plain>格式化json</el-button>
</template>

<script>
	import { VAceEditor } from 'vue3-ace-editor';
	import 'ace-builds/src-noconflict/snippets/json';
	import 'ace-builds/src-noconflict/mode-json';
	import 'ace-builds/src-noconflict/snippets/python';
	import 'ace-builds/src-noconflict/mode-python';
	import 'ace-builds/src-noconflict/mode-html';
	import 'ace-builds/src-noconflict/snippets/html';
	import 'ace-builds/src-noconflict/theme-chrome';
	import 'ace-builds/src-noconflict/theme-monokai';
	import 'ace-builds/src-noconflict/theme-merbivore';
	import 'ace-builds/src-noconflict/theme-twilight';
	import 'ace-builds/src-noconflict/theme-gruvbox';
	import 'ace-builds/src-noconflict/ext-language_tools';
	import 'ace-builds/src-noconflict/worker-json'

	export default {
		components: {
			VAceEditor
		},
		methods: {
			formatJson() {
				const jsObj = JSON.parse(this.dataEdit);
				this.dataEdit = JSON.stringify(jsObj, null, 4);
			}
		},
		props: {
			lang: {
				default: 'json'
			},
			modelValue: {
				type: String,
				default: '{}'
			},
			theme: {
				default: 'merbivore'
			},
			height: {
				default: '200px'
			},
			readOnly: {
				default: false
			}
		},
		emits: ['update:modelValue'],
		computed: {
			editOption() {
				return {
					enableBasicAutocompletion: true, // 启用基本自动补全
					enableSnippets: true, // 启用代码段
					enableLiveAutocompletion: true, // 启用实时自动提示
					tabSize: 4, // 	tab键占用的空格的位置
					fontSize: 14, // 设置字号
					useWorker: false, // 使用校验语法是否正确
					showPrintMargin: false, //去除编辑器里的竖线
					enableMultiselect: true, // 支持鼠标选中多处
					readOnly: this.readOnly, // 是否只读
					showFoldWidgets: true, // 显示折叠部件
					fadeFoldWidgets: true, // 淡入折叠部件
					wrap: true, //换行,
				};
			},
			dataEdit: {
				get() {
					return this.modelValue;
				},
				set(value) {
					this.$emit('update:modelValue', value);
				}
			}
		}
	};
</script>

<style></style>