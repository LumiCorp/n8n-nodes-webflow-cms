import type { INodeProperties } from 'n8n-workflow';

export const description: INodeProperties = {
	displayName: 'Resource',
	name: 'resource',
	type: 'options',
	noDataExpression: true,
	default: 'item',
	required: true,
	options: [
		{
			name: 'Item',
			value: 'item',
			description: 'Work with CMS collection items',
		},
	],
};

export const operations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	default: 'create',
	required: true,
	options: [
		{
			name: 'Create',
			value: 'create',
			action: 'Create a CMS item',
			description: 'Create a new item in a collection',
		},
		{
			name: 'Delete',
			value: 'delete',
			action: 'Delete a CMS item',
			description: 'Delete an item from a collection',
		},
		{
			name: 'Get',
			value: 'get',
			action: 'Get a CMS item',
			description: 'Get a single item from a collection',
		},
		{
			name: 'Get Many',
			value: 'getAll',
			action: 'Get many CMS items',
			description: 'Get multiple items from a collection',
		},
		{
			name: 'Update',
			value: 'update',
			action: 'Update a CMS item',
			description: 'Update an item in a collection',
		},
	],
	displayOptions: {
		show: {
			resource: ['item'],
		},
	},
};
