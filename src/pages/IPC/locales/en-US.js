import videoPlayer from './en-US/videoPlayer';
import activeDetection from './en-US/activeDetection';
import deviceBasicInfo from './en-US/deviceBasicInfo';
import basicParams from './en-US/basicParams';
import networkSetting from './en-US/networkSetting';
import ipcManagement from './en-US/ipcManagement';
import softwareUpdate from './en-US/softwareUpdate';
import cardManagement from './en-US/cardManagement';
import cloudService from './en-US/cloudService';
import faceidLibrary from './en-US/faceidLibrary';
import menu from './en-US/menu';
import ipcList from './en-US/ipcList';
import sdcard from './en-US/sdcard';
import common from './en-US/common';
import motionList from './en-US/motionList';
import posList from './en-US/posList';
import tradeVideos from './en-US/tradeVideos';
import live from './en-US/live';
import photoManagement from './en-US/photoManagement';
import faceLog from './en-US/faceLog';
import entryDetail from './en-US/entryDetail';
import initialSetting from './en-US/initialSetting';
import agreementModal from './en-US/agreementModal';
import nvrManagement from './en-US/nvrManagement';
import cloudStorage from './en-US/cloudStorage';
import protocol from './en-US/protocol';

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