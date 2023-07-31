export interface RequestFormat{
    method?: string,
    url?: {
        raw?: string,
        protocol?: string,
        host?: string[],
        path?: string[],
        query?:
            {
                key: string,
                value: string
            }[]
    }
}

interface ResponseFormat{
    _postman_previewlanguage: string,
    name?: string,
    originalRequest?: RequestFormat,
    status?: string,
    code?: number,
    body?: string
}

export interface ItemFormat{
    name?: string,
    request?: RequestFormat,
    response?: ResponseFormat[]
}

export interface Collection {
    info: {
        name?: string,
        description?: string,
        schema: string
    },
    item?: ItemFormat[]
}

// this is the required input structure to enable the service to work properly
export interface InputCollectionFormat{
    name?: string,
    method?: string,
    url?: string,
    response?: {name?: string, originalReq?: {method?: string, url?: string}, status?: string, code?: number, body?: string}[]
}