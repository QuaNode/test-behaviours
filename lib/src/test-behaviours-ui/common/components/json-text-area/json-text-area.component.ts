import { Component, effect, inject, OnInit } from '@angular/core';
import * as ace from 'ace-builds';
import { RequestsService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';
import { BehavioursResponse } from '../../../../test-behaviours-core/models/collection';
import { EditorService } from '../../../services/editor.service';

@Component({
  selector: 'app-json-text-area',
  templateUrl: './json-text-area.component.html',
  styleUrls: ['./json-text-area.component.scss'],
  standalone: false,
})
export class JsonTextAreaComponent implements OnInit {
  private requestsService = inject(RequestsService);

  private editorService = inject(EditorService);

  multilineEditor!: ace.Ace.Editor;
  readonlyEditor!: ace.Ace.Editor;

  ngOnInit() {
    this.initEditors();
  }

  constructor() {

    effect(() => {
      const data = this.requestsService.theRequest();
      if (data && this.isValidData(data)) {
        const paramsJson = JSON.stringify(
          data.parameters ?? '// No parameters',
          null,
          '\t'
        );
        const returnsJson = JSON.stringify(
          data.returns ?? '// No return values',
          null,
          '\t'
        );
        this.multilineEditor.setValue(paramsJson); // الأسود
        this.readonlyEditor.setValue(returnsJson); // الأبيض
      }
    });
  }

  private isValidData(data: BehavioursResponse): boolean {
    return !!(data.parameters || data.returns || data.name);
  }

  private initEditors() {
    this.editorService.configureAce();
    this.multilineEditor =
      this.editorService.initializeMultilineEditor('multilineEditor');
    this.readonlyEditor =
      this.editorService.initializeReadonlyEditor('readonlyEditor');
  }
}
