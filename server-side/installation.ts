
/*
The return object format MUST contain the field 'success':
{success:true}

If the result of your code is 'false' then return:
{success:false, erroeMessage:{the reason why it is false}}
The error Message is importent! it will be written in the audit log and help the user to understand what happen
*/

import { Client, Request } from '@pepperi-addons/debug-server'
import { PapiClient, Relation } from '@pepperi-addons/papi-sdk'
import { DEFAULT_TEMPLATE_PATH, ORDERS_FOLDER, TEMPLATES_FOLDER } from './constants';

export async function install(client: Client, request: Request): Promise<any> {
    const papiClient = createPapiClient(client);

    const templatesRes = await createPfsFolder(papiClient, client, TEMPLATES_FOLDER);

    const ordersFolderPath = "/orders/";
    const ordersRes = await createPfsFolder(papiClient, client, ORDERS_FOLDER);

    await uploadDefaultTemplate(papiClient, client);

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

async function uploadDefaultTemplate(papiClient: PapiClient, client: Client) {
    const body = {
        Key: DEFAULT_TEMPLATE_PATH,
        MIME: "file/html",
        URI: `data:file/html;base64,PGh0bWw+DQoNCjxib2R5Pg0KICAgIDxkaXYgY2xhc3M9Im1haW4tbG9nbyI+DQogICAgICAgIDxpbWcgX25nY29udGVudC1jMT0iIiBhbHQ9IiIgY2xhc3M9ImxvZ28iDQogICAgICAgICAgICBzcmM9Imh0dHBzOi8vc2V0dGluZ3MucGVwcGVyaS5jb20vSGFuZGxlcnMvUmVzaXplSW1hZ2UuYXNoeD9pbWdQYXRoPVdybnR5SW1hZ2VzL0Rpc3RyaWJ1dG9ycy83ODE2Mzg4LmpwZyIgLz4NCiAgICA8L2Rpdj4NCiAgICA8ZGl2IGNsYXNzPSJ0YWJsZS1kZWxpbWVyIj4NCiAgICAgICAgPHRhYmxlPg0KICAgICAgICAgICAgPHRyIGNsYXNzPSdiZy1ncmF5Jz4NCiAgICAgICAgICAgICAgICA8dGggY29sc3Bhbj0iMiI+PHN0cm9uZz5PcmRlciBDb25maXJtYXRpb248L3N0cm9uZz48L3RoPg0KICAgICAgICAgICAgPC90cj4NCiAgICAgICAgPC90YWJsZT4NCiAgICA8L2Rpdj4NCiAgICA8ZGl2IGNsYXNzPSJtZy10LXNtIj4NCiAgICAgICAgPHRhYmxlIGNsYXNzPSJnZW5lcmFsLWluZm8tdGFibGUiPg0KICAgICAgICAgICAgPHRyPg0KICAgICAgICAgICAgICAgIDx0ZD5UcmFuc2FjdGlvbiBUeXBlPC90ZD4NCiAgICAgICAgICAgICAgICA8dGQ+e3tUeXBlfX08L3RkPg0KICAgICAgICAgICAgICAgIDx0ZD5TdGF0dXM8L3RkPg0KICAgICAgICAgICAgICAgIDx0ZD57e1N0YXR1c05hbWV9fTwvdGQ+DQogICAgICAgICAgICA8L3RyPg0KDQogICAgICAgIDwvdGFibGU+DQogICAgPC9kaXY+DQogICAgPGRpdiBjbGFzcz0idGFibGUtZGVsaW1lciBtZy10LXNtIj4NCiAgICAgICAgPHRhYmxlPg0KICAgICAgICAgICAgPHRyIGNsYXNzPSdiZy1ncmF5Jz4NCiAgICAgICAgICAgICAgICA8dGggY29sc3Bhbj0iMiI+PHN0cm9uZz5HZW5lcmFsIEluZm9ybWF0aW9uPC9zdHJvbmc+PC90aD4NCiAgICAgICAgICAgIDwvdHI+DQogICAgICAgIDwvdGFibGU+DQogICAgPC9kaXY+DQogICAgPGRpdiBjbGFzcz0ndGFibGUtbGluZXMgbWctdC1tZCc+DQogICAgICAgIDx0YWJsZT4NCiAgICAgICAgICAgIDx0aGVhZD4NCiAgICAgICAgICAgICAgICA8dHIgY2xhc3M9J2JnLWdyYXknPg0KICAgICAgICAgICAgICAgICAgICA8dGg+PHN0cm9uZz5JdGVtIENvZGU8L3N0cm9uZz48L3RoPg0KICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9J3RhYmxlLWNvbC1sZyc+PHN0cm9uZz5JdGVtIE5hbWU8L3N0cm9uZz48L3RoPg0KICAgICAgICAgICAgICAgICAgICA8dGg+PHN0cm9uZz5RdWFudGl0eTxicj4gT3JkZXJlZDwvc3Ryb25nPjwvdGg+DQogICAgICAgICAgICAgICAgICAgIDx0aD48c3Ryb25nPlRvdGFsIFByaWNlPC9zdHJvbmc+PC90aD4NCiAgICAgICAgICAgICAgICA8L3RyPg0KICAgICAgICAgICAgPC90aGVhZD4NCiAgICAgICAgICAgIDx0Ym9keT4NCiAgICAgICAgICAgICAgICB7eyNUcmFuc2FjdGlvbkxpbmVzLkRhdGF9fQ0KICAgICAgICAgICAgICAgIDx0cj4NCiAgICAgICAgICAgICAgICA8dGQ+e3tJdGVtRXh0ZXJuYWxJRH19PC90ZD4NCiAgICAgICAgICAgICAgICA8dGQgY2xhc3M9J3RhYmxlLWNvbC1sZyc+e3tJdGVtTmFtZX19PC90ZD4NCiAgICAgICAgICAgICAgICA8dGQ+e3tVbml0c1F1YW50aXR5fX0gdGV4dDwvdGQ+DQogICAgICAgICAgICAgICAgPHRkPnt7VG90YWxVbml0c1ByaWNlQWZ0ZXJEaXNjb3VudH19JDwvdGQ+DQogICAgICAgICAgICAgICAgPC90cj4NCiAgICAgICAgICAgICAgICB7ey9UcmFuc2FjdGlvbkxpbmVzLkRhdGF9fQ0KICAgICAgICAgICAgPC90Ym9keT4NCiAgICAgICAgPC90YWJsZT4NCiAgICA8L2Rpdj4NCiAgICA8ZGl2IGNsYXNzPSJtZy10LXNtIj4NCiAgICAgICAgPHRhYmxlIGNsYXNzPSJnZW5lcmFsLWluZm8tdGFibGUiPg0KICAgICAgICAgICAgPHRyPg0KICAgICAgICAgICAgICAgIDx0ZD5TdWItVG90YWw8L3RkPg0KICAgICAgICAgICAgICAgIDx0ZD57e1N1YlRvdGFsQWZ0ZXJJdGVtc0Rpc2NvdW50fX0kPC90ZD4NCiAgICAgICAgICAgICAgICA8dGQ+PC90ZD4NCiAgICAgICAgICAgICAgICA8dGQ+PC90ZD4NCiAgICAgICAgICAgICAgICA8dGQ+PC90ZD4NCiAgICAgICAgICAgIDwvdHI+DQogICAgICAgICAgICA8dHI+DQogICAgICAgICAgICAgICAgPHRkPk9yZGVyIFRvdGFsPC90ZD4NCiAgICAgICAgICAgICAgICA8dGQ+e3tHcmFuZFRvdGFsfX0kPC90ZD4NCiAgICAgICAgICAgICAgICA8dGQ+PC90ZD4NCiAgICAgICAgICAgICAgICA8dGQ+PC90ZD4NCiAgICAgICAgICAgICAgICA8dGQ+PC90ZD4NCiAgICAgICAgICAgIDwvdHI+DQogICAgICAgIDwvdGFibGU+DQogICAgPC9kaXY+DQo8L2JvZHk+DQo8c3R5bGU+DQogICAgYSwNCiAgICBhYmJyLA0KICAgIGFjcm9ueW0sDQogICAgYWRkcmVzcywNCiAgICBhcHBsZXQsDQogICAgYXJ0aWNsZSwNCiAgICBhc2lkZSwNCiAgICBhdWRpbywNCiAgICBiLA0KICAgIGJpZywNCiAgICBibG9ja3F1b3RlLA0KICAgIGJvZHksDQogICAgY2FudmFzLA0KICAgIGNhcHRpb24sDQogICAgY2VudGVyLA0KICAgIGNpdGUsDQogICAgY29kZSwNCiAgICBkZCwNCiAgICBkZWwsDQogICAgZGV0YWlscywNCiAgICBkZm4sDQogICAgZGl2LA0KICAgIGRsLA0KICAgIGR0LA0KICAgIGVtLA0KICAgIGVtYmVkLA0KICAgIGZpZWxkc2V0LA0KICAgIGZpZ2NhcHRpb24sDQogICAgZmlndXJlLA0KICAgIGZvb3RlciwNCiAgICBmb3JtLA0KICAgIGgxLA0KICAgIGgyLA0KICAgIGgzLA0KICAgIGg0LA0KICAgIGg1LA0KICAgIGg2LA0KICAgIGhlYWRlciwNCiAgICBoZ3JvdXAsDQogICAgaHRtbCwNCiAgICBpLA0KICAgIGlmcmFtZSwNCiAgICBpbWcsDQogICAgaW5zLA0KICAgIGtiZCwNCiAgICBsYWJlbCwNCiAgICBsZWdlbmQsDQogICAgbGksDQogICAgbWFyaywNCiAgICBtZW51LA0KICAgIG5hdiwNCiAgICBvYmplY3QsDQogICAgb2wsDQogICAgb3V0cHV0LA0KICAgIHAsDQogICAgcHJlLA0KICAgIHEsDQogICAgcnVieSwNCiAgICBzLA0KICAgIHNhbXAsDQogICAgc2VjdGlvbiwNCiAgICBzbWFsbCwNCiAgICBzcGFuLA0KICAgIHN0cmlrZSwNCiAgICBzdHJvbmcsDQogICAgc3ViLA0KICAgIHN1bW1hcnksDQogICAgc3VwLA0KICAgIHRhYmxlLA0KICAgIHRib2R5LA0KICAgIHRkLA0KICAgIHRmb290LA0KICAgIHRoLA0KICAgIHRoZWFkLA0KICAgIHRpbWUsDQogICAgdHIsDQogICAgdHQsDQogICAgdSwNCiAgICB1bCwNCiAgICB2YXIsDQogICAgdmlkZW8gew0KICAgICAgICBtYXJnaW46IDA7DQogICAgICAgIHBhZGRpbmc6IDA7DQogICAgICAgIGJvcmRlcjogMDsNCiAgICAgICAgZm9udC1zaXplOiAxMDAlOw0KICAgICAgICBmb250OiBpbmhlcml0Ow0KICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogYmFzZWxpbmU7DQogICAgICAgIC13ZWJraXQtcHJpbnQtY29sb3ItYWRqdXN0OiBleGFjdDsNCiAgICB9DQoNCiAgICBhcnRpY2xlLA0KICAgIGFzaWRlLA0KICAgIGRldGFpbHMsDQogICAgZmlnY2FwdGlvbiwNCiAgICBmaWd1cmUsDQogICAgZm9vdGVyLA0KICAgIGhlYWRlciwNCiAgICBoZ3JvdXAsDQogICAgbWVudSwNCiAgICBuYXYsDQogICAgc2VjdGlvbiB7DQogICAgICAgIGRpc3BsYXk6IGJsb2NrOw0KICAgIH0NCg0KICAgIGJvZHkgew0KICAgICAgICBsaW5lLWhlaWdodDogMTsNCiAgICAgICAgZm9udC1mYW1pbHk6ICJJbnRlciIsICJJbnRlciB2YXIiLCAtYXBwbGUtc3lzdGVtLCBzeXN0ZW0tdWksIEJsaW5rTWFjU3lzdGVtRm9udCwgIlNlZ29lIFVJIiwgUm9ib3RvLCBBcmlhbCwgc2Fucy1zZXJpZjsNCiAgICAgICAgcGFkZGluZzogMCAycmVtOw0KICAgIH0NCg0KICAgIG9sLA0KICAgIHVsIHsNCiAgICAgICAgbGlzdC1zdHlsZTogbm9uZTsNCiAgICB9DQoNCiAgICBibG9ja3F1b3RlLA0KICAgIHEgew0KICAgICAgICBxdW90ZXM6IG5vbmU7DQogICAgfQ0KDQogICAgYmxvY2txdW90ZTphZnRlciwNCiAgICBibG9ja3F1b3RlOmJlZm9yZSwNCiAgICBxOmFmdGVyLA0KICAgIHE6YmVmb3JlIHsNCiAgICAgICAgY29udGVudDogIiI7DQogICAgICAgIGNvbnRlbnQ6IG5vbmU7DQogICAgfQ0KDQogICAgdGFibGUgew0KICAgICAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlOw0KICAgICAgICBib3JkZXItc3BhY2luZzogMDsNCiAgICAgICAgcGFnZS1icmVhay1pbnNpZGU6IGF1dG87DQogICAgfQ0KDQogICAgdGhlYWQgew0KICAgICAgICBkaXNwbGF5OiB0YWJsZS1oZWFkZXItZ3JvdXA7DQogICAgfQ0KDQogICAgdGggew0KICAgICAgICBwYWRkaW5nLXRvcDogNTBweDsNCiAgICB9DQoNCiAgICB0ciB7DQogICAgICAgIHBhZ2UtYnJlYWstaW5zaWRlOiBhdm9pZDsNCiAgICAgICAgcGFnZS1icmVhay1hZnRlcjogYXV0bzsNCiAgICB9DQoNCiAgICB0cjpsYXN0LWNoaWxkIHsNCiAgICAgICAgcGFkZGluZy1ib3R0b206IDIwMHB4Ow0KICAgIH0NCg0KICAgIC5wYWdlYnJlYWsgew0KICAgICAgICBwYWdlLWJyZWFrLWFmdGVyOiBhbHdheXM7DQogICAgICAgIHBhZ2UtYnJlYWstaW5zaWRlOiBhdm9pZDsNCiAgICB9DQoNCiAgICAuYmctZ3JheSB7DQogICAgICAgIGJhY2tncm91bmQtY29sb3I6ICNmNGY0ZjQ7DQogICAgfQ0KDQogICAgLm1haW4tbG9nbyB7DQogICAgICAgIGRpc3BsYXk6IC13ZWJraXQtYm94Ow0KICAgICAgICBkaXNwbGF5OiAtbXMtZmxleGJveDsNCiAgICAgICAgZGlzcGxheTogZmxleDsNCiAgICAgICAgLXdlYmtpdC1ib3gtcGFjazogY2VudGVyOw0KICAgICAgICAtbXMtZmxleC1wYWNrOiBjZW50ZXI7DQogICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyOw0KICAgICAgICAtd2Via2l0LWJveC1hbGlnbjogY2VudGVyOw0KICAgICAgICAtbXMtZmxleC1hbGlnbjogY2VudGVyOw0KICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyOw0KICAgICAgICBoZWlnaHQ6IDEwcmVtOw0KICAgICAgICBtYXJnaW46IDJyZW0gMCAxcmVtIDA7DQogICAgfQ0KDQogICAgLm1haW4tbG9nbyBpbWcgew0KICAgICAgICBoZWlnaHQ6IDEwMCU7DQogICAgfQ0KDQogICAgLnRhYmxlLWRlbGltZXIgew0KICAgICAgICBtYXJnaW4tdG9wOiAycmVtOw0KICAgICAgICBkaXNwbGF5OiAtd2Via2l0LWJveDsNCiAgICAgICAgZGlzcGxheTogLW1zLWZsZXhib3g7DQogICAgICAgIC13ZWJraXQtYm94LXBhY2s6IGxlZnQ7DQogICAgICAgIC1tcy1mbGV4LXBhY2s6IGxlZnQ7DQogICAgICAgIGp1c3RpZnktY29udGVudDogbGVmdDsNCiAgICAgICAgLXdlYmtpdC1ib3gtYWxpZ246IGxlZnQ7DQogICAgICAgIC1tcy1mbGV4LWFsaWduOiBsZWZ0Ow0KICAgICAgICBhbGlnbi1pdGVtczogbGVmdDsNCiAgICB9DQoNCiAgICAudGFibGUtZGVsaW1lciB0YWJsZSB7DQogICAgICAgIHdpZHRoOiAxMDAlOw0KICAgICAgICB0ZXh0LWFsaWduOiBsZWZ0Ow0KICAgIH0NCg0KICAgIC50YWJsZS1kZWxpbWVyIHRhYmxlIHRib2R5IHRyIHRoIHsNCiAgICAgICAgcGFkZGluZzogLjVyZW0gMXJlbTsNCiAgICAgICAgZm9udC1zaXplOiAxLjJyZW07DQogICAgICAgIGZvbnQtd2VpZ2h0OiA1MDA7DQogICAgfQ0KDQogICAgLnRhYmxlLWRlbGltZXIgdGFibGUgdGJvZHkgdHIgdGgudGl0bGUtc3Ryb25nIHsNCiAgICAgICAgZm9udC13ZWlnaHQ6IDcwMDsNCiAgICAgICAgZm9udC1zaXplOiAxLjRyZW07DQogICAgfQ0KDQogICAgLm1nLXQtc20gew0KICAgICAgICBtYXJnaW4tdG9wOiAuNXJlbTsNCiAgICB9DQoNCiAgICAubWctdC1tZCB7DQogICAgICAgIG1hcmdpbi10b3A6IDFyZW07DQogICAgfQ0KDQogICAgLmdlbmVyYWwtaW5mby10YWJsZSB7DQogICAgICAgIHdpZHRoOiAxMDAlOw0KICAgICAgICBib3JkZXItY29sbGFwc2U6IHNlcGFyYXRlOw0KICAgICAgICBib3JkZXItc3BhY2luZzogMCAuNXJlbTsNCiAgICB9DQoNCiAgICAuZ2VuZXJhbC1pbmZvLXRhYmxlIHRyIHRkIHsNCiAgICAgICAgd2lkdGg6IDI1JTsNCiAgICB9DQoNCiAgICAudGFibGUtbGluZXMgdGFibGUgew0KICAgICAgICB3aWR0aDogMTAwJTsNCiAgICB9DQoNCiAgICAudGFibGUtbGluZXMgdGFibGUgdGhlYWQgew0KICAgICAgICBkaXNwbGF5OiB0YWJsZS1oZWFkZXItZ3JvdXA7DQogICAgICAgIG1hcmdpbi10b3A6IDJyZW07DQogICAgfQ0KDQogICAgLnRhYmxlLWxpbmVzIHRhYmxlIHRoZWFkIHRyIHRoIHsNCiAgICAgICAgd2lkdGg6IDEwJTsNCiAgICAgICAgcGFkZGluZzogLjVyZW0gLjVyZW07DQogICAgICAgIGZvbnQtc2l6ZTogLjlyZW07DQogICAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7DQogICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7DQogICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGRhcmtncmF5Ow0KICAgIH0NCg0KICAgIC50YWJsZS1saW5lcyB0YWJsZSB0aGVhZCB0ciB0aC50YWJsZS1jb2wtbGcgew0KICAgICAgICB3aWR0aDogMzAlOw0KICAgIH0NCg0KICAgIC50YWJsZS1saW5lcyB0YWJsZSB0Ym9keSB0ciB0ZCB7DQogICAgICAgIHdpZHRoOiAxMCU7DQogICAgICAgIHBhZGRpbmc6IC41cmVtIC41cmVtOw0KICAgICAgICBmb250LXNpemU6IC45cmVtOw0KICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyOw0KICAgICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7DQogICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7DQogICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGRhcmtncmF5Ow0KICAgIH0NCg0KICAgIC50YWJsZS1saW5lcyB0YWJsZSB0Ym9keSB0ciB0ZC50YWJsZS1jb2wtbGcgew0KICAgICAgICB3aWR0aDogMzAlOw0KICAgIH0NCg0KICAgIC50YWJsZS1saW5lcyB0YWJsZSB0Ym9keSB0ciB0ZC5iZHItcm12LWwgew0KICAgICAgICBib3JkZXItbGVmdDogbm9uZTsNCiAgICB9DQoNCiAgICAudGFibGUtbGluZXMgdGFibGUgdGJvZHkgdHIgdGQuYmRyLXJtdi1yIHsNCiAgICAgICAgYm9yZGVyLXJpZ2h0OiBub25lOw0KICAgIH0NCg0KICAgIC50YWJsZS1saW5lcyB0YWJsZSB0Ym9keSB0ciB0ZC5iZHItcm12LWxyIHsNCiAgICAgICAgYm9yZGVyLWxlZnQ6IG5vbmU7DQogICAgICAgIGJvcmRlci1yaWdodDogbm9uZTsNCiAgICB9DQoNCiAgICAuZm9vdGVyLWRlbGltZXIgew0KICAgICAgICBtYXJnaW4tdG9wOiAycmVtOw0KICAgICAgICBib3JkZXItdG9wOiAycHggc29saWQgZGFya2dyYXk7DQogICAgfQ0KPC9zdHlsZT4NCg0KPC9odG1sPg==`
    };
    const res = await papiClient.post(`/addons/files/${client.AddonUUID}`, body);
}

