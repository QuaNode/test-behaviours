<<<<<<< HEAD
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
=======
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

>>>>>>> origin/mahmoudrabea
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-service/requests.service';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-service/behaviour.service';

@Component({
  selector: 'parameters-and-returns',
  templateUrl: './prameters-and-returns.html',
  styleUrls: ['./prameters-and-returns.scss'],
})
export class ParametersAndReturnsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private lastParams: any = null;

  @ViewChild('jsonView') jsonView!: ElementRef;
  @ViewChild('treeView') treeView!: ElementRef;
  @ViewChild('returnView') returnView!: ElementRef;

  form: FormGroup;
  parametersList: string[] = [];
<<<<<<< HEAD
  typesList = ['String', 'Number', 'Date', 'Object'];
  response = new BehaviorSubject<any>({});
=======
>>>>>>> origin/mahmoudrabea

  response = this.behaviourService.responseSignal();
  responseView: 'json' | 'tree' | 'returns' = 'returns';
  returns: any = {};
  returnKeys: string[] = [];
  copied = false;
<<<<<<< HEAD

  error = new BehaviorSubject<any>(null);
  responseTime = new BehaviorSubject<number | null>(null);
  activeInputIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private requestsService: RequestsService,
    private behaviourService: BehaviorService
  ) {
    this.form = this.fb.group({
      parameters: this.fb.array([]),
=======
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
>>>>>>> origin/mahmoudrabea
    });
  }

  ngOnInit() {
    this.addRow();

    // Watch for request changes
    this.subscription.add(
      this.requestsService.theRequest.subscribe((data) => {
        this.parameters.clear();
        if (data?.parameters) {
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
                value: [savedValue || ''],
                type: [type],
              })
            );
          });
          const initialParams = this.jsonPreview;
          this.lastParams = initialParams;
          this.behaviourService.updateParameters(initialParams);
        }
        // إذا لم يكن هناك أي صفوف، أضف صفًا فارغًا
        if (this.parameters.length === 0) {
          this.addRow();
        }
      })
    );

    // Watch for response changes
    this.subscription.add(
      this.behaviourService.responseSignal.subscribe((response) => {
        this.response.next(response);
        this.returns = response;
        this.returnKeys = Object.keys(this.returns);
      })
    );

    // Watch for error changes
    this.subscription.add(
      this.behaviourService.errorSignal.subscribe((error) => {
        this.error.next(error);
      })
    );

    // Watch for response time changes
    this.subscription.add(
      this.behaviourService.responseTimeSignal.subscribe((time) => {
        this.responseTime.next(time);
      })
    );

    if (this.response.value) {
      this.returns = this.response.value;
      this.returnKeys = Object.keys(this.returns);
    }
  }

  ngOnDestroy() {
<<<<<<< HEAD
    // حفظ القيم عند تدمير المكون (اختياري)
    const currentApiName = this.requestsService.currentRequest?.name;
    const currentParams = this.jsonPreview;
    for (const paramName in currentParams) {
      this.requestsService.updateDraftParam(
        currentApiName,
        paramName,
        currentParams[paramName]
      );
    }
    this.subscription.unsubscribe();
=======
    const currentApiName = this.requestsService.theRequest().name;
    const currentParams = this.jsonPreview;
    Object.entries(currentParams).forEach(([paramName, value]) => {
      this.requestsService.updateDraftParam(currentApiName, paramName, value);
    });
>>>>>>> origin/mahmoudrabea
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
<<<<<<< HEAD
      value: [''],
=======
      rawValue: [''],
>>>>>>> origin/mahmoudrabea
      type: ['String'],
    });
  }

  addRow() {
    this.parameters.push(this.createRow());
  }

  removeRow(index: number) {
<<<<<<< HEAD
    this.parameters.removeAt(index);
  }

  get jsonPreview(): any {
    const params: any = {};
    this.parameters.controls.forEach((control: any) => {
      const paramName = control.get('paramName')?.value;
      const value = control.get('value')?.value;
      if (paramName) {
        params[paramName] = value;
=======
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
>>>>>>> origin/mahmoudrabea
      }
    });
    return params;
  }

<<<<<<< HEAD
  onBlur(index: number): void {
    if (this.activeInputIndex === index) {
      const currentApiName = this.requestsService.currentRequest?.name;
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
=======
  castValueByType(value: any, type: string) {
    switch (type) {
      case 'Number': return Number(value);
      case 'Boolean': return value === 'true';
      case 'Date': return new Date(value).toISOString();
      case 'Object': return JSON.parse(value);
      default: return value;
>>>>>>> origin/mahmoudrabea
    }
  }

  inputsBlur(index: number): void {
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

  inputFocus(index: number): void {
    this.activeInputIndex = index;
  }


  isPrimitive(value: any): boolean {
    return value !== Object(value);
  }

  copyJsonToClipboard() {
<<<<<<< HEAD
    const jsonString = JSON.stringify(this.response.value, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }

  getErrorClass(): string {
    const code = this.error.value?.code;
    switch (code) {
      case 400:
        return 'text-danger';
      case 401:
        return 'text-warning';
      case 403:
        return 'text-danger';
      case 404:
        return 'text-info';
      case 500:
        return 'text-danger';
      default:
        return 'text-secondary';
    }
=======
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
>>>>>>> origin/mahmoudrabea
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
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
