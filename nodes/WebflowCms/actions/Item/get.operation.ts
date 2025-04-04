import type {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
} from 'n8n-workflow';

import { webflowApiRequest, wrapData } from '../../GenericFunctions';

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
			'ID of the collection containing the item to retrieve. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the item to retrieve',
	},
];

export const displayOptions = {
	show: {
		resource: ['item'],
		operation: ['get'],
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
			const itemId = this.getNodeParameter('itemId', i) as string;

			// Create endpoint for get operation
			const endpoint = `/collections/${collectionId}/items/${itemId}`;

			// Make API request
			const responseData = await webflowApiRequest.call(this, 'GET', endpoint);

			// Process response
			const executionData = this.helpers.constructExecutionMetaData(
				wrapData(responseData.body as IDataObject),
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
