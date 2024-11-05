import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  @Input()
  visible = false;
  @Input()
  notFoundMessage = 'Nothing Found!';
  @Input()
  resetLinkText = 'Reset';
  @Input()
  resetLinkRoute = '/';
}
