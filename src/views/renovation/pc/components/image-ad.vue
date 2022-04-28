<template>
	<div>
		<div v-if="!list.length" class="componnent-no-data">【图片广告模块】请点击关联数据</div>
		<div v-for="(item, index) in list" :key="index">
			<img :src="item.src" style="width: 100%; height: 150px" />
		</div>
	</div>
</template>

<script>
export default {
	props: {
		list: Array
	}
};
</script>

<style></style>
