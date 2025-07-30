import { InjectionToken } from '@angular/core';

export interface TestBehavioursUiConfig {
  path: string;
  baseURL?: string;
  prefix: string;
  canActivate?: any[];
}

export const TEST_BEHAVIOURS_UI_CONFIG = new InjectionToken<TestBehavioursUiConfig>('TestBehavioursUiConfig');
