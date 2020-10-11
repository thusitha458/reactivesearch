import React from 'react';
import ReactDOM from 'react-dom';
import { ReactiveBase, SingleList, SelectedFilters } from '@appbaseio/reactivesearch';
import { ReactiveGoogleMap, ReactiveOpenStreetMap } from '@appbaseio/reactivemaps';
import Dropdown from '@appbaseio/reactivesearch/lib/components/shared/Dropdown';

import './index.css';

const providers = [
	{
		label: 'Google Map',
		value: 'googleMap',
	},
	{
		label: 'OpenStreet Map',
		value: 'openstreetMap',
	},
];
class App extends React.Component {
	constructor() {
		super();

		this.state = {
			mapProvider: providers[0],
		};

		this.setProvider = this.setProvider.bind(this);
	}

	setProvider(mapProvider) {
		this.setState({
			mapProvider,
		});
	}

	render() {
		return (
			<ReactiveBase
				app="dealerdirectqa-rumbleon-listing"
				url="https://dealerdirectsearchservice-dq.rumbleon.com"
				// enableAppbase
			>
				<div className="row">
					<SingleList
						title="Event Names"
						componentId="places"
						dataField="eventName.raw"
						size={50}
						showSearch
					/>
				</div>
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
						<SelectedFilters />
						<ReactiveGoogleMap
							style={{ height: 'auto' }}
							componentId="googleMap"
							dataField='coordinates'
							defaultMapStyle='Light Monochrome'
							title='Reactive Maps'
							defaultZoom={3}
							size={24}
							react={{
								and: 'places',
							}}
							onPopoverClick={item => <div>{item.place}</div>}
							showMapStyles={true}
							pagination={true}
							// renderPagination={CustomPagination}
							paginationUrlParam={'page'}
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
								triggerAnalytics: any,
								data: any,
							  ) => {
								// console.log('HITS', hits);
								// console.log('DATA', data);
								return (
									<React.Fragment>
									<div style={{position: 'relative', height: '60vh'}}>
										{renderMap()}
									</div>
									{/* <div style={{ width: '100%', padding: 10 }}>
										<div style={{cursor: 'pointer'}} onClick={() => pageInfo.setPage(pageInfo.currentPage + 1)}>Next page</div>
									</div> */}
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
									}}>
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
								);
							}}
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

const CustomPagination = (paginationProps) => {
	// console.log('PAGINATION PROPS', paginationProps);
	const pageTag = (page) => <div key={page} style={{
		width: 20,
		height: 20,
		backgroundColor: '#fafafa',
		marginLeft: 5,
		marginRight: 5,
		textAlign: 'center',
		border: '1px solid black',
		borderRadius: 5,
		lineHeight: '16px',
		cursor: 'pointer',
	}} onClick={paginationProps && paginationProps.setPage ? () => paginationProps.setPage(page - 1) : undefined }>{page}</div>;
	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			{pageTag(1)}
			{pageTag(2)}
			{pageTag(3)}
			{pageTag(4)}
			{pageTag(5)}
		</div>
	);
};

ReactDOM.render(<App />, document.getElementById('root'));
