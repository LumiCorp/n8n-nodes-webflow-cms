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
			'ID of the site containing the collection whose items to add to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
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
			'ID of the collection to add an item to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Publish to Live Site',
		name: 'live',
		type: 'boolean',
		required: true,
		default: false,
		description: 'Whether the item should be published on the live site',
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
							'Field to set for the item to create. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
					},
					{
						displayName: 'Field Value',
						name: 'fieldValue',
						type: 'string',
						default: '',
						description: 'Value to set for the item to create',
					},
				],
			},
		],
	},
];

export const displayOptions = {
	show: {
		resource: ['item'],
		operation: ['create'],
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
			const fieldsUi = this.getNodeParameter('fieldsUi.fieldValues', i, []) as Array<{
				fieldId: string;
				fieldValue: unknown;
			}>;
			const live = this.getNodeParameter('live', i) as boolean;

			// Process fields
			const fieldData = processFieldData(fieldsUi);

			// Validate required fields
			if (!fieldData.name) {
				throw new Error('A "name" field is required to create a Webflow CMS item');
			}

			// Construct request body
			const body: IDataObject = {
				fieldData,
			};

			// Create endpoint with live option if specified
			const endpoint = `/collections/${collectionId}/items${live ? '/live' : ''}`;

			// Make API request
			const responseData = await webflowApiRequest.call(this, 'POST', endpoint, body);

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
