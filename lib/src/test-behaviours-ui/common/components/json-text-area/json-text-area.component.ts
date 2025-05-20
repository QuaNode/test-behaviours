import { Component, effect, inject, OnInit } from '@angular/core';
import * as ace from 'ace-builds';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';
import { EditorTextFormat } from '../../../../test-behaviours-core/models/collection';
import { EditorService } from '../../../services/editor.service';

@Component({
    selector: 'app-json-text-area',
    templateUrl: './json-text-area.component.html',
    styleUrls: ['./json-text-area.component.scss'],
    standalone: false
})
export class JsonTextAreaComponent implements OnInit {
  private dataService = inject(DataService);
  private editorService = inject(EditorService);
  multilineEditor!: ace.Ace.Editor;
  readonlyEditor!: ace.Ace.Editor;

  ngOnInit() {
    this.initEditors();
  }

  constructor() {
      effect(() => {
    const data = this.dataService.sharedData();
    if (data && this.isValidData(data)) {
      const paramsJson = JSON.stringify(data.parameters ?? '// No parameters', null, '\t');
      const returnsJson = JSON.stringify(data.returns ??   '// No return values', null, '\t');
      this.multilineEditor.setValue(paramsJson);   // الأسود
      this.readonlyEditor.setValue(returnsJson);   // الأبيض
    }
  });
  }

  private isValidData(data: EditorTextFormat): boolean {
    return !!(data.path || data.version || data.method);
  }

  private initEditors() {
    this.editorService.configureAce();
    this.multilineEditor =
      this.editorService.initializeMultilineEditor('multilineEditor');
    this.readonlyEditor =
      this.editorService.initializeReadonlyEditor('readonlyEditor');
  }
}
