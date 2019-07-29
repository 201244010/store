import React from 'react';
import { Modal, Radio } from 'antd';
import { formatMessage } from 'umi/locale';

import styles from './FaceLog.less';

const RadioGroup = Radio.Group;

class FaceIdLibraryMove extends React.Component{

	render(){
		const { moveModalVisible, moveLibraryHandler, faceLibraryList, groupInfo, moveModalHide, handleLibraryName, groupValueChange } = this.props;
		const { groupId } = groupInfo;
		return(
			<Modal
				className={styles['adjust-face-group-modal']}
				visible={moveModalVisible}
				title={formatMessage({id: 'faceLog.adjust.group.to'})}
				onCancel={moveModalHide}
				onOk={moveLibraryHandler}
				width={526}
				destroyOnClose
			>
				<div className={styles['modal-left']}>
					{formatMessage({id: 'faceLog.adjust.to'})}
				</div>
				<div className={styles['modal-right']}>
					<RadioGroup onChange={groupValueChange} defaultValue={groupId}>
						{faceLibraryList&&faceLibraryList.map((item, index) => (
							<Radio value={item.groupId} key={index}>
								{handleLibraryName(item.groupName)}
							</Radio>
						))}
					</RadioGroup>
				</div>
			</Modal>
		);
	}
}

export default FaceIdLibraryMove;
