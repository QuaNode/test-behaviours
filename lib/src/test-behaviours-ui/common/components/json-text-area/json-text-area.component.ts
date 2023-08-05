import { Component, OnInit,OnChanges,SimpleChanges } from '@angular/core';
import * as ace from 'ace-builds';
import { DataService } from '../../../../../src/test-behaviours-core/services/data-services/data.service';

@Component({
  selector: 'app-json-text-area',
  templateUrl: './json-text-area.component.html',
  styleUrls: ['./json-text-area.component.scss'],
})
<<<<<<< HEAD
export class JsonTextAreaComponent implements OnInit {
=======
export class JsonTextAreaComponent {
>>>>>>> 78e2a9a1f8a29176a8f27d762eb6d49f235f3429
  data: any;
  editor!: ace.Ace.Editor;
constructor(private dataService: DataService){}
  ngOnInit() {
    this.initAceEditor();    
  }
  initAceEditor() {
    this.editor = ace.edit('editor');

<<<<<<< HEAD
    this.editor.setTheme('ace/theme/monokai');
    this.editor.getSession().setMode('ace/mode/javascript');
    this.dataService.sharedData.subscribe((data:any) => {
      if (data !== this.data) {
          this.data = data;
          this.editor.setValue(JSON.stringify(data));
      }
=======
    // => Set editor options
    this.editor.setTheme('ace/theme/monokai'); // Set theme
    this.editor.getSession().setMode('ace/mode/javascript'); // Set language 
    this.dataService.sharedData.subscribe((data:any) => {
      if (data !== this.data) {
          this.data = data;
          this.editor.setValue(JSON.stringify(data)); // Set text 
        }
>>>>>>> 78e2a9a1f8a29176a8f27d762eb6d49f235f3429
  });
  }



}
