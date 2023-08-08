import { Component, OnInit } from '@angular/core';
import * as ace from 'ace-builds';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';

@Component({
  selector: 'app-json-text-area',
  templateUrl: './json-text-area.component.html',
  styleUrls: ['./json-text-area.component.scss'],
})
export class JsonTextAreaComponent implements OnInit {
  multilineEditor!: ace.Ace.Editor;
  readonlyEditor!: ace.Ace.Editor;
  constructor(private dataService: DataService) {}

  multilineText: any;
  readonlyText: any;
  ngOnInit() {
    this.initAceEditor();
  }
  initAceEditor() {
    ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.4.12/src-noconflict'
    );
    this.multilineEditor = ace.edit('multilineEditor');
    this.multilineEditor.setTheme('ace/theme/monokai');
    this.multilineEditor.getSession().setMode('ace/mode/json');
    this.multilineEditor.setFontSize('20px');
    this.dataService.sharedData.subscribe((data: any) => {
      if (data !== this.multilineText) {
        this.multilineText = data;
        this.multilineEditor.setValue(
          JSON.stringify(this.multilineText, null, '\t')
        );
      }
    });

    this.readonlyEditor = ace.edit('readonlyEditor');
    this.readonlyEditor.setReadOnly(true);
    this.readonlyEditor.setFontSize('20px');
    this.dataService.sharedData.subscribe((data: any) => {
      if (data !== this.readonlyText) {
        this.readonlyText = data;
        this.readonlyEditor.setValue(
          JSON.stringify(this.readonlyText, null, '\t')
        );
      }
    });
  }
}
