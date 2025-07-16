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
  typesList: string[] = [];

  response = signal<any>('');
  responseTime: number = 120;
  responseView: 'json' | 'tree' = 'tree';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      parameters: this.fb.array([]),
    });

    effect(() => {
      const data = this.requestsService.theRequest();

      if (data?.parameters) {
        this.parameters.clear();
        this.parametersList = Object.keys(data.parameters);
        this.typesList = Array.from(new Set(Object.values(data.parameters)));

        Object.entries(data.parameters).forEach(
          ([paramName, paramData]: [string, any]) => {
            const type =
              typeof paramData === 'object' && paramData?.type
                ? paramData.type
                : 'String';
            this.parameters.push(
              this.fb.group({
                paramName: [paramName],
                value: [''],
                type: [type],
              })
            );
          }
        );
        const initialParams = this.jsonPreview;
        this.lastParams = initialParams;
        this.integrationService.updateParameters(initialParams);
      }
    });

    // Ameen Integration
    effect(() => {
      this.response = this.integrationService.responseSignal();
    });
    this.setupFormChanges();
  }

  ngOnInit() {
    this.addRow();
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
    const rawParams = this.parameters.getRawValue();

    rawParams.forEach((row: any) => {
      if (row.paramName) {
        result[row.paramName] = row.value;
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
          this.integrationService.updateParameters(currentParams);
          this.lastParams = currentParams;
        }
      });
  }

  ngOnDestroy() {
    if (this.valueChangesSubscription) {
      this.valueChangesSubscription.unsubscribe();
    }
  }
}
