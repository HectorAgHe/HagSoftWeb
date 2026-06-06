import { Component } from '@angular/core';
import { ContactForm } from './components/contact-form/contact-form';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ContactForm],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {}
