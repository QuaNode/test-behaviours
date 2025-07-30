import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-services/requests.service';
import { BehaviorService } from '../../../../test-behaviours-core/services/behaviour-services/behaviour.service';

@Component({
  selector: 'app-parameters-and-returns',
  templateUrl: './prameters-and-returns.html',
  styleUrls: ['./prameters-and-returns.scss'],
})
export class ParametersAndReturnsComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  private lastParams: any = null;

  form: FormGroup;
  parametersList: string[] = [];
  typesList = ['String', 'Number', 'Date', 'Object'];
  response = new BehaviorSubject<any>({});

  responseView: 'json' | 'tree' | 'returns' = 'returns';
  returns: any = {};
  returnKeys: string[] = [];
  copied = false;

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
  }

  get parameters(): FormArray {
    return this.form.get('parameters') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      paramName: [''],
      value: [''],
      type: ['String'],
    });
  }

  addRow() {
    this.parameters.push(this.createRow());
  }

  removeRow(index: number) {
    this.parameters.removeAt(index);
  }

  get jsonPreview(): any {
    const params: any = {};
    this.parameters.controls.forEach((control: any) => {
      const paramName = control.get('paramName')?.value;
      const value = control.get('value')?.value;
      if (paramName) {
        params[paramName] = value;
      }
    });
    return params;
  }

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
    }
  }

  onFocus(index: number): void {
    this.activeInputIndex = index;
  }

  isPrimitive(value: any): boolean {
    return value !== Object(value);
  }

  copyJsonToClipboard() {
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
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }
}
