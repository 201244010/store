import React, {Component, Fragment} from 'react';
import ButtonIcon from './ButtonIcon';
import ZoomIcon from './ZoomIcon';
import * as styles from './index.less';

export default class BoardHeader extends Component {
    render() {
        const {templateInfo = {}, zoomScale, saveAsDraft, updateState} = this.props;

        return (
            <Fragment>
                <div className={styles["left-actions"]}>
                    <ButtonIcon name="save" onClick={saveAsDraft} />
                    <ButtonIcon name="check" />
                    <ButtonIcon name="preStep" />
                    <ButtonIcon name="nextStep" />
                </div>
                <div className={styles["title-edit"]}>
                    {templateInfo.name}
                    <img src={require('@/assets/studio/edit.svg')} alt="" />
                </div>
                <div className={styles["right-actions"]}>
                    <ZoomIcon zoomScale={zoomScale} updateState={updateState} />
                    <ButtonIcon name="wrapper" />
                    <ButtonIcon name="view" />
                    <ButtonIcon name="history" />
                </div>
            </Fragment>
        )
    }
}