import request from '@/utils/request';

export function fetchSchool(query) {
	return request({
		url: '/admin/school',
		method: 'get',
		params: query
	});
}

export function createSchool(data) {
	return request({
		url: '/admin/school/save',
		method: 'post',
		data
	});
}
