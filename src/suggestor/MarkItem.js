import React from 'react';

const MarkItem = ({ item, search }) => {
	if (!search) {
		return <a>{ item.value }</a>;
	}

	let index = item.searchValue.indexOf(search);
	if (index === -1) {
		return <a>{ item.value }</a>;	
	}

	let searchLength = search.length;

	return (
		<a>
			<span>
				{ item.value.substr(0, index) }
				<strong>{ item.value.substr(index, searchLength) }</strong>
				{ item.value.substr(index+searchLength, item.length) }
			</span>
		</a>
	);
};
MarkItem.propTypes = {
	item: React.PropTypes.shape({
		value: React.PropTypes.string.isRequired,
		searchValue: React.PropTypes.string.isRequired
	}).isRequired,
	search: React.PropTypes.string.isRequired
};

export default MarkItem;