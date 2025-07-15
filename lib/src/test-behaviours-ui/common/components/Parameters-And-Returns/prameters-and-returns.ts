import { Component, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { RequestsService } from '../../../../test-behaviours-core/services/data-services/data.service';

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
  typesList: string[] = [];

  // Response viewer logic
  response: any = null;
  responseTime: number = 120;
  responseView: 'json' | 'tree' = 'tree';

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      parameters: this.fb.array([]),
    });

    // Fetch data from backend
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
      }
    });
  }

  ngOnInit() {
    this.addRow();

    // Mocked response to be shown
    this.response = {
      status: 'success',
      data: {
        id: 1,
        name: 'Martina',
        date: '2025-07-14',
        token: 'abc123xyz',
        roles: ['admin', 'editor'],
      },
    };
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
}
