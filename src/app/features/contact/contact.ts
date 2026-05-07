import { Component } from '@angular/core';
import { ContactForm } from './components/contact-form/contact-form';
import { QuoteForm } from './components/quote-form/quote-form';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactForm, QuoteForm],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {}
