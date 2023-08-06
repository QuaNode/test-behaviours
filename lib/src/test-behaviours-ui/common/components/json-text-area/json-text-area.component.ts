import { Component, Input, OnInit } from '@angular/core';
import * as ace from 'ace-builds';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';

@Component({
  selector: 'app-json-text-area',
  templateUrl: './json-text-area.component.html',
  styleUrls: ['./json-text-area.component.scss'],
})
export class JsonTextAreaComponent implements OnInit {
  data: any;
  editor!: ace.Ace.Editor;
  constructor(private dataService: DataService) {}
  ngOnInit() {
    this.initAceEditor();
  }
  initAceEditor() {
    ace.config.set('basePath', 'https://unpkg.com/ace-builds@1.4.12/src-noconflict');
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/monokai');
    this.editor.getSession().setMode('ace/mode/json');
    this.editor.setReadOnly(true)
    this.dataService.sharedData.subscribe((data: any) => {
      if (data !== this.data) {
        this.data = data;
        this.editor.setValue(JSON.stringify(data, null, '\t'));
      }
    });
  }
}
