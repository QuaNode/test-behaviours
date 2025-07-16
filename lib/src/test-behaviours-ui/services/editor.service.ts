import { Injectable } from '@angular/core';
import * as ace from 'ace-builds';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  private createEditor(
    elementId: string,
    fontSize: string = '20px'
  ): ace.Ace.Editor {
    const editor = ace.edit(elementId);
    editor.setFontSize(fontSize);
    return editor;
  }

  initializeReadonlyEditor(elementId: string): ace.Ace.Editor {
    const editor = this.createEditor(elementId);
    editor.setReadOnly(true);
    return editor;
  }

  configureAce() {
    ace.config.set(
      'basePath',
      'https://unpkg.com/ace-builds@1.4.12/src-noconflict'
    );
  }
}
