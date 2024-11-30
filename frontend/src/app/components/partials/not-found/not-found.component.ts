import { NgIf } from '@angular/common';
import { booleanAttribute, Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent implements OnInit {
  @Input({ transform: booleanAttribute })
  visible = false;
  @Input()
  notFoundMessage = 'Nothing Found!';
  @Input()
  resetLinkText = 'Reset';
  @Input()
  resetLinkRoute = '/';

  ngOnInit(): void {
    // reintialisation des valeurs par défaut
    // parce que withComponentInputBinding du router les met à undefined
    this.visible = this.visible ?? false;
    this.notFoundMessage = this.notFoundMessage ?? 'Nothing Found!';
    this.resetLinkText = this.resetLinkText ?? 'Reset';
    this.resetLinkRoute = this.resetLinkRoute ?? '/';
  }
}
