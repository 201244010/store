export default {
	'POST /api/trade/order/getInfo': {
		'code': 1,
		'msg': '',
		'data': {
			'id': 123,
			'order_name': '订单名称',
			'order_no': '订单编号',
			'purchase_type': 'purchase-type-alipay',
			'issuer_account': 18817831994,
			'payer_account': '18817831994@163.com',
			'purchase_amount': 85,
			'payment_amount': 85,
			'status': 4,
			'remaining_time': 3600,
			'invoice_info': {
				'invoice_kind': 1,
				'title_type': 1,
				'title_name': '商米科技',
				'tax_register_no': '1234',
				'user_address': '1234',
				'open_bank_name': '中国工商银行',
				'open_bank_account': '63330121',
				'mobile_phone': '18817831234',
				'email': '18817831234@sunmi.com'
			},
			'service_list': [{
				'device_sn': '123456',
				'device_name': '设备名称',
				'img_url': '图片地址',
				'device_status': 1,
				'service_no': '服务编号',
				'service_type': 1,
				'subscribe_status': 2
			}],
			'order_detail_list': [{
				'product_no': 'YCC0001',
				'product_name': '商品名称',
				'product_alias': '商品简称',
				'product_type': 1,
				'product_cnt': 1,
				'product_price': 1.88,
				'product_selling_price': 0.88
			}]
		}
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
	}
};