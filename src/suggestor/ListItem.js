import React, { PureComponent } from 'react';
import MarkItem from './MarkItem';

class ListItem extends PureComponent {
	render() {
		let { item, onItemClick, onItemMouseEnter, index, overItem, search } = this.props;
		return (
			<li value={item.value} onClick={() => onItemClick(item.value)} onMouseEnter={() => onItemMouseEnter(index, item.value)} 
				style={{ backgroundColor: overItem && '#f5f5f5' }}>
				<MarkItem {...{ item:item, search }} />
			</li>
		);
	}
}
ListItem.propTypes = {
	item: React.PropTypes.shape({
		value: React.PropTypes.string.isRequired,
		searchValue: React.PropTypes.string.isRequired
	}).isRequired,
	index: React.PropTypes.number.isRequired,
	overItem: React.PropTypes.bool.isRequired,
	onItemClick: React.PropTypes.func.isRequired,
	onItemMouseEnter: React.PropTypes.func.isRequired,
	search: React.PropTypes.string.isRequired
};

export default ListItem;