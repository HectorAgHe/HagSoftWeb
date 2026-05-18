import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Service } from '../../../core/models/service.model';
import { CurrencyMxPipe } from '../../pipes/currency-mx.pipe';

@Component({
  selector: 'app-service-card',
  standalone: true,
  imports: [RouterLink, CurrencyMxPipe],
  templateUrl: './service-card.html',
  styleUrl: './service-card.css'
})
export class ServiceCard {
  readonly service = input.required<Service>();

  /** Toma las primeras 4 features para mostrar en el card. */
  readonly previewFeatures = computed(() =>
    this.service().features.slice(0, 4)
  );
}
