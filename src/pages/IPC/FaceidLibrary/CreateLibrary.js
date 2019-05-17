import React from 'react';
import CreateLibraryList from './CreateLibraryList';

const totalCapacity = 1000000;
const maxLength = 10;

const CreateLibrary = () => (
	<div className='this is create-library'>
		<CreateLibraryList totalCapacity={totalCapacity} maxLength={maxLength} />
	</div>
);

export default CreateLibrary;