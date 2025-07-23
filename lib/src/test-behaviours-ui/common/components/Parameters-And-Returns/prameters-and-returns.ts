import {
  Component,
  effect,
  inject,
  OnInit,
  OnDestroy,
  signal,
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

  form: FormGroup;
  parametersList: string[] = [];
  typesList = signal<string[]>(['String', 'Number', 'Date', 'Object']);
  response = this.behaviourService.responseSignal();

  responseView: 'json' | 'tree' | 'returns' = 'returns';
  returns: any = {};
  returnKeys: string[] = [];
  copied = false;

  error = signal<any>(null);
  responseTime = signal<number | null>(null);
  activeInputIndex: number | null = null;

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
              value: [savedValue || ''],
              type: [type],
            })
          );
        });
        const initialParams = this.jsonPreview;
        this.lastParams = initialParams;
        this.behaviourService.updateParameters(initialParams);
      }
    });

    // Ameen Integration
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
    // حفظ القيم عند تدمير المكون (اختياري)
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
      paramName: [{ value: 'id', disabled: true }],
      value: [''],
      type: [{ value: 'String', disabled: true }],
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
      const value = group.get('value')?.value;
      const type = group.get('type')?.value;

      if (paramName && value !== undefined) {
        switch (type) {
          case 'Number':
            result[paramName] = Number(value);
            break;
          case 'Boolean':
            result[paramName] = value === 'true';
            break;
          case 'Date':
            result[paramName] = new Date(value).toISOString();
            break;
          case 'Object':
            try {
              result[paramName] = JSON.parse(value);
            } catch (e) {
              console.error(`Invalid JSON for parameter ${paramName}`);
              result[paramName] = value;
            }
            break;
          default:
            result[paramName] = value;
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

  copyJsonToClipboard() {
    const jsonString = JSON.stringify(this.response, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
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
}
