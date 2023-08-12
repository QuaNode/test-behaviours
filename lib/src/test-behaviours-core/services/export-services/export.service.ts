import { Injectable } from '@angular/core';
import { RequestFormat, ItemFormat, Collection, InputCollection } from '../../models/collection';

@Injectable({
    providedIn: 'root'
})
export class ExportService {
    constructor() { }

    private getRequestInfo(reqInfo: InputCollection) : RequestFormat{
        return{
            method: reqInfo.method ? reqInfo.method.toUpperCase() : "GET",
            ...reqInfo.params && {
                body: {
                    mode: "raw",
                    raw: reqInfo.params
                }
            },
            ...reqInfo.host && {url: {
                raw: `https://${reqInfo.host}${reqInfo.path}`,
                protocol: "https",
                host: reqInfo.host?.split("."),
                ...reqInfo.path && {path: reqInfo.path.slice(1).split("/")}
            }
        }}
    }

    public getCollection(inCollection: InputCollection[]) : Collection{
        const collectionItems: ItemFormat[] = inCollection.map(item => {

            return {
                name: item.name ? item.name : "untitled request",
                request: this.getRequestInfo(item),
                response: !item.response ? [] : [{
                    _postman_previewlanguage: "json",
                    ...item.name && {name: item.name},
                    originalRequest: this.getRequestInfo(item),
                    ...item.responseStatus && {status: item.responseStatus},
                    ...item.responseCode && {code: item.responseCode},
                    body: item.response
                }]
            }
        })
        
        return {
            info: {
                name: "test conversion function",
                schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
            },
            item: collectionItems
        }
    }
}