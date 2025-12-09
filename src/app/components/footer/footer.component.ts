import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  socialLinks = [
    { name: 'Facebook', icon: 'facebook.png' },
    { name: 'RSS', icon: 'rss.png' },
    { name: 'Twitter', icon: 'twitter.png' }
  ];

  openEmail(): void {
    window.location.href = 'mailto:contact@patisserie-delice.fr';
  }

  openPhone(): void {
    window.location.href = 'tel:+33142857693';
  }
}
