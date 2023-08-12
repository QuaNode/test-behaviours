export interface RequestFormat{
    method?: string,
    body?: {
        mode: "raw",
        raw: string
    },
    url?: {
        raw?: string,
        protocol?: "http" | "https",
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

export interface InputCollection{
    name?: string,
    method?: string,
    host?: string,
    path?: string,
    params?: string,
    response?: string,
    responseStatus?: string,
    responseCode?: number,
}