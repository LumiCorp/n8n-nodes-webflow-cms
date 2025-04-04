import type {
	IDataObject,
	INodeExecutionData,
	INodeProperties,
	IExecuteFunctions,
} from 'n8n-workflow';

import { processFieldData, webflowApiRequest, wrapData } from '../../GenericFunctions';

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
			'ID of the collection containing the item to update. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Item ID',
		name: 'itemId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the item to update',
	},
	{
		displayName: 'Publish to Live Site',
		name: 'live',
		type: 'boolean',
		required: true,
		default: false,
		description: 'Whether the updated item should be published on the live site',
	},
	{
		displayName: 'Fields',
		name: 'fieldsUi',
		placeholder: 'Add Field',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		options: [
			{
				displayName: 'Field',
				name: 'fieldValues',
				values: [
					{
						displayName: 'Field Name or ID',
						name: 'fieldId',
						type: 'options',
						typeOptions: {
							loadOptionsMethod: 'getFields',
							loadOptionsDependsOn: ['collectionId'],
						},
						default: '',
						description:
							'Field to update for the item. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
						description: 'Value to set for the field',
					},
				],
			},
		],
	},
];

export const displayOptions = {
	show: {
		resource: ['item'],
		operation: ['update'],
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
			const live = this.getNodeParameter('live', i) as boolean;
			const fieldsUi = this.getNodeParameter('fieldsUi.fieldValues', i, []) as Array<{
				fieldId: string;
				fieldValue: unknown;
			}>;

			// Process fields
			const fieldData = processFieldData(fieldsUi);

			// Construct request body
			const body: IDataObject = {
				fieldData,
			};

			// Create endpoint with live option if specified
			const endpoint = `/collections/${collectionId}/items/${itemId}${live ? '/live' : ''}`;

			// Make API request
			const responseData = await webflowApiRequest.call(this, 'PATCH', endpoint, body);

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
