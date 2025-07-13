import { Component, effect, inject, OnInit } from '@angular/core';
import * as ace from 'ace-builds';
import { RequestsService } from '../../../../test-behaviours-core/services/data-services/data.service';
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
returns: any = {};
  returnKeys: string[] = [];
  // multilineEditor!: ace.Ace.Editor;
  readonlyEditor!: ace.Ace.Editor;

  ngOnInit() {
    this.initEditors();
  }

  constructor() {
    effect(() => {
    const data = this.requestsService.theRequest();
    if (data && this.requestsService.isValidData()) {
      this.returns = data.returns ?? { message: '// No return values' };
      this.returnKeys = Object.keys(this.returns);

      // Only set the editor value if it is initialized
      if (this.readonlyEditor) {
        const returnsJson = JSON.stringify(this.returns, null, '\t');
        this.readonlyEditor.setValue(returnsJson, -1); // -1 keeps cursor at start
      }
    }
  });
  }

  private initEditors() {
    this.editorService.configureAce();
    // this.multilineEditor =
    //   this.editorService.initializeMultilineEditor('multilineEditor');
    this.readonlyEditor =
      this.editorService.initializeReadonlyEditor('readonlyEditor');
  }
}
