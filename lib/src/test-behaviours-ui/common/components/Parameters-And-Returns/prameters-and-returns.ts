
import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RequestsService } from '../../../../test-behaviours-core/services/requests-services/requests.service';

type ParameterDefinition = {
  type: string;
  middleware?: boolean;
};

@Component({
  selector: 'app-parameters-and-returns',
  templateUrl: './prameters-and-returns.html',
  styleUrls: ['./prameters-and-returns.scss'],
  standalone: false,
})
export class ParametersAndReturnsComponent implements OnInit {
  private requestsService = inject(RequestsService);

  form: FormGroup;
  parametersList: string[] = [];
  typesList: string[] = ['String', 'Number', 'Date', 'Object'];
  response: any = null;
  returns: any = {};
  returnKeys: string[] = [];
  responseTime: number = 120;
  responseView: 'returns' | 'json' | 'tree' = 'returns';
  valueTouched: boolean = false;
  currentView: 'json' | 'table' = 'json';
  copied = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      parameters: this.fb.array([]),
    });

    //  Reactive effect for backend data
    effect(() => {
      const data = this.requestsService.theRequest();

      if (data?.parameters) {
        console.log('Filtered Parameters:', data.parameters);
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
        });
      }
    });
  }

  ngOnInit() {
    this.addRow();

    //  Dummy response (replace with API response later)
    this.response = {
      status: 'success',
      returns: {
        user: {
          id: 1,
          name: 'Martina',
          token: 'abc123xyz',
          roles: ['admin', 'editor'],
        },
        timestamp: new Date().toISOString(),
      },
    };

    this.parameters.controls.forEach((control) => {
      const group = control as FormGroup;
      group.get('value')?.valueChanges.subscribe((val) => {
        const type = group.get('type')?.value;

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
    if (this.response?.returns) {
      this.returns = this.response.returns;
      this.returnKeys = Object.keys(this.returns);
    }
  }

  get parameters(): FormArray {
    return this.form.get('parameters') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({
      paramName: [{ value: '', disabled: false }],
      value: [''],
      type: [{ value: '', disabled: false }],
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
              console.error(`Invalid JSON for parameter ${paramName}:`, e);
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

  isPrimitive(value: any): boolean {
    return typeof value !== 'object' || value === null;
  }

  isValidJson(index: number): boolean {
    const value = this.parameters.at(index).get('value')?.value;
    const type = this.parameters.at(index).get('type')?.value;
    console.log(
      `Validating index ${index} with value:`,
      value,
      'and type:',
      type
    );

    if (type !== 'Object') return true;

    try {
      const parsed = JSON.parse(value);
      return (
        typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      );
    } catch {
      return false;
    }
  }

  // copy JSON to clipboard
  copyJsonToClipboard() {
    const jsonString = JSON.stringify(this.response, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    });
  }
}
