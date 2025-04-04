import type {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
} from 'n8n-workflow';

import { webflowApiRequest, webflowApiRequestAllItems, wrapData } from '../../GenericFunctions';

export const properties: INodeProperties[] = [
	{
		displayName: 'Site Name or ID',
		name: 'siteId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getSites',
		},
		default: '',
		description:
			'ID of the site containing the collection. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Collection Name or ID',
		name: 'collectionId',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getCollections',
			loadOptionsDependsOn: ['siteId'],
		},
		default: '',
		description:
			'ID of the collection to retrieve items from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				returnAll: [false],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'string',
				default: '',
				description: 'Field to sort items by (e.g., "created-on" for ascending, "-created-on" for descending)',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'Filter expression to apply (format: "{field}={value}", e.g., "name=Test Item")',
				placeholder: 'name=Test Item',
			},
		],
	},
];

export const displayOptions = {
	show: {
		resource: ['item'],
		operation: ['getAll'],
	},
};

export async function execute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const collectionId = this.getNodeParameter('collectionId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

			// Create query parameters
			const qs: IDataObject = {};

			// Add sort parameter if provided
			if (additionalFields.sort) {
				qs.sort = additionalFields.sort;
			}

			// Add filter parameter if provided
			if (additionalFields.filter) {
				// Parse filter expression (format: "field=value")
				const filterExpression = additionalFields.filter as string;
				const filterParts = filterExpression.split('=');

				if (filterParts.length === 2) {
					const [field, value] = filterParts;
					qs[`filter[${field}]`] = value;
				}
			}

			// Create endpoint for getAll operation
			const endpoint = `/collections/${collectionId}/items`;

			let responseData: IDataObject[];

			if (returnAll) {
				// Get all items using pagination
				responseData = await webflowApiRequestAllItems.call(
					this,
					'GET',
					endpoint,
					{},
					qs,
				);
			} else {
				// Get limited number of items
				qs.limit = this.getNodeParameter('limit', i, 50);
				const response = await webflowApiRequest.call(this, 'GET', endpoint, {}, qs);
				responseData = response.body.items as IDataObject[];
			}

			// Process response
			const executionData = this.helpers.constructExecutionMetaData(
				wrapData(responseData),
				{ itemData: { item: i } },
			);

			returnData.push(...executionData);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message } });
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
