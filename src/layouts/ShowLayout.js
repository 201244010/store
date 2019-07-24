import React from 'react';
import ShowHeader from '@/components/ShowHeader';

class ShowLayout extends React.Component {
	render() {
		return (
			<div
				style={{
					height: '1080px',
					width: '1920px',
					padding: '24px 48px 0',
					backgroundImage: 'linear-gradient(-180deg, #364366 0%, #14182E 100%)',
				}}
			>
				<ShowHeader />
			</div>
		);
	}
}
export default ShowLayout;
