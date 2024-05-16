import { Component } from "@angular/core";

@Component({
  selector: 'fh-messages',
  templateUrl: './fh-messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class FHMessagesComponent {

  message = "";
  revealed: string[] = []

  addLetter(letter: string): void {
    this.message += (letter == '_' ? ' ' : letter);
  }

  clear(): void {
    this.message = '';
  }
  
  reveal(id: string) {
    this.revealed = [...this.revealed, id]
    console.log('revealing', id)
  }
  
  isRevealed(id: string): boolean {
    return this.revealed.includes(id)
  }

  get letters(): Array<string> {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    letters.push('_');
    return letters;
  }

  get numbers(): Array<string> {
    return '0123456789'.split('')
  }
}
