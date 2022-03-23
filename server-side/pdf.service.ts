import { PapiClient, InstalledAddon } from '@pepperi-addons/papi-sdk'
import { Client, Request } from '@pepperi-addons/debug-server';

export class PdfService {

    papiClient: PapiClient

    constructor(private client: Client, private request: Request) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.AddonUUID
        });
    }

    createPdf() {
        console.log("doesn't really do anything....");
        return {Result: "Great success!"};
    }
    
    // For page block template
    upsertRelation(relation): Promise<any> {
        return this.papiClient.post('/addons/data/relations', relation);
    }

    getAddons(): Promise<InstalledAddon[]> {
        return this.papiClient.addons.installedAddons.find({});
    }
}
