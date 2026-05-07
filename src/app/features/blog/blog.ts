import { Component } from '@angular/core';
import { PostList } from './components/post-list/post-list';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [PostList],
  templateUrl: './blog.html',
  styleUrl: './blog.css'
})
export class Blog {}
