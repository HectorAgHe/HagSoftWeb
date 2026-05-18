import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../../../../core/services/catalog.service';
import { ServiceCard } from '../../../../shared/components/service-card/service-card';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [RouterLink, ServiceCard],
  templateUrl: './services-section.html',
  styleUrl: './services-section.css'
})
export class ServicesSection {
  private readonly catalog = inject(CatalogService);

  readonly services = this.catalog.featured;
}
