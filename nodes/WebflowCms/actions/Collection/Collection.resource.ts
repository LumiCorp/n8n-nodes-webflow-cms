import type { INodeProperties } from 'n8n-workflow';

export const description: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	default: 'collection',
	required: true,
	options: [
		{
			name: 'Collection',
			value: 'collection',
			description: 'Work with Webflow CMS collections',
		},
	],
};

export const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'getFields',
	required: true,
	options: [
		{
			name: 'Get Fields',
			value: 'getFields',
			action: 'Get fields of a CMS collection',
			description: 'Retrieve all field definitions from a collection',
		},
	],
	displayOptions: {
		show: {
			resource: ['collection'],
		},
	},
};
