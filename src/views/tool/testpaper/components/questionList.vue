<template>
	<div class="question-list">
		<div>
			第{{ index + 1 }}题
			<slot name="right">
				<span class="el-icon-delete-solid" @click="$emit('del', index)"></span>
			</slot>
		</div>

		<div style="display: flex">
			<QuestionItem :question="item.question"></QuestionItem>
			<div style="margin: 0 10px">
				<slot></slot>
			</div>
		</div>
	</div>
</template>

<script>
import QuestionItem from './QuestionItem.vue';

export default {
	components: {
		QuestionItem
	},
	props: {
		item: Object,
		index: Number
	}
};
</script>

<style lang="scss" scoped>
.question-list {
	border: 1px solid #eee;
	margin-bottom: 10px;
	margin-right: 20px;
}

.question-list > div:first-child {
	padding: 10px 25px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #13ce66;
	background-color: #e7faf0;
	margin-bottom: 10px;
}

.question-list .el-icon-delete-solid {
	font-size: 18px;
	cursor: pointer;
}
</style>
