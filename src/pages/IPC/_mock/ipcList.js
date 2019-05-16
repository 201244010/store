export default {
	'POST /api/device/ipc/getDetailList': {
		code:1,
		msg:'',
		data:{
			device_list:[
				{
					id: '1',
					device_name: undefined,
					active_status: 1,
					model:'SS',
					cdn_address:'http://127.0.0.1:8001/1_u445.png',
					sn:''
				}, 
				{
					id: '2',
					device_name: '北门摄像头1',
					active_status: 0,
					model:'SS',
					cdn_address:'http://127.0.0.1:8001/1_u445.png'
				},
				{
					id: '3',
					device_name: '后门摄像头',
					active_status: 1,
					model:'SS',
					cdn_address:'http://127.0.0.1:8001/1_u445.png'
				},
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:undefined,
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },{
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },{
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },{
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },{
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },{
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },{
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },{
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },{
				// 	id: '1',
				// 	device_name: undefined,
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// }, {
				// 	id: '2',
				// 	device_name: '北门摄像头1',
				// 	active_status: 0,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '3',
				// 	device_name: '后门摄像头',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/1_u445.png'
				// },
				// {
				// 	id: '4',
				// 	device_name: '区域2',
				// 	active_status: 1,
				// 	model:'SS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// },
				// {
				// 	id: '5',
				// 	device_name: '南门摄像头',
				// 	active_status: true,
				// 	model:'FS',
				// 	cdn_address:'http://127.0.0.1:8001/u443.jpg'
				// }

				
			]
		}}
};