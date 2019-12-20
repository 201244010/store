import  React  from 'react';
import { Button } from 'antd';
import { connect } from 'dva';


@connect(
	null,
	dispatch => ({
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class OrgDetail extends React.Component {

	render() {
		const { goToPath } = this.props;
		return(
			<div>
				hello detail
				<Button onClick={() => goToPath('editDetail',{
					action : 'edit',
					orgId: 11,
				})}
				>
					修改
				</Button>
				<Button onClick={() => goToPath('newSubOrganization',{
					action: 'create',
					orgPid: 12,
				})}
				>
					新增下级组织
				</Button>
			</div>
		);
	}
}

export default OrgDetail;