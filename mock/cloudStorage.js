export default {
	'POST /api/organization/create': {
		code:1,
		msg:'',
		data:{}
	},
	'POST /api/organization/update': {
		code:1,
		msg:'',
		data:{}
	},
	'POST /api/order/create': {
		code:2,
		msg:'',
		data:{
			order_no:'123'
		}
	},
	'POST /ipc/api/storage/getList': {
		code:1,
		msg:'',
		data:{
			device_list:[
				{
					device_id:'123',
					device_sn:'sn1234567890',
					device_name:'第三方化',
					status:3,
					valid_time:0,
					img_url:'http://test.cdn.sunmi.com/IMG/IPC/2ef12b5f43f6e56885f4f928fbd3eefee598459b7d2aee6c27a34aaf37db5859'
				},
				{
					device_id:'124',
					device_sn:'sn1234567891',
					device_name:'xxxx',
					status:1,
					valid_time:26400,
					img_url:'http://test.cdn.sunmi.com/IMG/IPC/2ef12b5f43f6e56885f4f928fbd3eefee598459b7d2aee6c27a34aaf37db5859'
				},
				{
					device_id:'125',
					device_sn:'sn1234567892',
					device_name:'xxxx',
					status:1,
					valid_time:259200,
					img_url:'http://test.cdn.sunmi.com/IMG/IPC/2ef12b5f43f6e56885f4f928fbd3eefee598459b7d2aee6c27a34aaf37db5859'
				},
				{
					device_id:'126',
					device_sn:'sn1234567893',
					device_name:'xxxx',
					status:1,
					valid_time:176400,
					img_url:'http://test.cdn.sunmi.com/IMG/IPC/2ef12b5f43f6e56885f4f928fbd3eefee598459b7d2aee6c27a34aaf37db5859'
				},
				{
					device_id:'127',
					device_sn:'sn1234567894',
					device_name:'xxxx',
					status:1,
					valid_time:259207,
					img_url:'http://test.cdn.sunmi.com/IMG/IPC/2ef12b5f43f6e56885f4f928fbd3eefee598459b7d2aee6c27a34aaf37db5859'
				},
				{
					device_id:'128',
					device_sn:'sn1234567895',
					device_name:'xxxx',
					status:1,
					valid_time:0,
					img_url:'http://test.cdn.sunmi.com/IMG/IPC/2ef12b5f43f6e56885f4f928fbd3eefee598459b7d2aee6c27a34aaf37db5859'
				}
			]
		}
	},
	'POST /api/organization/getList': {
		code: 1,
		msg: '',
		data: {
			orgList: [{
				orgPid: '1',
				orgName: '一级',
				orgTag: 0,
				orgStatus: 0,
				address: '',
				contactPerson: '张三',
				orgId: '11',
				level: 1,
				children: [{
					orgPid: '11',
					orgName: '二级1',
					orgTag: 0,
					orgStatus: 0,
					address: '深圳南山区',
					contactPerson: '张三',
					orgId: '111',
					level: 2,
					children: [{
						orgPid: '111',
						orgName: '三级',
						orgTag: 0,
						orgStatus: 0,
						address: '深圳南山区',
						contactPerson: '张三',
						orgId: '1111',
						level: 3,
						children: [{
							orgPid: '1111',
							orgName: '四级',
							orgTag: 0,
							orgStatus: 0,
							address: '深圳南山区',
							contactPerson: '张三',
							orgId: '11111',
							level: 4,
							children: [{
								orgPid: '11111',
								orgName: '五级',
								orgTag: 0,
								orgStatus: 0,
								address: '深圳南山区',
								contactPerson: '张三',
								orgId: '111111',
								level: 5,
							}]
						}]
					}]
				}, {
					orgPid: '11',
					orgName: '二级2',
					orgTag: 0,
					orgStatus: 0,
					address: '深圳南山区',
					contactPerson: '张三',
					orgId: '112',
					level: 2,
				}]
			}, {
				orgPid: '1',
				orgName: '一级2',
				orgTag: 0,
				orgStatus: 1,
				address: '深圳南山区',
				province: 13,
				contactPerson: '张三',
				orgId: '12',
				level: 1,
				children: [{
					orgPid: '12',
					orgName: '一级21',
					orgTag: 0,
					orgStatus: 0,
					address: '深圳南山区',
					province: 13,
					contactPerson: '张三',
					orgId: '121',
					level: 1,
					children: [{
						orgPid: '121',
						orgName: '一级211',
						orgTag: 0,
						orgStatus: 0,
						address: '深圳南山区',
						province: 13,
						contactPerson: '张三',
						orgId: '1211',
						level: 3
					}]
				}]
			}]
		}
	},
	'POST /api/organization/getInfo': {
		'code': 1,
		'data': {
			'org_pid': 111,
			'org_tag': 1,
			'level': 3,
			'org_id': 1111,
			'org_name': '三级',
			'org_status': 1,
			'org_pname': '',
			'sunmi_shop_no': '',
			'business_status': 1,
			'province': 13,
			'city': 10,
			'area': 345,
			'lat': '',
			'lng':'',
			'address': '一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
			'business_area': 34,
			'region': '1',
			'type_one': 1,
			'type_two': 15,
			'type_name': '',
			'business_hours': '早上9点',
			'contact_person': '34345',
			'contact_tel': '13226653553',
			'contact_email': '11@qq.com',
			'created_time': 1556441829,
			'modified_time': 1576492881,
			'saas_exist': 0,
		},
		'msg': ''
	},
	'POST /api/organization/getLayerByUser': {
		'data':{
			'org_layer':[
				{
					'org_id':20760,
					'org_pid':0,
					'level':1,
					'org_tag':0,
					'org_status':0,
					'sunmi_shop_no':'200227200600',
					'business_area':0,
					'user_bind_status':1,
					'org_name':'有一个门店',
					'children':[
						{
							'org_id':20761,
							'org_pid':20760,
							'level':2,
							'org_tag':0,
							'org_status':0,
							'sunmi_shop_no':'200227200601',
							'business_area':0,
							'user_bind_status':1,
							'org_name':'新的门店',
							'children':[
	
							]
						}
					]
				},
				{
					'org_id':20768,
					'org_pid':0,
					'level':1,
					'org_tag':0,
					'org_status':0,
					'sunmi_shop_no':'',
					'business_area':0,
					'user_bind_status':1,
					'org_name':'eee',
					'children':[
	
					]
				},
				{
					'org_id':7856,
					'org_pid':0,
					'level':1,
					'org_tag':0,
					'org_status':0,
					'sunmi_shop_no':'200228070506',
					'business_area':10,
					'user_bind_status':1,
					'org_name':'www',
					'children':[
						{
							'org_id':9031,
							'org_pid':7856,
							'level':2,
							'org_tag':0,
							'org_status':0,
							'sunmi_shop_no':'200220090301',
							'business_area':0,
							'user_bind_status':1,
							'org_name':'我的又一个新店',
							'children':[
	
							]
						},
						{
							'org_id':20780,
							'org_pid':7856,
							'level':2,
							'org_tag':1,
							'org_status':0,
							'sunmi_shop_no':'000000000000',
							'business_area':0,
							'user_bind_status':1,
							'org_name':'department',
							'children':[
	
							]
						}
					]
				},
				{
					'org_id':9594,
					'org_pid':0,
					'level':1,
					'org_tag':0,
					'org_status':0,
					'sunmi_shop_no':'200225090904',
					'business_area':0,
					'user_bind_status':1,
					'org_name':'myshop',
					'children':[
	
					]
				},
				{
					'org_id':9690,
					'org_pid':0,
					'level':1,
					'org_tag':0,
					'org_status':0,
					'sunmi_shop_no':'200226090900',
					'business_area':0,
					'user_bind_status':1,
					'org_name':'EMPLOYEE_SHOP',
					'children':[
						{
							'org_id':9694,
							'org_pid':9690,
							'level':2,
							'org_tag':0,
							'org_status':0,
							'sunmi_shop_no':'200226090904',
							'business_area':0,
							'user_bind_status':1,
							'org_name':'other company',
							'children':[
								{
									'org_id':9695,
									'org_pid':9694,
									'level':3,
									'org_tag':0,
									'org_status':0,
									'sunmi_shop_no':'200226090905',
									'business_area':0,
									'user_bind_status':1,
									'org_name':'other shop',
									'children':[
	
									]
								}
							]
						}
					]
				}
			]
		},
		'code':1,
		'msg':''
	},
	'POST /api/organization/checkDisabled': {
		code: 1,
		msg: '',
		data: {}
	},
	'POST /api/organization/move': {
		code: 1,
		msg: '',
		data: {}
	},
	'POST /api/organization/disable': {
		code: 1,
		msg: '',
		data: {}
	},
	'POST /api/organization/enable': {
		code: 1,
		msg: '',
		data: {}
	},
};