export interface BehavioursResponse {
  name: string;
  parameters?: any;
  returns?: any;
  method?: string;
}

export interface Request extends BehavioursResponse {
  version: string;
  method: string;
  path: string;
  prefix: string;
  events: boolean;
}
