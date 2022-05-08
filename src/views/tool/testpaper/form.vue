<template>
	<div>
		<el-form
			ref="dataForm"
			:rules="rules"
			:model="temp"
			label-position="left"
			label-width="100px"
			style="margin-left: 50px; margin-top: 20px"
		>
			<el-form-item label="试卷名称" prop="title">
				<el-input v-model="temp.title" style="width: 200px" />
			</el-form-item>

			<el-form-item label="是否公开" prop="status">
				<el-radio-group v-model="temp.status">
					<el-radio :label="0">否</el-radio>
					<el-radio :label="1">是</el-radio>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="总分" prop="total_score">
				<el-input-number v-model="temp.total_score" :min="0"></el-input-number>
				分
			</el-form-item>

			<el-form-item label="及格分" prop="pass_score">
				<el-input-number v-model="temp.pass_score" :min="0"></el-input-number>
				分
			</el-form-item>

			<el-form-item label="时间限制" prop="expire">
				<el-input-number v-model="temp.expire" :min="0"></el-input-number>
				分钟
			</el-form-item>

			<el-form-item label="题目列表">
				<div>当前已有题目分数：{{ used_score }}</div>
				<QuestionList
					v-for="(item, index) in temp.questions"
					:key="index"
					:item="item"
					:index="index"
					@del="handleDeleteQuestion"
				>
					分值
					<el-input-number
						placeholder="分数"
						:min="0"
						style="width: 100px"
						size="mini"
						v-model="item.score"
					></el-input-number>
				</QuestionList>

				<el-button type="primary" size="default" @click="addQuestion">添加题目</el-button>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="submit">保存</el-button>
				<el-button @click="reset">重置</el-button>
			</el-form-item>
		</el-form>

		<ChooseQuestion ref="chooseQuestion"></ChooseQuestion>
	</div>
</template>

<script>
import QuestionList from './components/questionList.vue';
import ChooseQuestion from './components/choose-question.vue';

import { readTestpaper } from '@/api/testpaper';

let temp = {
	id: undefined,
	title: '',
	status: 1,
	total_score: 100,
	pass_score: 60,
	expire: 60,
	questions: [
		{
			question: {
				id: 1,
				title: '题目标题',
				type: 'radio',
				value: {
					value: 0,
					options: ['选项1', '选项2']
				},
				remark: ''
			},
			score: 5
		},
		{
			question: {
				id: 1,
				title: '题目标题',
				type: 'checkbox',
				value: {
					value: [0, 1],
					options: ['选项1', '选项2']
				},
				remark: ''
			},
			score: 5
		},
		{
			question: {
				id: 1,
				title: '题目标题',
				type: 'trueOrfalse',
				value: {
					value: 0,
					options: ['正确', '错误']
				},
				remark: ''
			},
			score: 5
		},
		{
			question: {
				id: 1,
				title: '题目标题',
				type: 'answer',
				value: {
					value: 0,
					options: ['问答题的答案内容']
				},
				remark: ''
			},
			score: 5
		},
		{
			question: {
				id: 1,
				title: '题目标题',
				type: 'completion',
				value: {
					value: 0,
					options: ['填空1', '填空2']
				},
				remark: ''
			},
			score: 5
		}
	]
};

export default {
	components: {
		QuestionList,
		ChooseQuestion
	},
	beforeRouteEnter(to, from, next) {
		// 新增
		if (!to.query.id) {
			return next();
		}
		// 编辑
		readTestpaper(to.query).then((res) => {
			temp = res.data;
			next();
		});
	},
	data() {
		return {
			temp,
			rules: {
				title: [
					{
						required: true,
						message: '试卷名称不能为空',
						trigger: 'blur'
					}
				],
				total_score: [
					{
						required: true,
						message: '总分不能为空',
						trigger: 'blur'
					}
				],
				pass_score: [
					{
						required: true,
						message: '及格分不能为空',
						trigger: 'blur'
					}
				],
				expire: [
					{
						required: true,
						message: '时间限制不能为空',
						trigger: 'blur'
					}
				]
			}
		};
	},
	computed: {
		used_score() {
			let score = 0;
			this.temp.questions.forEach((item) => {
				score += item.score;
			});
			return score;
		}
	},
	methods: {
		handleDeleteQuestion(index) {
			this.temp.questions.splice(index, 1);
		},
		addQuestion() {
			this.$refs.chooseQuestion.open((e) => {
				e.forEach((item) => {
					let obj = {
						question: item,
						score: 0
					};
					this.temp.questions.push(obj);
				});
			});
		},
		submit() {},
		reset() {}
	}
};
</script>

<style lang="scss" scoped></style>
