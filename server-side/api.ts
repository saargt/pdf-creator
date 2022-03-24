import {PdfService} from './pdf.service'
import { Client, Request } from '@pepperi-addons/debug-server'

export async function create_pdf(client: Client, request: Request) 
{
	console.log(`Request received: ${JSON.stringify(request)}`);
	
	switch (request.method) 
	{
	case "POST": {
		const pdf = new PdfService(client, request);

		return pdf.create();
	}
	default: {
		throw new Error(`Unsupported method: ${request.method}`);
	}
	}
}

