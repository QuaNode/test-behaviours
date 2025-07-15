export interface BehavioursResponse {
  name: string;
  parameters?: any;
  returns?: any;
  method?: string;
  version?:any;
  path?:any;
  prefix?: any;
  events?: boolean;

}

export interface Request extends BehavioursResponse {
  version: string;
  method: string;
  path: string;
  prefix: string;
  events: boolean;
}
