export interface BehavioursResponse {
  name: string;
  parameters?: any;
  returns?: any;
}

export interface Request extends BehavioursResponse {
  version: string;
  method: string;
  path: string;
  prefix: string;
  events: boolean;
}
