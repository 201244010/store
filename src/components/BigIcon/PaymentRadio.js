import React from 'react';
import styles from './index.less';

const PaymentRadio = ({
	backgroundImg = null,
	onChange = null,
	value = null,
	id = null,
	name = null,
}) => {
	const handleChange = () => {
		if (onChange) {
			onChange(value);
		}
	};

	const bgStyle = {
		background: `url(${backgroundImg})`,
	};

	return (
		<>
			<label className={styles['radio-label']} htmlFor={id}>
				<input
					type="radio"
					name={name}
					id={id}
					value={value}
					onChange={handleChange}
				/>
				<div className={styles['radio-bg']} style={bgStyle} />
			</label>
		</>
	);
};

export default PaymentRadio;
