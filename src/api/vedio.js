import request from '@/utils/request';

export function fetchList(query) {
	return request({
		url: '/vue-element-admin/vedio/list',
		method: 'get',
		params: query
	});
}

export function createCourse(data) {
	return request({
		url: '/vue-element-admin/vedio/create',
		method: 'post',
		data
	});
}

export function updateCourse(data) {
	return request({
		url: '/vue-element-admin/vedio/update',
		method: 'post',
		data
	});
}

export function deleteCourse(data) {
	return request({
		url: '/vue-element-admin/vedio/delete',
		method: 'post',
		data
	});
}
