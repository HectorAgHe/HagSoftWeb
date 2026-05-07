import { Component, signal } from '@angular/core';
import { Landing } from './features/landing/landing';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';
import { WhatsappBtn } from './shared/components/whatsapp-btn/whatsapp-btn';

@Component({
  selector: 'app-root',
  imports: [Landing, Navbar, Footer, WhatsappBtn],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HagSoftWeb');
}
