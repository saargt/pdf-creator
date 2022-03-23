
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { PapiClient, Relation } from '@pepperi-addons/papi-sdk'

export async function install(client: Client, request: Request): Promise<any> {
    const papiClient = createPapiClient(client);

    const templatesFolderPath = "/templates/";
    await createPfsFolder(papiClient, client, templatesFolderPath);

    const ordersFolderPath = "/orders/";
    await createPfsFolder(papiClient, client, ordersFolderPath);

    return {success:true,resultObject:{}}
}

async function createPfsFolder(papiClient: PapiClient, client: Client, path: string) {
    const body = {
        Key: path,
        MIME: "pepperi/folder"
    };
    await papiClient.post(`/addons/files/${client.AddonUUID}`, body);
}

export async function uninstall(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function upgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

export async function downgrade(client: Client, request: Request): Promise<any> {
    return {success:true,resultObject:{}}
}

function createPapiClient(Client: Client)
{
	return new PapiClient({
		token: Client.OAuthAccessToken,
		baseURL: Client.BaseURL,
		addonUUID: Client.AddonUUID,
		addonSecretKey: Client.AddonSecretKey,
		actionUUID: Client.ActionUUID,
	});
}
