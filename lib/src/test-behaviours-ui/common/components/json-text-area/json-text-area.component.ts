import { Component, OnInit,OnChanges,SimpleChanges } from '@angular/core';
import * as ace from 'ace-builds';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';

@Component({
  selector: 'app-json-text-area',
  templateUrl: './json-text-area.component.html',
  styleUrls: ['./json-text-area.component.scss'],
})
export class JsonTextAreaComponent {
json_object = this.dataService.sharedData;

  editor!: ace.Ace.Editor;
constructor(public dataService: DataService){}
  ngOnInit() {
    this.initAceEditor();    
  }
  initAceEditor() {
    this.editor = ace.edit('editor');

    // => Set editor options
    this.editor.setTheme('ace/theme/monokai'); // Set theme
    this.editor.getSession().setMode('ace/mode/javascript'); // Set language 
    this.editor.setValue(this.dataService.sharedData); // Set text 
  }
  log(){
    console.log(JSON.stringify(this.dataService.sharedData));
    this.editor.setValue(JSON.stringify(this.dataService.sharedData));
  }


}
