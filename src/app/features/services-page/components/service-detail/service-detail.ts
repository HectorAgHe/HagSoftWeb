import { Component, input } from '@angular/core';
import { Service } from '../../../../core/models/service.model';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.css'
})
export class ServiceDetail {
  readonly service = input<Service>();
}
