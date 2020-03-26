import React, {Component} from 'react';
import {Card, Row, Col, Select, Button} from 'antd';
import { formatMessage } from 'umi/locale';
import {connect} from 'dva';
import styles from './index.less';

const { Option } = Select;

@connect(
	state => ({
		systemConfig: state.systemConfig,
	}),
	dispatch => ({
		getDisplayConfig: () => dispatch({ type: 'systemConfig/getDisplayConfig' }),
		updateScreenName: payload => dispatch({ type: 'systemConfig/updateScreenName', payload }),
		updateTemplateConfig: payload => dispatch({ type: 'systemConfig/updateTemplateConfig', payload }),
		fetchScreenNameList: payload => dispatch({ type: 'template/fetchScreenNameList', payload }),
	})
)
class DisplayConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page2Config: {},
			page3Config: {},
			modelTemplateMap: {}
		};
	}

	componentDidMount() {
		this.getPageConfig();
	}

	getPageConfig = async () => {
		const { getDisplayConfig, fetchScreenNameList } = this.props;

		const response = await getDisplayConfig();
		const screenConfig = response.data.esl_switch_screen_config || [];
		this.page2Config = screenConfig.filter(item => item.screen_num === 2)[0] || {};
		this.page3Config = screenConfig.filter(item => item.screen_num === 3)[0] || {};
		this.setState({
			page2Config: JSON.parse(JSON.stringify(this.page2Config)),
			page3Config: JSON.parse(JSON.stringify(this.page3Config)),
		});
		if (screenConfig.length && screenConfig[0].template_config && screenConfig[0].template_config.length) {
			const fetchPromises = [];
			const modelTemplateMap = {};
			for (let i = 0; i < screenConfig[0].template_config.length; i++) {
				const templateConfig = screenConfig[0].template_config[i];
				const fetchPromise = fetchScreenNameList({
					model_id: templateConfig.model_id
				});
				fetchPromises.push(fetchPromise);
			}
			Promise.all(fetchPromises).then(resData => {
				for (let i = 0; i < resData.length; i++) {
					modelTemplateMap[screenConfig[0].template_config[i].model_name] = resData[i].data.template_list;
				}
				this.setState({
					modelTemplateMap
				});
			});
		}
	};

	submit = async () => {
		const { updateScreenName, updateTemplateConfig } = this.props;
		const { page2Config, page3Config } = this.state;
		updateScreenName({
			name_info: [{
				screen_id: page2Config.id,
				screen_name: formatMessage({id: page2Config.screen_name})
			}, {
				screen_id: page3Config.id,
				screen_name: formatMessage({id: page3Config.screen_name})
			}]
		});
		const updatedTemplateConfig = [];
		if (page2Config.template_config.length) {
			for (let i = 0; i < page2Config.template_config.length; i++) {
				if (this.page2Config.template_config[i].template_id !== page2Config.template_config[i].template_id) {
					updatedTemplateConfig.push({
						screen_id: page2Config.id,
						model_id: page2Config.template_config[i].model_id,
						template_id: page2Config.template_config[i].template_id,
					});
				}
				if (this.page3Config.template_config[i].template_id !== page3Config.template_config[i].template_id) {
					updatedTemplateConfig.push({
						screen_id: page3Config.id,
						model_id: page3Config.template_config[i].model_id,
						template_id: page3Config.template_config[i].template_id,
					});
				}
			}
		}
		if (updatedTemplateConfig.length) {
			updateTemplateConfig({
				template_config: updatedTemplateConfig
			}).then(() => {
				this.getPageConfig();
			});
		}
	};

	updatePageTemplateConfig = (configName, templateConfig, value) => {
		const { page2Config, page3Config } = this.state;

		if (configName === 'page2Config') {
			const newPage2Config = page2Config;
			newPage2Config.template_config.forEach(config => {
				if (config.model_id === templateConfig.model_id) {
					config.template_id = value;
				}
			});
			this.setState({
				page2Config: newPage2Config
			});
		} else {
			const newPage3Config = page3Config;
			newPage3Config.template_config.forEach(config => {
				if (config.model_id === templateConfig.model_id) {
					config.template_id = value;
				}
			});
			this.setState({
				page3Config: newPage3Config
			});
		}
	};

	render() {
		const { systemConfig: { loading } } = this.props;
		const { page2Config, page3Config, modelTemplateMap } = this.state;
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
					title={formatMessage({id: 'esl.device.display.unbind.template'})}
					bordered={false}
					style={{ width: '100%' }}
				>
					{
						(page2Config.template_config || []).map((config) => (
							<Row gutter={10} className={styles['m-b-15']} key={config.model_id}>
								<Col span={8} className={styles['page-name']}>{config.model_name}：</Col>
								<Col span={8}>
									<Select
										style={{width: '100%'}}
										value={config.template_id}
										onChange={(id) => this.updatePageTemplateConfig('page2Config', config, id)}
									>
										<Option key={0} value={0}>{formatMessage({id: 'esl.device.display.config.not'})}</Option>
										{
											modelTemplateMap[config.model_name] && modelTemplateMap[config.model_name].map(model => (
												<Option key={model.id} value={model.id}>{formatMessage({id: model.name})}</Option>
											))
										}
									</Select>
								</Col>
							</Row>
						))
					}
					<Row gutter={10} className={styles['m-b-15']}>
						<Col span={4} offset={8}>
							<Button type="primary" loading={loading} onClick={this.submit}>{formatMessage({id: 'btn.save'})}</Button>
						</Col>
					</Row>
				</Card>
			</div>
		);
	}
}

export default DisplayConfig;
