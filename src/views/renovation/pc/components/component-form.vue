<template>
	<div>
		<el-form ref="form" label-width="80px" size="normal">
			<!-- 搜索框 -->
			<el-form-item v-if="formType == 'search'" label="占位提示">
				<el-input
					v-model="search.placeholder"
					size="mini"
					style="width: 200px"
					@input="handleChange('placeholder')"
				></el-input>
			</el-form-item>
			<!-- 课程列表 -->
			<template v-else-if="formType == 'list'">
				<el-form-item label="标题">
					<el-input v-model="list.title" size="mini" style="width: 150px" @input="handleChange('title')"></el-input>
				</el-form-item>
				<el-form-item label="更多">
					<el-radio-group v-model="list.showMore" @change="handleChange('showMore')">
						<el-radio :label="true">显示</el-radio>
						<el-radio :label="false">隐藏</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="更多链接">
					<el-button type="default" size="mini" @click="handleChoosePage">
						{{ list.more ? list.more.title : '选择页面' }}
					</el-button>
				</el-form-item>
				<el-form-item label-width="0">
					<div class="choose-course-btn">
						<el-button icon="el-icon-circle-plus-outline" type="text" @click="handleChooseCourse">关联课程</el-button>
						<span>最多关联10门</span>
					</div>
					<drag-course :list="list.data" @del="deleteCourse"></drag-course>
				</el-form-item>
			</template>

			<!-- swiper -->
			<template v-else-if="formType == 'swiper'">
				<el-form-item label-width="0">
					<div class="choose-course-btn">
						<el-button icon="el-icon-circle-plus-outline" type="text" @click="createSwiper">新增轮播图</el-button>
						<span>最多5张</span>
					</div>
				</el-form-item>
				<drag-swiper :list="swiper.data" @del="deleteCourse"></drag-swiper>
			</template>

			<!-- icon -->
			<template v-else-if="formType == 'icons'">
				<el-form-item label-width="0">
					<div class="choose-course-btn">
						<el-button icon="el-icon-circle-plus-outline" type="text" @click="createIcon">新增分类</el-button>
						<span>最多8张</span>
					</div>
				</el-form-item>
				<drag-icons :list="icons.data" @del="deleteIcons"></drag-icons>
			</template>
			<!-- 活动图片 -->
			<template v-else-if="formType == 'imageAd'">
				<el-form-item label-width="0">
					<div class="choose-course-btn">
						<el-button icon="el-icon-circle-plus-outline" type="text" @click="createImageAd">新增图片</el-button>
					</div>
				</el-form-item>
				<drag-swiper :list="imageAd.data" @del="deleteSwiper"></drag-swiper>
			</template>

			<!-- 限时拼团 -->
			<template v-else-if="formType == 'promotion'">
				<el-form-item label="类型">
					<el-radio-group v-model="promotion.listType" @change="handleChange('listType')">
						<el-radio label="group">拼团</el-radio>
						<el-radio label="flash">限时活动</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="标题">
					<el-input
						v-model="promotion.title"
						size="mini"
						style="width: 200px"
						@input="handleChange('title')"
					></el-input>
				</el-form-item>
				<el-form-item label-width="0">
					<div class="choose-course-btn">
						<el-button icon="el-icon-circle-plus-outline" type="text" @click="handleChooseCourse">关联课程</el-button>
						<span>最多关联10门</span>
					</div>
				</el-form-item>
				<drag-course :list="promotion.data" @del="deleteCourse"></drag-course>
			</template>
		</el-form>

		<choose-course ref="chooseCourse"></choose-course>
		<choose-page ref="choosePage"></choose-page>
		<upload-image ref="uploadImage"></upload-image>
	</div>
</template>

<script>
import DragCourse from './drag-course.vue';
import ChooseCourse from '@/components/choose-course/choose-course.vue';
import ChoosePage from './choose-page.vue';
import DragSwiper from './drag-swiper.vue';
import UploadImage from './upload-image.vue';
import DragIcons from './drag-icons.vue';

export default {
	components: {
		DragCourse,
		ChooseCourse,
		ChoosePage,
		DragSwiper,
		UploadImage,
		DragIcons
	},
	props: {
		formType: {
			type: String,
			default: ''
		}
	},
	provide() {
		return {
			componentForm: this
		};
	},
	data() {
		return {
			search: {
				placeholder: ''
			},
			list: {
				listType: 'one',
				title: '',
				showMore: true,
				more: false,
				data: []
			},
			swiper: {
				data: []
			},
			icons: {
				data: []
			},
			imageAd: {
				data: []
			},
			promotion: {
				listType: 'group',
				title: '',
				data: []
			}
		};
	},
	methods: {
		// 删除轮播图
		deleteSwiper(index) {
			this.$confirm('是否要删除该轮播图？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then((action) => {
				this[this.formType].data.splice(index, 1);
			});
		},
		deleteIcons(index) {
			this.$confirm('是否要删除该分类？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then((action) => {
				this.icons.data.splice(index, 1);
			});
		},
		createImageAd() {
			if (this.imageAd.data.length === 1) {
				return this.$message({
					type: 'error',
					message: '最多只能创建1个'
				});
			}
			this.imageAd.data.push({
				src: 'https://dummyimage.com/365x150',
				type: '', // 课程course,网页地址webview
				course_title: '',
				course_id: '',
				url: ''
			});
		},
		createIcon() {
			if (this.icons.data.length === 8) {
				return this.$message({
					type: 'error',
					message: '最多只能创建8个'
				});
			}
			this.icons.data.push({
				src: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
				name: '分类',
				type: '',
				url: '',
				page_id: 0,
				page_title: '',
				course_title: '',
				course_id: ''
			});
		},
		// 打开选择课程框
		openChooseCourse(callback, limit) {
			this.$refs.chooseCourse.open(callback, limit);
		},
		// 监听实时变化
		handleChange(key) {
			this.$emit('change', {
				key,
				value: this[this.formType][key]
			});
		},
		// 初始化数据
		initVal(val) {
			for (const key in val) {
				this[val.type][key] = val[key];
			}
		},
		// 选择页面
		handleChoosePage() {
			this.$refs.choosePage.open((val) => {
				this.list.more = val[0];
			}, 1);
		},
		// 关联课程
		handleChooseCourse() {
			this.$refs.chooseCourse.open((val) => {
				this[this.formType].data = [...this[this.formType].data, ...val];
				this.handleChange('data');
			}, 10);
		},
		// 删除关联
		deleteCourse(row) {
			this.$confirm('是否要取消关联该课程？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then((action) => {
				let i = this[this.formType].data.findIndex((v) => v.id == row.id);
				if (i !== -1) {
					this[this.formType].data.splice(i, 1);
					this.$message({
						message: '取消关联成功',
						type: 'success'
					});
				}
			});
		},
		// 新增轮播图
		createSwiper() {
			if (this.swiper.data.length === 5) {
				return this.$message({
					type: 'error',
					message: '最多只能创建5个'
				});
			}
			this.swiper.data.push({
				src: 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943',
				type: '课程course', // 课程course,网页地址webview
				course_title: '',
				course_id: '',
				url: ''
			});
		}
	}
};
</script>

<style>
.choose-course-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	border: 1px dotted #13ce66;
}
.choose-course-btn span {
	color: #888888;
	font-size: 12px;
}
</style>
