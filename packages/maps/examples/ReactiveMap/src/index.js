import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase, SingleList, SelectedFilters } from '@appbaseio/reactivesearch';
import { ReactiveGoogleMap } from '@appbaseio/reactivemaps';

import './index.css';

const CustomPagination = (paginationProps) => {
	// console.log('PAGINATION PROPS', paginationProps);
	const pageTag = (page, selected) => (
		<div
			key={page}
			style={{
				width: 20,
				height: 20,
				backgroundColor: selected ? '#bababa' : '#fafafa',
				marginLeft: 5,
				marginRight: 5,
				textAlign: 'center',
				border: '1px solid black',
				borderRadius: 5,
				lineHeight: '16px',
				cursor: 'pointer',
			}}
			onClick={paginationProps && paginationProps.setPage
				? () => paginationProps.setPage(page - 1) : undefined}
			onKeyDown={paginationProps && paginationProps.setPage
				? () => paginationProps.setPage(page - 1) : undefined}
			role="button"
			tabIndex="-1"
		>{page}
		</div>);
	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			{pageTag(1, paginationProps.currentPage === 0)}
			{pageTag(2, paginationProps.currentPage === 1)}
			{pageTag(3, paginationProps.currentPage === 2)}
			{pageTag(4, paginationProps.currentPage === 3)}
			{pageTag(5, paginationProps.currentPage === 4)}
		</div>
	);
};

class App extends React.Component {
	constructor() {
		super();

		this.state = {};
	}

	render() {
		return (
			<ReactiveBase
				app="dealerdirectqa-rumbleon-listing"
				url="https://dealerdirectsearchservice-dq.rumbleon.com"
				// enableAppbase
			>
				{/* <div className="row">
					<SingleList
						title="Event Names"
						componentId="places"
						dataField="eventName.raw"
						size={50}
						showSearch
					/>
				</div> */}
				<div className="row">
					{/* <div className="col">
						<SingleList
							title="Places"
							componentId="places"
							dataField="place.keyword"
							size={50}
							showSearch
						/>
					</div> */}
					<div className="col">
						<SingleList
							title="Seller Names"
							componentId="places"
							dataField="sellerName.raw"
							size={50}
							URLParams
							showSearch
						/>
					</div>
					<div className="col">
						<SelectedFilters />
						<ReactiveGoogleMap
							style={{ height: 'auto' }}
							componentId="googleMap"
							dataField="coordinates"
							defaultMapStyle="Light Monochrome"
							title="Reactive Maps"
							defaultZoom={3}
							size={24}
							react={{
								and: 'places',
							}}
							onPopoverClick={item => <div>{item.place}</div>}
							showMapStyles
							pagination
							// URLParams
							renderPagination={CustomPagination}
							paginationUrlParam="page"
							defaultQuery={() => ({
								query: {
									term: {
										listingStatusId: 1,
									},
								},
							})}
							renderAllData={(
								hits: any,
								streamHits: any,
								loadMore: any,
								renderMap: any,
								renderPagination: any,
							) =>
								// console.log('HITS', hits);
								// console.log('DATA', data);
								(
									<React.Fragment>
										<div style={{ position: 'relative', height: '60vh' }}>
											{renderMap()}
										</div>
										<div style={{ width: '100%', padding: 10 }}>
											{renderPagination()}
										</div>
										<div style={{
											width: '100%',
											// height: '40%',
											display: 'flex',
											justifyContent: 'center',
											flexWrap: 'wrap',
											overflowY: 'auto',
										}}
										>
											{hits.map(item => (
												<div
													key={item.id}
													style={{
														width: '100px',
														height: '100px',
														padding: '10px',
														margin: 10,
														border: '1px solid black',
														overflow: 'hidden',
													}}
												>
													<div>{item.id}</div>
												</div>
											))}
										</div>
									</React.Fragment>
								)
							}
							renderData={result => ({
								custom: (
									<div
										style={{
											background: 'dodgerblue',
											color: '#fff',
											paddingLeft: 5,
											paddingRight: 5,
											borderRadius: 3,
											padding: 10,
										}}
									>
										<i className="fas fa-globe-europe" />
										&nbsp;{result.magnitude}
									</div>
								),
							})}
						/>
					</div>
				</div>
			</ReactiveBase>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
