export default {
	'POST /api/videoSources.json': {
		code: 1,
		data: {
			video_list: [
				{
					url: 'http://localhost:8000/swf/2.flv',
					name: 1,
					timeStart: 1554814140,
					timeEnd: 1554814200
				},

				{
					url: 'http://localhost:8000/swf/3.flv',
					name: 2,
					timeStart: 1554814200,
					timeEnd: 1554814260
				}
			]
		}
	},
	'POST /api/live.json': {
		code: 1,
		msg: '',
		data: {
			stream_id: 152,
			url: 'http://localhost:8000/swf/live.flv',
			resolution: 1
		}
	}
};