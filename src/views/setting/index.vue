<template>
	<div>
		<el-card shadow="never">
			<div slot="header">
				<span>店铺设置</span>
			</div>
			<el-form ref="form" label-position="left" label-width="120px" size="normal">
				<el-form-item label="店铺名称">
					<el-row :gutter="20" type="flex" justify="space-between" style="border-bottom: 1px solid #dddddd">
						<el-col :span="6" :offset="0">帝莎编程学院</el-col>
						<el-col :span="2" :offset="0">
							<el-button type="text">设置</el-button>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="店铺地址">
					<el-row :gutter="20" type="flex" justify="space-between" style="border-bottom: 1px solid #dddddd">
						<el-col :span="6" :offset="0">https://appkIpg1do32080.h5.xxxxx.com</el-col>
						<el-col :span="2" :offset="0">
							<el-button type="text">复制地址</el-button>
						</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="店铺管理员">
					<el-row :gutter="20" type="flex" justify="space-between" style="border-bottom: 1px solid #dddddd">
						<el-col :span="6" :offset="0">156****2873</el-col>
					</el-row>
				</el-form-item>
				<el-form-item label="店铺appid">
					<el-row :gutter="20" type="flex" justify="space-between" style="border-bottom: 1px solid #dddddd">
						<el-col :span="6" :offset="0">appkIpg1do32080</el-col>
					</el-row>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>
<script>
export default {};
</script>
