declare var bootstrap: any;
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
  jsonEditorValue = '';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({ parameters: this.fb.array([]) });

    effect(() => {
      const data = this.requestsService.theRequest();
      if (!data?.parameters) return;

      this.parameters.clear();

      const filteredParams = Object.entries(data.parameters).filter(
        ([, paramData]: [string, any]) => paramData.type !== 'middleware'
      );

      this.parametersList = filteredParams.map(([paramName]) => paramName);

      filteredParams.forEach(([paramName, paramData]: [string, any]) => {
        const savedValue = this.requestsService.getDraftParam(data.name, paramName);
        this.parameters.push(
          this.fb.group({
            paramName: [paramName],
            rawValue: [typeof savedValue === 'object' ? JSON.stringify(savedValue) : savedValue || ''],
            type: ['String'],
          })
        );
      });

      this.lastParams = this.jsonPreview;
      this.behaviourService.updateParameters(this.lastParams);
    });

    effect(() => {
      this.response = this.behaviourService.responseSignal();
      this.returns = this.response;
      this.returnKeys = Object.keys(this.returns);
      this.error.update(() => this.behaviourService.errorSignal());
      this.responseTime.update(() => this.behaviourService.responseTimeSignal());
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
    Object.entries(currentParams).forEach(([paramName, value]) => {
      this.requestsService.updateDraftParam(currentApiName, paramName, value);
    });
  }

  get parameters(): FormArray {
    return this.form.get('parameters') as FormArray;
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

  get jsonPreview(): any {
    const result: any = {};

    this.parameters.controls.forEach((control) => {
      const group = control as FormGroup;
      const paramName = group.get('paramName')?.value;
      const rawValue = group.get('rawValue')?.value;
      const type = group.get('type')?.value;

      if (!paramName || rawValue === undefined) return;

      try {
        result[paramName] = this.castValueByType(rawValue, type);
      } catch {
        console.error(`Invalid JSON for parameter ${paramName}`);
        result[paramName] = rawValue;
      }
    });

    return result;
  }

  castValueByType(value: any, type: string) {
    switch (type) {
      case 'Number': return Number(value);
      case 'Boolean': return value === 'true';
      case 'Date': return new Date(value).toISOString();
      case 'Object': return JSON.parse(value);
      default: return value;
    }
  }

  onBlur(index: number): void {
    if (this.activeInputIndex !== index) return;

    const currentApiName = this.requestsService.theRequest().name;
    const currentParams = this.jsonPreview;

    Object.entries(currentParams).forEach(([paramName, value]) => {
      this.requestsService.updateDraftParam(currentApiName, paramName, value);
    });

    this.behaviourService.updateParameters(currentParams);
    this.lastParams = currentParams;
    this.activeInputIndex = null;
  }

  onFocus(index: number): void {
    this.activeInputIndex = index;
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

  get copiedViewLabel(): string {
    const labelMap = {
      json: 'The JSON view',
      tree: 'The Tree view',
      returns: 'The Return view',
    };
    return labelMap[this.responseView] || 'Response';
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
    if (control) {
      control.setValue(this.jsonEditorValue);
      control.markAsTouched();
      control.updateValueAndValidity();
      this.form.markAsDirty();
      this.visibleEditorIndex = null;
    }
    this.hideJsonModal();
  }

  cancelJson() {
    this.visibleEditorIndex = null;
    this.jsonEditorValue = '';
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
