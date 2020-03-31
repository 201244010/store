import React, {Component} from 'react';
import {Card, Row, Col, Select, Button} from 'antd';
import {connect} from 'dva';
import { formatMessage } from 'umi/locale';
import formatedMessage from '@/constants/templateNames';
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
		fetchCustomTemplateConfig: payload => dispatch({ type: 'template/fetchCustomTemplateConfig', payload }),
		updateCustomTemplateConfig: payload => dispatch({ type: 'template/updateCustomTemplateConfig', payload }),
	})
)
class DisplayConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			templateConfig: [],
			modelTemplateMap: {}
		};
	}

	componentDidMount() {

		this.getPageConfig();
	}

	getPageConfig = async () => {
		const { fetchCustomTemplateConfig, fetchScreenNameList } = this.props;

		const response = await fetchCustomTemplateConfig();
		const templateConfig = response.data.custom_tmpl_config || [];
		templateConfig.forEach(config => config.template_id = 0);
		this.setState({
			templateConfig: JSON.parse(JSON.stringify(templateConfig)),
		});
		if (templateConfig.length) {
			const fetchPromises = [];
			const modelTemplateMap = {};
			for (let i = 0; i < templateConfig.length; i++) {
				const fetchPromise = fetchScreenNameList({
					model_id: templateConfig[i].model_id
				});
				fetchPromises.push(fetchPromise);
			}
			Promise.all(fetchPromises).then(resData => {
				for (let i = 0; i < resData.length; i++) {
					modelTemplateMap[templateConfig[i].model_name] = resData[i].data.template_list;
				}
				this.setState({
					modelTemplateMap
				});
			});
		}
	};

	submit = async () => {
		const { updateCustomTemplateConfig } = this.props;
		const { templateConfig } = this.state;

		updateCustomTemplateConfig({
			config: templateConfig
		});
	};

	updateTemplateConfig = (matchConfig, value) => {
		const { templateConfig } = this.state;

		templateConfig.forEach(config => {
			if (config.model_id === matchConfig.model_id) {
				config.template_id = value;
			}
		});
		this.setState({
			templateConfig
		});
	};

	render() {
		const { systemConfig: { loading } } = this.props;
		const { templateConfig, modelTemplateMap } = this.state;

		return (
			<div className={styles['display-config']}>
				<Card
					title={formatMessage({id: 'esl.device.display.unbind.template'})}
					bordered={false}
					style={{ width: '100%' }}
				>
					{
						(templateConfig || []).map((config) => (
							<Row gutter={10} className={styles['m-b-15']} key={config.model_id}>
								<Col span={8} className={styles['page-name']}>{config.model_name}：</Col>
								<Col span={8}>
									<Select
										style={{width: '100%'}}
										value={config.template_id}
										onChange={(id) => this.updateTemplateConfig(config, id)}
									>
										<Option key={0} value={0}>{formatMessage({id: 'esl.device.display.default.template'})}</Option>
										{
											modelTemplateMap[config.model_name] && modelTemplateMap[config.model_name].map(model => (
												<Option key={model.id} value={model.id}>{formatedMessage(model.name)}</Option>
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
