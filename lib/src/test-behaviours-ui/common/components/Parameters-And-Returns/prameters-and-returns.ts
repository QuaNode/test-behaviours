import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-service/requests.service';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-service/behaviour.service';

declare var bootstrap: any;

@Component({
  selector: 'parameters-and-returns',
  templateUrl: './prameters-and-returns.html',
  styleUrls: ['./prameters-and-returns.scss'],
})
export class ParametersAndReturnsComponent implements OnInit, OnDestroy {
  @ViewChild('jsonView') jsonView!: ElementRef;
  @ViewChild('treeView') treeView!: ElementRef;
  @ViewChild('returnView') returnView!: ElementRef;

  form: FormGroup;
  parametersList: string[] = [];
  response: any = {};
  responseView: 'json' | 'tree' | 'returns' = 'returns';
  returns: any = {};
  returnKeys: string[] = [];
  copied = false;
  error: any = null;
  responseTime: number | null = null;
  activeInputIndex: number | null = null;
  visibleEditorIndex: number | null = null;
  jsonEditorValue = '';
  private lastParams: any = null;
  private previousApiName: string = '';
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private requestsService: RequestsService,
    private behaviourService: BehaviorService
  ) {
    this.form = this.fb.group({ parameters: this.fb.array([]) });
  }

  ngOnInit() {
    const requestSub = this.requestsService.theRequest.subscribe((data) => {
      const currentApiName = data?.name || '';

      if (!currentApiName) {
        this.response = {};
        this.returns = {};
        this.returnKeys = [];
        this.error = null;
        this.responseTime = null;
        return;
      }

      if (this.requestsService.hasCachedResponse(currentApiName)) {
        const cachedResponse =
          this.requestsService.getCachedResponse(currentApiName);
        const cachedError =
          this.requestsService.getCachedError(currentApiName);
        const cachedResponseTime =
          this.requestsService.getCachedResponseTime(currentApiName);

        this.response = cachedResponse;
        this.returns = cachedResponse;
        this.returnKeys = Object.keys(cachedResponse || {});
        this.error = cachedError;
        this.responseTime = cachedResponseTime;
      } else if (
        this.previousApiName &&
        this.previousApiName !== currentApiName
      ) {
        this.response = {};
        this.returns = {};
        this.returnKeys = [];
        this.error = null;
        this.responseTime = null;
      }

      this.previousApiName = currentApiName;

      if (!data?.parameters) return;

      this.parameters.clear();

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

    const responseSub = this.behaviourService.responseSignal.subscribe(
      (currentResponse) => {
        this.response = currentResponse;
        this.returns = currentResponse;
        this.returnKeys = Object.keys(this.returns || {});
      }
    );

    const errorSub = this.behaviourService.errorSignal.subscribe((err) => {
      this.error = err;
    });

    const timeSub = this.behaviourService.responseTimeSignal.subscribe(
      (time) => {
        this.responseTime = time;
      }
    );

    this.subscriptions.add(requestSub);
    this.subscriptions.add(responseSub);
    this.subscriptions.add(errorSub);
    this.subscriptions.add(timeSub);
  }

  ngOnDestroy() {
    const currentApiName = this.requestsService.currentRequest?.name || '';
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

    this.subscriptions.unsubscribe();
  }

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
    if (this.parameters.length > 1) {
      this.parameters.removeAt(index);
    }
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
        // Only try to parse if it looks like JSON
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

    const currentApiName = this.requestsService.currentRequest?.name || '';
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
    const currentApiName = this.requestsService.currentRequest.name;
    const currentRow = this.parameters.at(index);
    const paramName = currentRow.get('paramName')?.value;
    const type = currentRow.get('type')?.value;
    const rawValue = currentRow.get('rawValue')?.value;

    if (paramName && type) {
      let value = rawValue;
      let displayValue = rawValue;

      try {
        if (type === 'Object') {
          // If switching to Object type, try to parse the value
          if (typeof rawValue === 'string' && rawValue.trim()) {
            // Only try to parse if it looks like JSON
            if (
              rawValue.trim().startsWith('{') ||
              rawValue.trim().startsWith('[')
            ) {
              try {
                const parsed = JSON.parse(rawValue);
                value = parsed;
                displayValue = JSON.stringify(parsed, null, 2);
              } catch {
                // If parsing fails, keep the raw value
                value = rawValue;
                displayValue = rawValue;
              }
            } else {
              // Not JSON, keep as string
              value = rawValue;
              displayValue = rawValue;
            }
          } else if (typeof rawValue === 'object') {
            value = rawValue;
            displayValue = JSON.stringify(rawValue, null, 2);
          }
        } else {
          // For other types, cast the value
          value = this.castValueByType(rawValue, type);
          displayValue = String(value);
        }
      } catch {
        // If casting fails, keep the raw value
        value = rawValue;
        displayValue = rawValue;
      }

      // Update the form control with the converted value
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
    const code = this.error?.code;
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
      // Save the updated value with its type
      const currentApiName = this.requestsService.currentRequest.name;
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
}
