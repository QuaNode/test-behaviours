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
import { IntegrationService } from '../../../../test-behaviours-core/services/integration-services/integration.service';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-parameters-and-returns',
  templateUrl: './prameters-and-returns.html',
  styleUrls: ['./prameters-and-returns.scss'],
  standalone: false,
})
export class ParametersAndReturnsComponent implements OnInit, OnDestroy {
  private requestsService = inject(RequestsService);
  private integrationService = inject(IntegrationService);
  private lastParams: any = null;
  private valueChangesSubscription: Subscription | undefined;

  form: FormGroup;
  parametersList: string[] = [];
  typesList = signal<string[]>(['String', 'Number', 'Date', 'Object']);
  response = this.integrationService.responseSignal();

  responseView: 'json' | 'tree' | 'returns' = 'returns';
  returns: any = {};
  returnKeys: string[] = [];
  copied = false;

  error = signal<any>(null);
  responseTime = signal<number | null>(null);

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
        filteredParams.forEach(([paramName, paramData]: [string, any]) => {
          const type = paramData?.type || 'String';

          this.parameters.push(
            this.fb.group({
              paramName: [paramName],
              value: [''],
              type: [''],
            })
          );
          const initialParams = this.jsonPreview;
          this.lastParams = initialParams;
          this.integrationService.updateParameters(initialParams);
        });
      }
    });

    // Ameen Integration
    effect(() => {
      this.response = this.integrationService.responseSignal();
      this.returns = this.response;
      this.returnKeys = Object.keys(this.returns);
      this.error.update((prev) => this.integrationService.errorSignal());
      this.responseTime.update((prev) =>
        this.integrationService.responseTimeSignal()
      );
    });
    this.setupFormChanges();
  }

  ngOnInit() {
    this.addRow();
    this.parameters.controls.forEach((control) => {
      const group = control as FormGroup;
      group.get('value')?.valueChanges.subscribe((val) => {
        const type = group.get('type')?.value;
        console.log(type);
        if (type === 'Object') {
          try {
            JSON.parse(val);
            group.get('value')?.setErrors(null);
          } catch (e) {
            group.get('value')?.setErrors({ invalidJson: true });
          }
        } else {
          group.get('value')?.setErrors(null);
        }
      });
    });
    if (this.response) {
      this.returns = this.response;
      this.returnKeys = Object.keys(this.returns);
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

  // Ameen Integration
  private setupFormChanges(): void {
    this.valueChangesSubscription = this.parameters.valueChanges
      .pipe(debounceTime(300))
      .subscribe(() => {
        const currentParams = this.jsonPreview;
        if (JSON.stringify(currentParams) !== JSON.stringify(this.lastParams)) {
          this.requestsService.onFormChange(currentParams); // 👈 استدعاء الدالة
          this.integrationService.updateParameters(currentParams);
          this.lastParams = currentParams;
        }
      });
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
        return 'bg-danger';
      case 404:
        return 'bg-warning';
      case 401:
        return 'bg-info';
      case 200:
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  }

  ngOnDestroy() {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }
}
