<template>
	<div>
		<div v-if="!list.length">【轮播图模块】请点击关联数据</div>
		<el-carousel height="150px">
			<el-carousel-item v-for="(item, index) in list" :key="index">
				<img :src="item.src" style="width: 100%; height: 150px" />
			</el-carousel-item>
		</el-carousel>
	</div>
</template>

<script>
export default {
	/**
	 *    list:[{
	 *         src:"",
	 *    }]
	 */
	props: {
		list: Array
	}
};
</script>

<style></style>
