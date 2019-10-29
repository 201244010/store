export  default {
	'FS1': {
		hasFaceid: true,
		hasTFCard: true,
		hasCloud: false,
		hasNVR: false,
		pixelRatio: '16:9',
		leastVersion: '1.1.3',
		rotate: [{
			key: 0,
			value: 0
		},{
			key: 1,
			value: 180
		}],
		OTATime:{
			// checkTime: 2000,
			// downloadTime: 10000,
			// AIUpgradeTime: 185000,
			// HSUpgradeTime: 33000,
			// wiredRestartTime: 16000,
			// wirelessRestartTime: 45000
			totalTime: 680000,
			defaultDownloadTime: 210000,
			defaultAIUpgradeTime: 270000,
			defaultFirmwareTime: 50000,
			defaultRestartTime: 150000,
		},
		STATUS_PERCENT :{
			DOWNLOAD: 29,
			AI: 67,
			FIRMWARE: 74,
			RESTART : 95
		}

	},
	'FM020': {
		hasFaceid: true,
		hasTFCard: true,
		hasCloud: false,
		hasNVR: false,
		pixelRatio: '16:9',
		leastVersion: '1.1.3',
		rotate: [{
			key: 0,
			value: 0
		},{
			key: 1,
			value: 180
		}],
		OTATime:{
			// checkTime: 2000,
			// downloadTime: 10000,
			// AIUpgradeTime: 185000,
			// HSUpgradeTime: 33000,
			// wiredRestartTime: 16000,
			// wirelessRestartTime: 45000,
			totalTime: 680000,
			defaultDownloadTime: 210000,
			defaultAIUpgradeTime: 270000,
			defaultFirmwareTime: 50000,
			defaultRestartTime: 150000
		},
		STATUS_PERCENT :{
			DOWNLOAD: 29,
			AI: 67,
			FIRMWARE: 74,
			RESTART : 95
		}
	},
	'SS1': {
		hasFaceid: false,
		hasTFCard: true,
		hasCloud: true,
		hasNVR: false,
		pixelRatio: '1:1',
		leastVersion: '1.2.6',
		rotate: [{
			key: 0,
			value: 0
		},{
			key: 1,
			value: 90
		},{
			key: 2,
			value: 180
		},{
			key: 3,
			value: 270
		}],
		OTATime:{
			// checkTime: 2000,
			// downloadTime: 10000,
			// AIUpgradeTime: 0,
			// HSUpgradeTime: 33000,
			// wiredRestartTime: 16000,
			// wirelessRestartTime: 45000
			totalTime:410000,
			defaultDownloadTime: 210000,
			defaultAIUpgradeTime: 0,
			defaultFirmwareTime: 50000,
			defaultRestartTime: 150000
		},
		STATUS_PERCENT :{
			DOWNLOAD: 48,
			AI: 48,
			FIRMWARE: 60,
			RESTART : 95
		}
	},
	'FM010': {
		hasFaceid: false,
		hasTFCard: true,
		hasNVR: false,
		hasCloud: true,
		pixelRatio: '1:1',
		leastVersion: '1.2.6',
		rotate: [{
			key: 0,
			value: 0
		},{
			key: 1,
			value: 90
		},{
			key: 2,
			value: 180
		},{
			key: 3,
			value: 270
		}],
		OTATime:{
			// checkTime: 2000,
			// downloadTime: 10000,
			// AIUpgradeTime: 0,
			// HSUpgradeTime: 33000,
			// wiredRestartTime: 16000,
			// wirelessRestartTime: 45000
			totalTime: 410000,
			defaultDownloadTime: 210000,
			defaultAIUpgradeTime: 0,
			defaultFirmwareTime: 50000,
			defaultRestartTime: 150000
		},
		STATUS_PERCENT :{
			DOWNLOAD: 48,
			AI: 48,
			FIRMWARE: 60,
			RESTART : 95
		}
	}
};