import {
  Component,
  effect,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ViewChild,
  ElementRef,
  computed,
} from '@angular/core';

import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-service/requests.service';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-service/behaviour.service';

declare var bootstrap: any;

@Component({
  selector: 'parameters-and-returns',
  templateUrl: './parameters-and-returns.html',
  styleUrls: ['./parameters-and-returns.scss'],
  standalone: false,
})
export class ParametersAndReturnsComponent implements OnInit, OnDestroy {
  @ViewChild('jsonView') jsonView!: ElementRef;
  @ViewChild('treeView') treeView!: ElementRef;
  @ViewChild('returnView') returnView!: ElementRef;

  private requestsService = inject(RequestsService);
  private behaviourService = inject(BehaviorService);
  private lastParams: any = null;
  private previousApiName: string = '';

  form: FormGroup;
  parametersList: string[] = [];
  response = signal<any>(this.behaviourService.responseSignal());
  responseView: 'json' | 'tree' | 'returns' = 'returns';
  returns = signal<any>({});
  returnKeys = signal<string[]>([]);
  copied = false;
  error = signal<any>(null);
  responseTime = signal<number | null>(null);
  activeInputIndex: number | null = null;
  visibleEditorIndex: number | null = null;
  jsonEditorValue = '';

  get parameters(): FormArray {
    return this.form.get('parameters') as FormArray;
  }

  get jsonPreview(): any {
    const result: any = {};

    this.parameters.controls.forEach((control) => {
      const group = control as FormGroup;
      const paramName = group.get('paramName')?.value;
      const rawValue = group.get('rawValue')?.value;
      const type = group.get('type')?.value;

      if (!paramName || rawValue === undefined || rawValue === '') return;

      try {
        result[paramName] = this.castValueByType(rawValue, type);
      } catch (error) {
        result[paramName] = rawValue;
      }
    });

    return result;
  }

  get copiedViewLabel(): string {
    const labelMap = {
      json: 'The JSON view',
      tree: 'The Tree view',
      returns: 'The Return view',
    };
    return labelMap[this.responseView] || 'Response';
  }

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({ parameters: this.fb.array([]) });

    const apiName = computed(
      () => this.requestsService.theRequest()?.name || ''
    );

    const initialClearValue = this.requestsService.clearSignal();
    effect(() => {
      if (this.requestsService.clearSignal() > initialClearValue) {
        this.response.set({});
        this.returns.set({});
        this.returnKeys.set([]);
        this.error.set(null);
        this.responseTime.set(null);
        this.parameters.clear();
        this.addRow();
        this.lastParams = null;
        this.previousApiName = '';
      }
    });

    effect(() => {
      const currentApiName = apiName();

      if (!currentApiName) {
        this.response.set({});
        this.returns.set({});
        this.returnKeys.set([]);
        this.error.set(null);
        this.responseTime.set(null);
        this.previousApiName = '';
        return;
      }

      // Load cached data from RequestsService on initialization
      if (currentApiName !== this.previousApiName && this.requestsService.hasCachedResponse(currentApiName)) {
        const cachedResponse = this.requestsService.getCachedResponse(currentApiName);
        const cachedError = this.requestsService.getCachedError(currentApiName);
        const cachedResponseTime = this.requestsService.getCachedResponseTime(currentApiName);

        this.response.set(cachedResponse);
        this.returns.set(cachedResponse);
        this.returnKeys.set(Object.keys(cachedResponse || {}));
        this.error.set(cachedError);
        this.responseTime.set(cachedResponseTime);

        // Populate service signals with cached data
        this.behaviourService.responseSignal.set(cachedResponse);
        this.behaviourService.errorSignal.set(cachedError);
        this.behaviourService.responseTimeSignal.set(cachedResponseTime);
      }

      const data = this.requestsService.theRequest();

      // If the API name is the same, don't clear and re-populate the form
      // This prevents losing focus/typing ability during realtime data updates
      if (currentApiName === this.previousApiName) {
        return;
      }

      if (!data?.parameters) {
        this.previousApiName = currentApiName;
        return;
      }

      this.parameters.clear();
      this.previousApiName = currentApiName;

      const filteredParams = Object.entries(data.parameters).filter(
        ([, paramData]: [string, any]) => paramData.type !== 'middleware'
      );

      this.parametersList = filteredParams.map(([paramName]) => paramName);

      filteredParams.forEach(([paramName, paramData]: [string, any]) => {
        const savedValue = this.requestsService.getDraftParam(
          data.name,
          paramName
        );
        const savedType = this.requestsService.getDraftParamType(
          data.name,
          paramName
        );

        let rawValue = '';
        if (savedValue !== '') {
          if (savedType === 'Object' && typeof savedValue === 'object') {
            rawValue = JSON.stringify(savedValue);
          } else if (savedType === 'Object' && typeof savedValue === 'string') {
            // Try to parse if it's a JSON string
            try {
              JSON.parse(savedValue);
              rawValue = savedValue;
            } catch {
              rawValue = savedValue;
            }
          } else {
            rawValue = String(savedValue);
          }
        }

        this.parameters.push(
          this.fb.group({
            paramName: [paramName],
            rawValue: [rawValue],
            type: [savedType],
          })
        );
      });

      this.lastParams = this.jsonPreview;
      this.behaviourService.updateParameters(this.lastParams);
    });

    effect(() => {
      // Sync local signals with behaviorService signals
      const response = this.behaviourService.responseSignal();
      const error = this.behaviourService.errorSignal();
      const time = this.behaviourService.responseTimeSignal();

      this.response.set(response || {});
      this.returns.set(response || {});
      this.returnKeys.set(Object.keys(response || {}));

      this.error.set(error);
      this.responseTime.set(time);
    });
  }

  ngOnInit() {

  }

  getAvailableParameters(currentIndex: number): string[] {
    const selectedParams = this.parameters.controls
      .map((control, index) => index !== currentIndex ? control.get('paramName')?.value : null)
      .filter(param => param && param !== '');

    return this.parametersList.filter(param => !selectedParams.includes(param));
  }

  typesList(): string[] {
    return ['String', 'Number', 'Boolean', 'Object'];
  }

  createRow(): FormGroup {
    return this.fb.group({
      paramName: [''],
      rawValue: [''],
      type: ['String'],
    });
  }

  addRow() {
    this.parameters.push(this.createRow());
  }

  removeRow(index: number) {
    if (this.parameters.length > 1) this.parameters.removeAt(index);
  }

  castValueByType(value: any, type: string) {
    if (!value || value === '') return value;

    switch (type) {
      case 'Number':
        return Number(value);
      case 'Boolean':
        return value === 'true';
      case 'Date':
        return new Date(value).toISOString();
      case 'Object':

        if (
          typeof value === 'string' &&
          (value.trim().startsWith('{') || value.trim().startsWith('['))
        ) {
          try {
            return JSON.parse(value);
          } catch {
            return value;
          }
        }
        return value;
      default:
        return value;
    }
  }

  updateDraftAndParameters(index: number): void {
    if (this.activeInputIndex !== index) return;

    const currentApiName = this.behaviourService.apiName;
    const currentParams = this.jsonPreview;

    this.parameters.controls.forEach((control) => {
      const group = control as FormGroup;
      const paramName = group.get('paramName')?.value;
      const type = group.get('type')?.value;
      const value = currentParams[paramName];

      if (paramName && value !== undefined) {
        this.requestsService.updateDraftParam(
          currentApiName,
          paramName,
          value,
          type
        );
      }
    });

    this.behaviourService.updateParameters(currentParams);
    this.lastParams = currentParams;
    this.activeInputIndex = null;
  }

  currentInputIndex(index: number): void {
    this.activeInputIndex = index;
  }

  onTypeChange(index: number): void {
    const currentApiName = this.behaviourService.apiName;
    const currentRow = this.parameters.at(index);
    const paramName = currentRow.get('paramName')?.value;
    const type = currentRow.get('type')?.value;
    const rawValue = currentRow.get('rawValue')?.value;

    if (paramName && type) {
      let value = rawValue;
      let displayValue = rawValue;

      try {
        if (type === 'Object') {

          if (typeof rawValue === 'string' && rawValue.trim()) {

            if (
              rawValue.trim().startsWith('{') ||
              rawValue.trim().startsWith('[')
            ) {
              try {
                const parsed = JSON.parse(rawValue);
                value = parsed;
                displayValue = JSON.stringify(parsed, null, 2);
              } catch {

                value = rawValue;
                displayValue = rawValue;
              }
            } else {

              value = rawValue;
              displayValue = rawValue;
            }
          } else if (typeof rawValue === 'object') {
            value = rawValue;
            displayValue = JSON.stringify(rawValue, null, 2);
          }
        } else {

          value = this.castValueByType(rawValue, type);
          displayValue = String(value);
        }
      } catch {

        value = rawValue;
        displayValue = rawValue;
      }

      currentRow.get('rawValue')?.setValue(displayValue);

      this.requestsService.updateDraftParam(
        currentApiName,
        paramName,
        value,
        type
      );
    }
  }

  isPrimitive(value: any): boolean {
    return typeof value !== 'object' || value === null;
  }

  copyJsonToClipboard() {
    const elementMap = {
      json: this.jsonView,
      tree: this.treeView,
      returns: this.returnView,
    };

    const element = elementMap[this.responseView]?.nativeElement;
    const text = element?.innerText || element?.textContent || '';

    if (text) {
      navigator.clipboard.writeText(text).then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1500);
      });
    }
  }

  getErrorClass(): string {
    const code = this.error()?.code;
    const classMap: Record<number, string> = {
      200: 'bg-success',
      400: 'bg-danger',
      401: 'bg-danger',
      404: 'bg-warning',
      500: 'bg-danger',
    };
    return classMap[code] || 'bg-secondary';
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  isValidJson(value: any): boolean {
    if (!value || typeof value !== 'string') return false;

    try {
      const parsed = JSON.parse(value);
      return typeof parsed === 'object' && parsed !== null;
    } catch {
      return false;
    }
  }

  saveJson(index: number) {
    const control = this.parameters.at(index).get('rawValue');
    const typeControl = this.parameters.at(index).get('type');
    if (control) {
      control.setValue(this.jsonEditorValue);
      control.markAsTouched();
      control.updateValueAndValidity();
      this.form.markAsDirty();
      this.visibleEditorIndex = null;

      const currentApiName = this.behaviourService.apiName;
      const paramName = this.parameters.at(index).get('paramName')?.value;
      const type = typeControl?.value || 'Object';

      if (paramName) {
        let value;
        if (type === 'Object' && this.jsonEditorValue.trim()) {
          try {
            value = JSON.parse(this.jsonEditorValue);
          } catch {
            value = this.jsonEditorValue;
          }
        } else {
          value = this.jsonEditorValue;
        }

        this.requestsService.updateDraftParam(
          currentApiName,
          paramName,
          value,
          type
        );
      }
    }
    this.hideJsonModal();
  }

  openJsonModal(index: number) {
    this.visibleEditorIndex = index;
    const modalElement = document.getElementById('jsonModal');
    if (modalElement) new bootstrap.Modal(modalElement).show();
  }

  hideJsonModal() {
    const modalElement = document.getElementById('jsonModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement!);
    modalInstance?.hide();
  }

  resetForm(): void {

    const paramArray = this.form.get('parameters') as FormArray;
    paramArray.clear();

    this.addRow();
  }

  ngOnDestroy() {
    const currentApiName = this.behaviourService.apiName;
    const currentParams = this.jsonPreview;

    // Prevent re-saving if the data has been cleared or is empty
    if (Object.keys(this.requestsService.draftData() || {}).length === 0) {
      return;
    }

    // Update each parameter with its corresponding type
    this.parameters.controls.forEach((control) => {
      const group = control as FormGroup;
      const paramName = group.get('paramName')?.value;
      const type = group.get('type')?.value;
      const value = currentParams[paramName];

      if (paramName && value !== undefined) {
        this.requestsService.updateDraftParam(
          currentApiName,
          paramName,
          value,
          type
        );
      }
    });
  }
}
