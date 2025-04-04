import type {
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
	IDataObject,
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
			'ID of the collection containing the item to delete. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the item to delete',
	},
];

export const displayOptions = {
	show: {
		resource: ['item'],
		operation: ['delete'],
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

			// Create endpoint for delete operation
			const endpoint = `/collections/${collectionId}/items/${itemId}`;

			// Make API request
			const responseData = await webflowApiRequest.call(this, 'DELETE', endpoint);

			// Process response
			const responseBody: IDataObject = {
				success: true,
				itemId,
				collectionId,
				deleted: true,
				...responseData.body,
			};

			const executionData = this.helpers.constructExecutionMetaData(
				wrapData(responseBody),
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
