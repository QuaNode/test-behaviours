import { Injectable } from '@angular/core';
import { RequestFormat, ItemFormat, Collection, InputCollectionFormat } from '../models/collection';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor() { }

  private getQueryParams(urlParams: string){
    const paramsArr = urlParams.slice(1).split("&");
    const queryArr = paramsArr.map(param => {
        return{
            key: param.split("=")[0],
            value: param.split("=").length === 2 ? param.split("=")[1] : ""
        }
    })
    return queryArr;
  }

  private getRequestInfo(method?: string, url?: string) : RequestFormat{
      if(url){
          const urlInfo = new URL(url);

          return{
              method: method ? method.toUpperCase() : "GET",
              url: {
                  raw: url,
                  protocol: urlInfo.protocol.slice(0, urlInfo.protocol.length - 1),
                  host: urlInfo.hostname.split("."),
                  ...urlInfo.pathname.slice(1) && {path: urlInfo.pathname.slice(1).split("/")},
                  ...urlInfo.search && {query: this.getQueryParams(urlInfo.search)}
              }
          }
      }
      return {method: method ? method.toUpperCase() : "GET"}
  }

  public getCollection(inCollection: InputCollectionFormat[]) : Collection{
      const collectionItems: ItemFormat[] = inCollection.map(item => {

          return {
              name: item.name ? item.name : "untitled request",
              request: this.getRequestInfo(item.method, item.url),
              response: !item.response ? [] : item.response.map(res => {
                  return{
                      _postman_previewlanguage: "json",
                      ...res.name && {name: res.name},
                      ...res.originalReq && {originalRequest: this.getRequestInfo(res.originalReq.method, res.originalReq.url)},
                      ...res.status && {status: res.status},
                      ...res.code && {code: res.code},
                      ...res.body && {body: res.body},
                  }
              })
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
