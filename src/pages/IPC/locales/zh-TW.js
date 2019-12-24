import videoPlayer from './zh-TW/videoPlayer';
import activeDetection from './zh-TW/activeDetection';
import deviceBasicInfo from './zh-TW/deviceBasicInfo';
import basicParams from './zh-TW/basicParams';
import networkSetting from './zh-TW/networkSetting';
import ipcManagement from './zh-TW/ipcManagement';
import softwareUpdate from './zh-TW/softwareUpdate';
import cardManagement from './zh-TW/cardManagement';
import cloudService from './zh-TW/cloudService';
import faceidLibrary from './zh-TW/faceidLibrary';
import menu from './zh-TW/menu';
import ipcList from './zh-TW/ipcList';
import sdcard from './zh-TW/sdcard';
import common from './zh-TW/common';
import motionList from './zh-TW/motionList';
import posList from './zh-TW/posList';
import tradeVideos from './zh-TW/tradeVideos';
import live from './zh-TW/live';
import photoManagement from './zh-TW/photoManagement';
import faceLog from './zh-TW/faceLog';
import entryDetail from './zh-TW/entryDetail';
import initialSetting from './zh-TW/initialSetting';
import agreementModal from './zh-TW/agreementModal';
import nvrManagement from './zh-TW/nvrManagement';
import cloudStorage from './zh-TW/cloudStorage';
import protocol from './zh-TW/protocol';

export default {

	...common,
	...faceidLibrary,
	...videoPlayer,
	...ipcManagement,
	...deviceBasicInfo,
	...activeDetection,
	...basicParams,
	...networkSetting,
	...softwareUpdate,
	...cardManagement,
	...cloudService,
	...menu,
	...sdcard,
	...ipcList,
	...motionList,
	...posList,
	...tradeVideos,
	...live,
	...photoManagement,
	...faceLog,
	...entryDetail,
	...initialSetting,
	...agreementModal,
	...nvrManagement,
	...cloudStorage,
	...protocol
};