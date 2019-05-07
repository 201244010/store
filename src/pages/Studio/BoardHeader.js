import React, {Component, Fragment} from 'react';
import ButtonIcon from './ButtonIcon';
import ZoomIcon from './ZoomIcon';
import * as styles from './index.less';
import { getLocationParam } from "@/utils/utils";
import { ERROR_OK } from "@/constants/errorCode";

export default class BoardHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            templateName: ''
        }
    }

    toChangeName = () => {
        const {templateInfo} = this.props;

        this.setState({
            editing: true,
            templateName: templateInfo.name
        });
    };

    handleChangeName = (e) => {
        e.persist();
        this.setState({
            templateName: e.target.value
        });
    };

    handleConfirmChangeName = async () => {
        const {
            props: {templateInfo, renameTemplate, fetchTemplateDetail},
            state: {templateName}
        } = this;
        if (templateInfo.name !== templateName) {
            const response = await renameTemplate({
                template_id: getLocationParam('id'),
                name: templateName
            });
            if (response && response.code === ERROR_OK) {
                fetchTemplateDetail({
                    template_id: getLocationParam('id'),
                });
                this.setState({
                    editing: false,
                    templateName: ''
                });
            }
        } else {
            this.setState({
                editing: false,
                templateName: ''
            });
        }
    };

    render() {
        const {
            state: {editing, templateName},
            props: {
                templateInfo = {}, zoomScale, saveAsDraft, zoomOutOrIn
            }
        } = this;

        return (
            <Fragment>
                <div className={styles["left-actions"]}>
                    <ButtonIcon name="save" onClick={saveAsDraft} />
                    <ButtonIcon name="check" />
                    <ButtonIcon name="preStep" />
                    <ButtonIcon name="nextStep" />
                </div>
                <div className={styles["title-edit"]}>
                    {
                        editing ?
                            <input
                                type="text"
                                className={styles["edit-input"]}
                                value={templateName}
                                onChange={(e) => this.handleChangeName(e)}
                                onBlur={this.handleConfirmChangeName}
                            /> :
                            <Fragment>
                                {templateInfo.name}
                                <img
                                    className={styles["edit-img"]}
                                    src={require('@/assets/studio/edit.svg')}
                                    onClick={this.toChangeName}
                                />
                            </Fragment>
                    }
                </div>
                <div className={styles["right-actions"]}>
                    <ZoomIcon zoomScale={zoomScale} zoomOutOrIn={zoomOutOrIn} />
                    <ButtonIcon name="wrapper" />
                    <ButtonIcon name="view" />
                    <ButtonIcon name="history" />
                </div>
            </Fragment>
        )
    }
}