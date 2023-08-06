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
<<<<<<< HEAD
    // => Set editor options
    this.editor.setTheme('ace/theme/monokai'); // Set theme
    this.editor.getSession().setMode('ace/mode/javascript'); // Set language
    this.editor.setReadOnly(true);
    this.editorDataSubscription();
  }
  editorDataSubscription(){
||||||| 18e1085

    this.editor.setTheme('ace/theme/monokai');
    this.editor.getSession().setMode('ace/mode/javascript');
=======
    this.editor.setTheme('ace/theme/monokai');
    this.editor.getSession().setMode('ace/mode/json');
    this.editor.setReadOnly(true)
>>>>>>> e0e3ba1e75f82632c8f6ff7a70bae9bebb7bab73
    this.dataService.sharedData.subscribe((data: any) => {
      if (data !== this.data) {
        this.data = data;
<<<<<<< HEAD
        data = JSON.stringify(data, null, 4);
        this.editor.setValue(data);
||||||| 18e1085
        this.editor.setValue(JSON.stringify(data));
=======
        this.editor.setValue(JSON.stringify(data, null, '\t'));
>>>>>>> e0e3ba1e75f82632c8f6ff7a70bae9bebb7bab73
      }
    });
  }
}
