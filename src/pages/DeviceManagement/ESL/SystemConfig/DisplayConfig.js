import React, {Component} from 'react';
import {Card, Icon, Tooltip, Row, Col, Input, Select, Button} from 'antd';
import { formatMessage } from 'umi/locale';
import {connect} from 'dva';
import styles from './index.less';

const { Option } = Select;

const FormTip = ({ text = '', pos = 'right', style = {} }) => (
	<Tooltip placement={pos} title={text}>
		<Icon type="question-circle" style={{ marginLeft: '20px', ...style }} />
	</Tooltip>
);

@connect(
	state => ({
		systemConfig: state.systemConfig,
	}),
	dispatch => ({
		getDisplayConfig: () => dispatch({ type: 'systemConfig/getDisplayConfig' }),
		updateScreenName: payload => dispatch({ type: 'systemConfig/updateScreenName', payload }),
		updateTemplateConfig: payload => dispatch({ type: 'systemConfig/updateTemplateConfig', payload }),
	})
)
class DisplayConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page2Config: {},
			page3Config: {}
		};
	}

	async componentDidMount() {
		const { getDisplayConfig } = this.props;

		const response = await getDisplayConfig();
		this.setState({
			page2Config: (response.data || [])[0] || {},
			page3Config: (response.data || [])[1] || {}
		});
	}

	submit = () => {
		const { updateScreenName, updateTemplateConfig } = this.props;
		const { page2Config } = this.state;
		updateScreenName({
			page_id: page2Config.id,
			page_name: page2Config.page_name
		});
		updateTemplateConfig({
			template_config: [{
				page_id: page2Config.id,
				model_id: page2Config.template_config[0].model_id,
				template_id: page2Config.template_config[0].template_id,
			}]
		});
	};

	updatePageConfig = (config, key, e) => {
		const { page2Config, page3Config } = this.state;
		if (config === 'page2Config') {
			this.setState({
				page2Config: {
					...page2Config,
					[key]: e.target.value
				}
			});
		} else {
			this.setState({
				page3Config: {
					...page3Config,
					[key]: e.target.value
				}
			});
		}
	};

	render() {
		const { page2Config, page3Config } = this.state;
		const page2TemplateConfig = {};
		(page2Config.template_config || []).forEach(item => {
			page2TemplateConfig[item.model_name] = item;
		});
		const page3TemplateConfig = {};
		(page3Config.template_config || []).forEach(item => {
			page3TemplateConfig[item.model_name] = item;
		});

		return (
			<div className={styles['display-config']}>
				<Card
					title={
						<div>
							<span>{formatMessage({id: 'esl.device.display.page.toggle.title'})}</span>
							<FormTip
								text={formatMessage({id: 'esl.device.display.page.toggle.tooltip'})}
							/>
						</div>
					}
					bordered={false}
					style={{ width: '100%' }}
				>
					<Row gutter={10} className={styles['m-b-15']}>
						<Col span={4} offset={8} className={styles.title}>
							{formatMessage({id: 'esl.device.display.page.toggle.page.two'})}
						</Col>
						<Col span={4} className={styles.title}>
							{formatMessage({id: 'esl.device.display.page.toggle.page.three'})}
							<FormTip
								text={formatMessage({id: 'esl.device.display.page.toggle.page.three.tooltip'})}
							/>
						</Col>
					</Row>
					<Row gutter={10} className={styles['m-b-15']}>
						<Col span={8} className={styles['page-name']}>{formatMessage({id: 'esl.device.display.page.name'})}：</Col>
						<Col span={4}>
							<Input value={page2Config.page_name} onChange={(e) => this.updatePageConfig('page2Config', 'page_name', e)} />
						</Col>
						<Col span={4}>
							<Input value={page3Config.page_name} onChange={(e) => this.updatePageConfig('page3Config', 'page_name', e)} />
						</Col>
					</Row>
					{
						(page2Config.template_config || []).map((config, index) => (
							<Row gutter={10} className={styles['m-b-15']} key={config.model_id}>
								<Col span={8} className={styles['page-name']}>{config.model_name}：</Col>
								<Col span={4}>
									<Select style={{width: '100%'}} value={config.template_id}>
										<Option value={0}>{formatMessage({id: 'esl.device.display.config.close'})}</Option>
									</Select>
								</Col>
								<Col span={4}>
									<Select style={{width: '100%'}} value={(page3TemplateConfig[config.model_name] || {}).template_id}>
										<Option value={0}>{formatMessage({id: 'esl.device.display.config.not'})}</Option>
									</Select>
								</Col>
								{
									index === 0 ?
										<Col span={4}>
											<FormTip
												text={formatMessage({id: 'esl.device.display.sl121.tooltip'})}
												style={{lineHeight: '32px'}}
											/>
										</Col> :
										null
								}
							</Row>
						))
					}
					<Row gutter={10} className={styles['m-b-15']}>
						<Col span={4} offset={8}>
							<Button type="primary" onClick={this.submit}>{formatMessage({id: 'btn.submit'})}</Button>
						</Col>
					</Row>
				</Card>
			</div>
		);
	}
}

export default DisplayConfig;
