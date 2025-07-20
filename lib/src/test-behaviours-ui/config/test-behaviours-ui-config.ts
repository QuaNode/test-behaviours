// test-behaviours-ui-config.ts
import { InjectionToken } from '@angular/core';

export interface TestBehavioursUiConfig {
  path: string;
  baseURL?: string;
  prefix: string;
}

export const TEST_BEHAVIOURS_UI_CONFIG = new InjectionToken<TestBehavioursUiConfig>('TestBehavioursUiConfig');
