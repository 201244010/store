import React, { Component } from 'react';
import { getLocale } from 'umi/locale';
import { Icon, Modal } from 'antd';
// import { Divider } from 'antd';
// import BigIcon from '../../../components/BigIcon';
import MobileReset from './MobileReset';
import MailReset from './MailReset';
import styles from './ResetPassword.less';

// const ResetInit = props => {
//     const { switchStep } = props;
//     return (
//         <>
//             <div className={styles['reset-content']}>
//                 <div className={styles['bigIcon-wrapper']} onClick={() => switchStep('toMobile')}>
//                     <BigIcon {...{ type: 'mobile' }} />
//                     <div className={styles['icon-description']}>
//                         {formatMessage({ id: 'reset.by.mobile' })}
//                     </div>
//                 </div>
//                 <Divider
//                     type="vertical"
//                     dashed
//                     style={{ height: '90px', borderRight: '1px dashed #e8e8e8' }}
//                 />
//                 <div className={styles['bigIcon-wrapper']} onClick={() => switchStep('toMail')}>
//                     <BigIcon {...{ type: 'mail' }} />
//                     <div className={styles['icon-description']}>
//                         {formatMessage({ id: 'reset.by.mail' })}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

const RENDER_COMPONENT = {
    toMobile: MobileReset,
    toMail: MailReset,
    default: () => <div />,
};

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 'init',
        };
    }

    switchStep = step => {
        this.setState({
            step,
        });
    };

    getRenderComponent = () => {
        const { step } = this.state;
        const currentLanguage = getLocale();
        let RenderComponent = RENDER_COMPONENT.default;

        if (step === 'init') {
            // TODO 暂时隐去邮箱找回功能
            // RenderComponent = currentLanguage === 'zh-CN' ? ResetInit : MailReset;
            RenderComponent = currentLanguage === 'zh-CN' ? MobileReset : MailReset;
        } else {
            RenderComponent = RENDER_COMPONENT[step];
        }

        return RenderComponent;
    };

    render() {
        const RenderComponent = this.getRenderComponent();
        const { visible, onCancel } = this.props;

        return (
            <Modal
                visible={visible}
                width={400}
                closable={false}
                maskClosable={false}
                title={null}
                footer={null}
                onCancel={onCancel}
            >
                <div className={styles['custom-modal-wrapper']}>
                    <div className={styles['custom-modal-header']}>
                        <div className={styles['close-icon']} onClick={onCancel}>
                            <Icon type="close" />
                        </div>
                    </div>
                    <div className={styles['custom-modal-content']}>
                        <RenderComponent switchStep={this.switchStep} />
                    </div>
                </div>
            </Modal>
        );
    }
}

export default ResetPassword;
