import { PapiClient } from '@pepperi-addons/papi-sdk'
import { Client, Request } from '@pepperi-addons/debug-server';
import fetch from 'node-fetch';
import pdf from 'html-pdf';
import { v4 as uuid } from 'uuid';
import config from '../addon.config.json';
import mustache from 'mustache'
import { DEFAULT_TEMPLATE_PATH } from './constants';

// TODO: remove debug import:
const fs = require('fs');

export class PdfService {

    papiClient: PapiClient
    templateBuffer: Buffer = Buffer.from("");
    orderData: any;
    html: any;
    pdfBuffer: any;

    constructor(private client: Client, private request: Request) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });

        //transalte '~'s to '/'s in template_name

        this.request.query.template_name = this.request.query.template_name ? this.request.query.template_name.replace(new RegExp("~", 'g'), "/") : DEFAULT_TEMPLATE_PATH;

    }

    async create() {
        // Get the template from S3
        await this.getTemplate();

        // Get order data from papi
        await this.getOrderData();

        // Cast order data into the template to create an HTML
        this.createHtml();

        // Convert html into PDF
        await this.createPdf();

        // Post the created PDF to PFS
        return await this.postPDFtoPfs();
    }

    async getTemplate() {
        const requestOptions = {
            method: 'GET',
            json: false,

            headers: {}
        }

        const templatePfsObj =  await this.papiClient.get(`/addons/files/${config.AddonUUID}/${this.request.query.template_name}`);
        const fetchRes = await fetch(templatePfsObj.URL, requestOptions);
        this.templateBuffer = await fetchRes.text();
    }

    async getOrderData() {
        this.orderData = await this.papiClient.transactions.get(this.request.query.order_id);
    }

    async createHtml() {

        // const template = fs.readFileSync('./sample.html', 'utf8');

        this.html = mustache.render(this.templateBuffer, this.orderData);
    }

    async createPdf() {
        const options = {
            "format": "A4",
            "orientation": "portrait",
            "border": {
                "top": "0.2in",
                "right": "0.2in",
                "bottom": "0.2in",
                "left": "0.2in"
            },
            "timeout": "120000"
        };
        
        const html = this.html;

        this.pdfBuffer = await new Promise(function (resolve, reject) {
            pdf.create(html, options).toBuffer(function (err, res) {
                if (err) reject(err);
                resolve(res);
            });
        }
        )
    }


    private async postPDFtoPfs() {
        const pfsResult = await this.createPresignedUrl();
        await this.PUTbufferToPresignedUrl(pfsResult.PresignedURL);
        return pfsResult;
    }

    private async createPresignedUrl() {
        const pfsBody = {
            Key: `/orders/${uuid()}.pdf`,
            MIME: 'application/pdf',
            URI: "",
            Description: `OrderId = ${this.request.query.order_id}`
        };

        const pfsResult = await this.papiClient.post(`/addons/files/${config.AddonUUID}`, pfsBody);
        return pfsResult;
    }

    private async PUTbufferToPresignedUrl(presignedURL: any) {
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/pdf' },
            body: this.pdfBuffer
        };

        await fetch(presignedURL, requestOptions);
    }
}
