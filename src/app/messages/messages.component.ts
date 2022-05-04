import { Component } from "@angular/core";

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {

  message = "";

  addLetter(letter: string): void {
    this.message += (letter == '_' ? ' ' : letter);
  }

  clear(): void {
    this.message = '';
  }

  get letters(): Array<string> {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letters.push('_');
    return letters;
  }

  get numbers(): Array<string> {
    return '0123456789'.split('')
  }
}
