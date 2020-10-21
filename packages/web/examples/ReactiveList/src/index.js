/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { ReactiveBase, ReactiveList, ReactiveComponent } from '@appbaseio/reactivesearch';

import './index.css';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = { _isMounted: false };
	}

	componentDidMount() {
		// eslint-disable-next-line react/no-did-mount-set-state
		this.setState({ _isMounted: true });
	}

	render() {
		return (
			<ReactiveBase
				app="dealerdirectqa-rumbleon-listing"
				url="https://dealerdirectsearchservice-dq.rumbleon.com"
				// app="good-books-ds"
				// url="https://a03a1cb71321:75b6603d-9456-4a5a-af6b-a487b309eb61@arc-cluster-appbase-demo-6pjy6z.searchbase.io"
				// enableAppbaseWx
			>
				<div className="row">
					<div className="col">
						{/* <MultiDropdownList
							title="MultiDropdownList"
							componentId="BookSensor"
							dataField="sellerName.raw"
							size={100}
							URLParams
						/> */}
						<ReactiveComponent
							componentId="BookSensor"
							title="MultiDropdownList"
							URLParams
							defaultQuery={() => ({
								aggs: {
									sellerNames: {
										terms: {
											field: 'sellerName.raw',
											size: 10000,
										},
									},
								},
							})}
							customQuery={this.state._isMounted ? undefined : () => ({
								query: {
									terms: {
										'sellerName.raw': ['Administration'],
									},
								},
							})}
							render={({ aggregations, setQuery, value }) =>
								(<SellerWrapper aggregations={aggregations} setQuery={setQuery} value={value} />)}
						/>
					</div>

					<div className="col">
						<ReactiveList
							componentId="SearchResult"
							dataField="outrightPrice"
							className="result-list-container"
							size={5}
							renderItem={this.booksReactiveList}
							pagination
							URLParams
							react={{
								and: ['BookSensor'],
							}}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}

	booksReactiveList(data) {
		// return (<div>Hello</div>);
		return (
			<div className="flex book-content" key={data.id}>
				<img src={data.mainImage} alt="Book Cover" className="book-image" />
				<div className="flex column justify-center" style={{ marginLeft: 20 }}>
					<div className="book-header">{data.description}</div>
					<div className="flex column justify-space-between">
						<div>
							<div>
								by <span className="authors-list">{data.sellerName}</span>
							</div>
						</div>
						<span className="pub-year">Pub {data.year}</span>
					</div>
				</div>
			</div>
		);
	}
}

// eslint-disable-next-line react/prop-types
const SellerWrapper = ({ aggregations, setQuery, value }) => {
	React.useEffect(() => {
		// eslint-disable-next-line react/prop-types
		if (value && value.length > 0) {
			setQuery({
				query: {
					query: { terms: { 'sellerName.raw': value } },
				},
				value,
			});
		}
	}, []);

	let sellerNames = [];

	if (
	// 	// checking for when component gets the aggregation results
		aggregations
		&& aggregations.sellerNames
		&& aggregations.sellerNames.buckets.length
	) {
		sellerNames = aggregations.sellerNames.buckets.map(seller => seller.key);
	}

	const handleClick = (seller) => {
		let newValue = null;
		if ((value || []).includes(seller)) {
			newValue = [...(value || []).filter(s => seller !== s)];
		} else {
			newValue = [...(value || []), seller];
		}
		setQuery({
			query: newValue && newValue.length > 0 ? {
				query: { terms: { 'sellerName.raw': newValue } },
			} : null,
			value: newValue,
		});
	};

	return (
		<div>
			{sellerNames
				.map(seller => (<SellerTag
					seller={seller}
					selected={!!(value && value.length > 0 && value.includes(seller))}
					onClick={handleClick}
				/>),
				)}
		</div>
	);
};

const SellerTag = ({ seller, selected, onClick }) => (
	<div
		key={seller}
		style={{
			backgroundColor: selected ? 'black' : 'white',
			color: selected ? 'white' : 'black',
			cursor: 'pointer',
		}}
		onClick={() => onClick(seller)}
		onKeyDown={() => onClick(seller)}
		role="button"
		tabIndex="-1"
	>
		{seller}
	</div>
);

ReactDOM.render(<Main />, document.getElementById('root'));
