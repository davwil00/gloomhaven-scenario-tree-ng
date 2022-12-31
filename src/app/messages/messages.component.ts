import { Component } from "@angular/core";

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {

  message = "";
  gloomhavenInput = true

  addLetter(letter: string): void {
    this.message += (letter == '_' ? ' ' : letter);
  }

  removeLetter(): void {
    if (this.message.length > 0) {
      this.message = this.message.substring(0, this.message.length - 1)
    }
  }

  clear(): void {
    this.message = '';
  }

  toggleInputMethod() {
    this.gloomhavenInput = !this.gloomhavenInput
  }

  get letters(): Array<string> {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  }

  get numbers(): Array<string> {
    return '0123456789'.split('')
  }
}
