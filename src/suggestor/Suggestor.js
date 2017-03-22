import React, { PureComponent } from 'react';
import { EMPTY_STR, KEY_CODES } from '../utils/values';
import { SPIN_STYLES, X_STYLES } from './styles';
import withClickOut from '../utils/withClickOut';
import List from './List';
import { remove } from 'diacritics';

const getSearchValue = (value) => remove(value.toLowerCase());
const getSearchList = (list) => (
	list.map(item => ({
		value: item,
		searchValue: getSearchValue(item)
	}))
);

export class Suggestor extends PureComponent {
	constructor(props){
		super(props);
		this._bind('handleClick', 'handleChange', 'remove', 'handleKeyDown', 'handleItemClick', 'handleItemMouseEnter', 'handleClickOut', 'focus');

		var searchList = getSearchList(props.list);
		this.state = {
			value: props.value,
			searchValue: getSearchValue(props.value),
			searchList,
			filtered: searchList,
			open: false,
			index: 0
		};
	}
	_bind(...methods) {
		methods.forEach(method => this[method] = this[method].bind(this));
	}
	handleClickOut() {
		this.handleClose();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.list) {
			this.setState({ searchList: getSearchList(nextProps.list) });
		}
		if (nextProps.value !== this.state.value) {
			this.setState({
				value: nextProps.value,
				searchValue: getSearchValue(nextProps.value)
			});
		}
	}
	handleClose() {
		this.setState({ open: false, filtered: this.state.searchList, index: 0 });
	}
	toggleList() {
		if (this.state.open) {
			this.handleClose();
		}
		else {
			this.setState({
				open: true
			});
		}
	}
	handleClick() {
		if (this.props.openOnClick) {
			this.toggleList();
		}
	}
	handleKeyDown(e) {
		this.props.onKey(e);
		if (!this.props.useKeys) {
			return;
		}
		let { open, index, filtered, value } = this.state;

		switch (e.keyCode) {
			case KEY_CODES.TAB:
				if (this.props.selectOnTab && open && filtered[index]) {
					this.changeValue(filtered[index], true);
				}
				this.handleClose();
				return;
			case KEY_CODES.ENTER:
				this.toggleList();
				if (open && filtered[index]) {
					this.changeValue(filtered[index], true);
				} else {
					this.props.onSelect(value);
				}
				break;
			case KEY_CODES.ESCAPE:
				this.handleClose();
				if (!open) {
					this.changeValue(EMPTY_STR);
				}
				break;
			case KEY_CODES.DOWN: {
				let next = (index + open) % filtered.length;
				this.setState({ open:true, index: next });
				break;
			}
			case KEY_CODES.UP: {
				let prev = (index || filtered.length) - 1;
				this.setState({ open: true, index: prev });
				break;
			}
			default:
				return;
		}

		e.preventDefault();
	}
	handleItemClick(value) {
		this.changeValue(value, true);
		if(!this.props.openOnClick) {
			this.toggleList();
		}
	}
	handleItemMouseEnter(index) {
		this.setState({ index });
	}
	handleChange(e) {
		e.stopPropagation();
		let value = e.target.value;
		let searchValue = getSearchValue(value);
		let suggest = searchValue.length >= this.props.suggestOn;
		let filtered = this.filter(searchValue);
		let nextState = { filtered };
		if(!filtered.length || !suggest) {
			this.handleClose();
		} else{
			nextState.open = true;
		}
		this.setState(nextState);
		this.changeValue(value);
	}
	remove() {
		this.changeValue(EMPTY_STR, true);
	}
	changeValue(value, select=false) {
		this.setState({
			value,
			searchValue: getSearchValue(value)
		}, () => {
			this.props.onChange(value);
			if(select) {
				this.props.onSelect(value);
			}
		});
	}
	filter(searchValue) {
		return this.state.searchList.filter(item => item.searchValue.indexOf(searchValue) !== -1);
	}
	focus() {
		this.refs.input.focus();
	}
	render() {
		let { className, style, placeholder, arrow, close, tooltip, required } = this.props;
		let { open, value, index, filtered } = this.state;

		return (
			<div className={className} style={style} onClick={this.handleClick} onKeyDown={this.handleKeyDown} ref={this.props.reference} >
				<input type="text" className="form-control" onChange={this.handleChange} value={value} ref="input" placeholder={placeholder} title={tooltip} required={required} />
				{ arrow && <span className="glyphicon glyphicon-triangle-bottom" style={SPIN_STYLES} /> }
				{ close && value && <span className="glyphicon glyphicon-remove" style={X_STYLES} onClick={this.remove}/> }
				<List {...{ list: filtered, index, open, value }} onItemClick={this.handleItemClick} onItemMouseEnter={this.handleItemMouseEnter} />
			</div>
		);
	}
}

Suggestor.propTypes = {
	list: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
	reference: React.PropTypes.func,
	onChange: React.PropTypes.func,
	onSelect: React.PropTypes.func,
	onKey: React.PropTypes.func,
	value: React.PropTypes.string,
	openOnClick: React.PropTypes.bool,
	selectOnTab: React.PropTypes.bool,
	placeholder: React.PropTypes.string,
	tooltip: React.PropTypes.string,
	className: React.PropTypes.string,
	suggestOn: React.PropTypes.number,
	style: React.PropTypes.object,
	required: React.PropTypes.bool,
	useKeys: React.PropTypes.bool,
	arrow: React.PropTypes.bool,
	close: React.PropTypes.bool
};

const nop = _ => _;

Suggestor.defaultProps = {
	className: 'input-group',
	onSelect: nop,
	onChange: nop,
	onKey: nop,
	value: EMPTY_STR,
	openOnClick: true,
	selectOnTab: false,
	suggestOn: 1,
	required: false,
	useKeys: true,
	arrow: true,
	close: true
};

export const SSuggestor = withClickOut(Suggestor);

export default SSuggestor;