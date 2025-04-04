import type {
	IExecuteFunctions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { router } from './actions/router';
import { description as itemResourceDescription, operations as itemOperations } from './actions/Item/Item.resource';
import { description as collectionResourceDescription, operations as collectionOperations } from './actions/Collection/Collection.resource';
import * as create from './actions/Item/create.operation';
import * as update from './actions/Item/update.operation';
import * as del from './actions/Item/delete.operation';
import * as get from './actions/Item/get.operation';
import * as getAll from './actions/Item/getAll.operation';
import * as getFieldsOp from './actions/Collection/getFields.operation';
import { getSites, getCollections, getFields } from './GenericFunctions';

export class WebflowCms implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Webflow CMS',
		name: 'webflowCms',
		group: ['transform'],
		version: 1,
		description: 'Create, read, update and delete Webflow CMS collection items',
		defaults: {
			name: 'Webflow CMS',
		},
		// @ts-ignore
		inputs: ['main'],
		// @ts-ignore
		outputs: ['main'],
		credentials: [
			{
				name: 'webflowOAuth2Api',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.webflow.com/v2',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// Resources
			itemResourceDescription,
			collectionResourceDescription,
			// Operations for Item resource
			itemOperations,
			// Operations for Collection resource
			collectionOperations,

			// Create operation parameters
			...create.properties.map(property => ({
				...property,
				displayOptions: {
					show: {
						...create.displayOptions.show,
					},
				},
			})),

			// Update operation parameters
			...update.properties.map(property => ({
				...property,
				displayOptions: {
					show: {
						...update.displayOptions.show,
					},
				},
			})),

			// Delete operation parameters
			...del.properties.map(property => ({
				...property,
				displayOptions: {
					show: {
						...del.displayOptions.show,
					},
				},
			})),

			// Get operation parameters
			...get.properties.map(property => ({
				...property,
				displayOptions: {
					show: {
						...get.displayOptions.show,
					},
				},
			})),

			// Get All operation parameters
			...getAll.properties.map(property => ({
				...property,
				displayOptions: {
					show: {
						...getAll.displayOptions.show,
					},
				},
			})),

			// Get Fields operation parameters for Collection resource
			...getFieldsOp.properties.map(property => ({
				...property,
				displayOptions: {
					show: {
						...getFieldsOp.displayOptions.show,
					},
				},
			})),
		],
	};

	methods = {
		loadOptions: {
			getSites,
			getCollections,
			getFields,
		},
	};

	async execute(this: IExecuteFunctions) {
		return await router.call(this);
	}
}
