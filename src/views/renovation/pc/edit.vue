<template>
	<div style="background-color: #eeeeee">
		<el-row :gutter="20">
			<el-col :span="6">
				<el-card style="height: 80vh; overflow: auto" :body-style="{ padding: '10px 8px' }">
					<el-row>
						<el-col :span="24" v-for="(item, index) in components" :key="index" style="margin-bottom: 15px">
							<el-card
								shadow="hover"
								:body-style="{ padding: '15px 8px', cursor: 'pointer' }"
								@click.native="handleComponent(item)"
							>
								<div style="display: flex; align-items: center">
									<i :class="item.icon" style="font-size: 25px; color: #13ce66; margin-right: 8px"></i>
									<span style="font-size: 13px">{{ item.title }}</span>
								</div>
							</el-card>
						</el-col>
					</el-row>
				</el-card>
			</el-col>

			<el-col :span="15" style="height: 85vh; overflow-y: auto">
				<el-row :gutter="20">
					<el-col :span="23" :offset="0" style="padding-top: 20px">
						<el-card style="min-height: 80vh; overflow: inherit" :body-style="{ padding: '0px 8px' }">
							<div style="margin-left: -9px; margin-right: -10px">
								<nav-bar></nav-bar>

								<div
									v-for="(item, index) in templates"
									:key="index"
									:class="['checked-box', item.checked ? 'checked-box-active' : '']"
									@click="handleCheckedComponent(item)"
								>
									<!--  操作按钮 -->
									<div v-if="item.checked" class="checked-box-btns">
										<i :class="['el-icon-top', index === 0 ? 'i-disabled' : '']" @click.stop="moveUp(index)"></i>
										<i
											:class="['el-icon-bottom', index === templates.length - 1 ? 'i-disabled' : '']"
											@click.stop="moveDown(index)"
										></i>
										<i class="el-icon-delete" @click.stop="deleteComponent(index)"></i>
									</div>
									<!-- 列表 -->
									<template v-if="item.type === 'list'">
										<list
											:title="item.title"
											:showMore="item.showMore"
											:list="item.data"
											:listType="item.listType"
										></list>
									</template>
									<!-- swiper -->
									<template v-else-if="item.type === 'swiper'">
										<swiper :list="item.data"></swiper>
									</template>
									<!-- 图标分类 -->
									<template v-else-if="item.type == 'icons'">
										<icons :list="item.data"></icons>
									</template>
									<!-- 广告图 -->
									<template v-else-if="item.type == 'imageAd'">
										<image-ad :list="item.data"></image-ad>
									</template>
									<!-- 拼团 -->
									<template v-else-if="item.type == 'promotion'">
										<promotion :title="item.title" :list="item.data" :listType="item.listType"></promotion>
									</template>
								</div>
							</div>

							<!-- 页面底部 -->
							<page-footer></page-footer>
						</el-card>
					</el-col>
				</el-row>
			</el-col>

			<div
				v-show="currentCompoent.type && currentCompoent.type != 'coupon'"
				style="position: fixed; right: 0px; top: 80px"
			>
				<el-card
					shadow="always"
					:body-style="{ padding: '20px' }"
					style="width: 250px; height: 85vh; position: relative; border: 0"
				>
					<div slot="header">
						<span>组件编辑</span>
					</div>
					<div style="overflow-y: auto; position: absolute; left: 0; right: 0; bottom: 0; top: 60px">
						<component-form
							ref="componentForm"
							:formType="currentCompoent.type"
							@change="onCurrentCompoentChange"
						></component-form>
					</div>
				</el-card>
			</div>
		</el-row>
	</div>
</template>

<script>
import List from './components/list.vue';
import componentForm from './components/component-form.vue';
import Swiper from './components/swiper.vue';
import Icons from './components/icons.vue';
import ImageAd from './components/image-ad.vue';
import Promotion from './components/promotion.vue';
import NavBar from './components/nav-bar.vue';
import PageFooter from './components/page-footer.vue';

import util from '@/utils/util.js';

export default {
	components: {
		List,
		componentForm,
		Swiper,
		Icons,
		ImageAd,
		Promotion,
		NavBar,
		PageFooter
	},
	computed: {
		// 当前选中对象
		currentCompoent() {
			let i = this.templates.findIndex((v) => v.checked);
			return this.templates[i] || {};
		}
	},
	data() {
		return {
			components: [
				{
					icon: 'el-icon-s-order',
					title: '课程列表',
					type: 'list',
					default: {
						listType: 'one',
						title: '最新列表',
						showMore: true,
						more: false,
						data: []
					}
				},
				{
					icon: 'el-icon-s-help',
					title: '轮播图',
					type: 'swiper',
					default: {
						data: [
							{
								src: 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943'
							},
							{
								src: 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943'
							},
							{
								src: 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943'
							}
						]
					}
				},
				{
					icon: 'el-icon-menu',
					title: '图标分类',
					type: 'icons',
					default: {
						data: [
							{
								src: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
								name: '分类',
								type: '',
								url: '',
								page_id: 0,
								page_title: '',
								course_title: '',
								course_id: ''
							},
							{
								src: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
								name: '分类',
								type: '',
								url: '',
								page_id: 0,
								page_title: '',
								course_title: '',
								course_id: ''
							},
							{
								src: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
								name: '分类',
								type: '',
								url: '',
								page_id: 0,
								page_title: '',
								course_title: '',
								course_id: ''
							},
							{
								src: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
								name: '分类',
								type: '',
								url: '',
								page_id: 0,
								page_title: '',
								course_title: '',
								course_id: ''
							}
						]
					}
				},
				{
					icon: 'el-icon-s-order',
					title: '限时拼团',
					type: 'promotion',
					default: {
						listType: 'group',
						title: '拼团',
						data: []
					}
				},
				{
					icon: 'el-icon-picture-outline',
					title: '图片广告',
					type: 'imageAd',
					default: {
						data: [
							{
								src: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
							}
						]
					}
				}
			],
			templates: []
		};
	},
	methods: {
		// 监听表单组件的表单变化
		onCurrentCompoentChange(e) {
			let i = this.templates.find((e) => e.checked);
			if (i) {
				i[e.key] = e.value;
			}
		},
		// 最左侧组件
		handleComponent(row) {
			// 深拷贝
			let data = JSON.parse(JSON.stringify(row.default));
			data.checked = false;
			data.type = row.type;
			this.templates.push(data);
		},
		// 中间组件
		handleCheckedComponent(item) {
			if (item.type == 'coupon') return;

			this.templates.map((v) => (v.checked = false));
			item.checked = true;

			this.$refs.componentForm.initVal(item);
		},
		moveUp(i) {
			if (i == 0) {
				return;
			}
			util.moveUp(this.templates, i);
		},
		moveDown(i) {
			if (i == this.templates.length - 1) {
				return;
			}
			util.moveDown(this.templates, i);
		},
		deleteComponent(i) {
			this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.templates.splice(i, 1);
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.checked-box {
	cursor: pointer;
	position: relative;
}

.checked-box-active {
	border: 2px dotted #2196f3;
	padding: 5px 0;
	margin-bottom: 10px;
}

.checked-box-btns {
	position: absolute;
	display: flex;
	flex-direction: column;
	background-color: #ffffff;
	border: 2px dotted #2196f3;
	right: -29px;
	top: -2px;
	z-index: 1;
	border-left-width: 0;
}

.checked-box-btns i {
	padding: 4px 6px;
	color: #2196f3;
	font-weight: bold;
}

.checked-box-btns i:hover {
	background-color: #eeeeee;
}

.checked-box-btns .i-disabled {
	background-color: #ffffff;
	cursor: no-drop;
	color: #bbbbbb;
}
</style>
