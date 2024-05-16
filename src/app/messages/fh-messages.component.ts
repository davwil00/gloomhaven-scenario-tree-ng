import { Component } from "@angular/core";

@Component({
  selector: 'fh-messages',
  templateUrl: './fh-messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class FHMessagesComponent {

  message = "";
  frosthavenInput = true
  revealed: string[] = []

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
    this.frosthavenInput = !this.frosthavenInput
  }
  
  reveal(id: string) {
    this.revealed = [...this.revealed, id]
    console.log('revealing', id)
  }
  
  isRevealed(id: string): boolean {
    return this.revealed.includes(id)
  }

  get letters(): Array<string> {
    return 'abcdefghijklmnopqrstuvwxyz'.split('');
  }

  get numbers(): Array<string> {
    return '0123456789'.split('')
  }
}
