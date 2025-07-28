import {
  Component,
  effect,
  inject,
  OnInit,
  OnDestroy,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-services/requests.service';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-services/behaviour.service';

@Component({
  selector: 'app-parameters-and-returns',
  templateUrl: './prameters-and-returns.html',
  styleUrls: ['./prameters-and-returns.scss'],
  standalone: false,
})
export class ParametersAndReturnsComponent implements OnInit, OnDestroy {
  private requestsService = inject(RequestsService);
  private behaviourService = inject(BehaviorService);
  private lastParams: any = null;
  @ViewChild('jsonView') jsonView!: ElementRef;
  @ViewChild('treeView') treeView!: ElementRef;
  @ViewChild('returnView') returnView!: ElementRef;
  form: FormGroup;
  parametersList: string[] = [];
  typesList(): string[] {
    return ['String', 'Number', 'Boolean', 'Object'];
  }

  response = this.behaviourService.responseSignal();
  responseView: 'json' | 'tree' | 'returns' = 'returns';
  returns: any = {};
  returnKeys: string[] = [];
  copied = false;
  showHintIndex: number | null = null;
  error = signal<any>(null);
  responseTime = signal<number | null>(null);
  activeInputIndex: number | null = null;
  visibleEditorIndex: number | null = null;
  jsonEditorValue: string = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      parameters: this.fb.array([]),
    });

    effect(() => {
      const data = this.requestsService.theRequest();
      if (data?.parameters) {
        this.parameters.clear();
        const filteredParams = Object.entries(data.parameters).filter(
          ([_, paramData]: [string, any]) => paramData.type !== 'middleware'
        );
        this.parametersList = filteredParams.map(([paramName]) => paramName);
        const currentApiName = data.name;
        filteredParams.forEach(([paramName, paramData]: [string, any]) => {
          const type = paramData?.type || 'String';
          const savedValue = this.requestsService.getDraftParam(
            currentApiName,
            paramName
          );
          this.parameters.push(
            this.fb.group({
              paramName: [paramName],
              rawValue: [
                typeof savedValue === 'object'
                  ? JSON.stringify(savedValue)
                  : savedValue || '',
              ],

              type: ['String'],
            })
          );
        });
        const initialParams = this.jsonPreview;
        this.lastParams = initialParams;
        this.behaviourService.updateParameters(initialParams);
      }
    });

    effect(() => {
      this.response = this.behaviourService.responseSignal();
      this.returns = this.response;
      this.returnKeys = Object.keys(this.returns);
      this.error.update((prev) => this.behaviourService.errorSignal());
      this.responseTime.update((prev) =>
        this.behaviourService.responseTimeSignal()
      );
    });
  }

  ngOnInit() {
    this.addRow();
    if (this.response) {
      this.returns = this.response;
      this.returnKeys = Object.keys(this.returns);
    }
  }

  ngOnDestroy() {
    const currentApiName = this.requestsService.theRequest().name;
    const currentParams = this.jsonPreview;
    for (const paramName in currentParams) {
      this.requestsService.updateDraftParam(
        currentApiName,
        paramName,
        currentParams[paramName]
      );
    }
  }

  get parameters(): FormArray {
    return this.form.get('parameters') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      paramName: [{ value: '', disabled: false }],
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

  get jsonPreview(): any {
    const result: any = {};
    this.parameters.controls.forEach((control) => {
      const group = control as FormGroup;
      const paramName = group.get('paramName')?.value;
      const rawValue = group.get('rawValue')?.value; // ✅ بدل value
      const type = group.get('type')?.value;

      if (paramName && rawValue !== undefined) {
        try {
          switch (type) {
            case 'Number':
              result[paramName] = Number(rawValue);
              break;
            case 'Boolean':
              result[paramName] = rawValue === 'true';
              break;
            case 'Date':
              result[paramName] = new Date(rawValue).toISOString();
              break;
            case 'Object':
              result[paramName] = JSON.parse(rawValue);
              break;
            default:
              result[paramName] = rawValue;
          }
        } catch (e) {
          console.error(`Invalid JSON for parameter ${paramName}`);
          result[paramName] = rawValue; // fallback
        }
      }
    });

    return result;
  }

  onBlur(index: number): void {
    if (this.activeInputIndex === index) {
      const currentApiName = this.requestsService.theRequest().name;
      const currentParams = this.jsonPreview;
      for (const paramName in currentParams) {
        this.requestsService.updateDraftParam(
          currentApiName,
          paramName,
          currentParams[paramName]
        );
      }
      this.behaviourService.updateParameters(currentParams);
      this.lastParams = currentParams;
      this.activeInputIndex = null;
    }
  }

  onFocus(index: number): void {
    this.activeInputIndex = index;
  }

  isPrimitive(value: any): boolean {
    return typeof value !== 'object' || value === null;
  }

  // Copied function

  copyJsonToClipboard() {
    let element: HTMLElement | null = null;

    switch (this.responseView) {
      case 'json':
        element = this.jsonView?.nativeElement;
        break;
      case 'tree':
        element = this.treeView?.nativeElement;
        break;
      case 'returns':
        element = this.returnView?.nativeElement;
        break;
    }

    if (element) {
      const text = element.innerText || element.textContent || '';
      navigator.clipboard.writeText(text).then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1500);
      });
    }
  }

  // the copied message
  get copiedViewLabel(): string {
    switch (this.responseView) {
      case 'json':
        return 'The JSON view ';
      case 'tree':
        return 'The Tree view';
      case 'returns':
        return 'The Return view';
      default:
        return 'Response';
    }
  }

  getErrorClass(): string {
    const code = this.error()?.code;
    switch (code) {
      case 400:
      case 401:
      case 500:
        return 'bg-danger';
      case 404:
        return 'bg-warning';
      case 200:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  // !json editor

  openJsonEditor(index: number) {
    this.visibleEditorIndex = index;

    const value = this.parameters.at(index).get('rawValue')?.value;
    try {
      this.jsonEditorValue = JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      this.jsonEditorValue = value;
    }
  }

  saveJson(index: number) {
    const control = this.parameters.at(index).get('rawValue');
    console.log('Before Save:', this.jsonEditorValue);
    if (control) {
      control.setValue(this.jsonEditorValue);
      control.markAsTouched();
      control.updateValueAndValidity();
      this.form.markAsDirty();
      this.visibleEditorIndex = null;
    }
  }

  cancelJson() {
    this.visibleEditorIndex = null;
    this.jsonEditorValue = '';
  }
}
