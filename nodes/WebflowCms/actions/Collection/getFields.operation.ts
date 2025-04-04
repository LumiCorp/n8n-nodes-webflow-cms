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
			'ID of the collection to get fields from. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code-examples/expressions/">expression</a>.',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		options: [
			{
				displayName: 'Include System Fields',
				name: 'includeSystemFields',
				type: 'boolean',
				default: false,
				description: 'Whether to include system fields like _id, _archived, etc',
			},
			{
				displayName: 'Include Field Metadata',
				name: 'includeMetadata',
				type: 'boolean',
				default: true,
				description: 'Whether to include additional field metadata like type, validations, etc',
			},
		],
	},
];

export const displayOptions = {
	show: {
		resource: ['collection'],
		operation: ['getFields'],
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
			const options = this.getNodeParameter('options', i, {}) as IDataObject;
			const includeSystemFields = options.includeSystemFields as boolean;
			const includeMetadata = options.includeMetadata !== false; // Default to true

			// Get collection schema
			const endpoint = `/collections/${collectionId}`;
			const response = await webflowApiRequest.call(this, 'GET', endpoint);

			if (!response.body || !response.body.fields || !Array.isArray(response.body.fields)) {
				throw new Error('Invalid response format or collection has no fields');
			}

			// Process fields based on options
			const fields = response.body.fields as IDataObject[];
			let processedFields: IDataObject[] = [];

			for (const field of fields) {
				// Filter system fields unless specifically requested
				if (!includeSystemFields) {
					const systemFields = ['_archived', '_draft', '_cid', '_id'];
					if (systemFields.includes(field.slug as string)) {
						continue;
					}
				}

				// Create field data with appropriate level of detail
				let fieldData: IDataObject = {};

				if (includeMetadata) {
					// Include all field data
					fieldData = { ...field };
				} else {
					// Include only basic information
					fieldData = {
						name: field.displayName || field.name,
						slug: field.slug,
						type: field.type,
						required: !!field.required,
					};
				}

				processedFields.push(fieldData);
			}

			// Add collection metadata to output
			const output = {
				collectionId,
				collectionName: response.body.displayName || response.body.name,
				totalFields: processedFields.length,
				fields: processedFields,
			};

			// Process response
			const executionData = this.helpers.constructExecutionMetaData(
				wrapData(output as IDataObject),
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
