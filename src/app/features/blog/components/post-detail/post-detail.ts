import { Component, input } from '@angular/core';
import { BlogPost } from '../../../../core/models/blog-post.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [],
  templateUrl: './post-detail.html',
  styleUrl: './post-detail.css'
})
export class PostDetail {
  readonly post = input<BlogPost>();
}
