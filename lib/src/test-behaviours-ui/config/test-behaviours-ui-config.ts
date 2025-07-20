// test-behaviours-ui-config.ts
import { InjectionToken } from '@angular/core';

export interface TestBehavioursUiConfig {
  defaultRoute?: string;
  showHeader?: boolean;
}

export const TEST_BEHAVIOURS_UI_CONFIG = new InjectionToken<TestBehavioursUiConfig>('TestBehavioursUiConfig');
