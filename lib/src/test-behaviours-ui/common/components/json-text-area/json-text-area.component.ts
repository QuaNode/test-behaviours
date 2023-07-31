import { Component, OnInit } from '@angular/core';
import * as ace from 'ace-builds';

@Component({
  selector: 'app-json-text-area',
  templateUrl: './json-text-area.component.html',
  styleUrls: ['./json-text-area.component.scss'],
})
export class JsonTextAreaComponent {
  json_object = `test`;

  editor!: ace.Ace.Editor;

  ngOnInit() {
    this.initAceEditor();
  }

  initAceEditor() {
    this.editor = ace.edit('editor');

    // => Set editor options
    this.editor.setTheme('ace/theme/monokai'); // Set theme
    this.editor.getSession().setMode('ace/mode/javascript'); // Set language 
    this.editor.setValue(this.json_object); // Set text 
  }
}
