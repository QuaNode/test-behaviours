import { Component, OnInit } from '@angular/core';
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
    this.editor = ace.edit('editor');
    // => Set editor options
    this.editor.setTheme('ace/theme/monokai'); // Set theme
    this.editor.getSession().setMode('ace/mode/javascript'); // Set language
    this.editor.setReadOnly(true);
    this.editorDataSubscription();
  }
  editorDataSubscription(){
    this.dataService.sharedData.subscribe((data: any) => {
      if (data !== this.data) {
        this.data = data;
        data = JSON.stringify(data, null, 4);
        this.editor.setValue(data);
      }
    });
  }
}
