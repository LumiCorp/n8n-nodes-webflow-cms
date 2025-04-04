import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class WebflowApi implements ICredentialType {
	name = 'webflowApi';
	displayName = 'Webflow API';
	documentationUrl = 'https://developers.webflow.com/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'Site API Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API access token for a specific Webflow site. Generate this in Webflow Site Settings -> Site -> API Access.',
		},
		{
			displayName: 'Use Legacy API (v1)',
			name: 'useLegacyApi',
			type: 'boolean',
			default: false,
			description: 'Whether to use the legacy Webflow API (v1). By default, the newer v2 API will be used.',
		},
	];
}
