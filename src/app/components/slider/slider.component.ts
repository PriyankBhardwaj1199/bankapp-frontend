import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [NgIf],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css'
})
export class SliderComponent {

  isDarkMode = false;
  currentTheme = '';

  constructor(private themeService: ThemeService) {
    // Sync with the initial theme state
    this.isDarkMode = this.themeService.getDarkMode();
    this.initializeTheme()
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.toggleDarkMode();
  }

  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  setTheme(theme: string): void {
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      this.currentTheme='dark';
    } else if (theme === 'light') {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
      this.currentTheme='light';
    } else {
      // Handle system theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.currentTheme='system';
      if (prefersDark) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
        
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    }

    
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'system';
    this.setTheme(savedTheme);
    this.currentTheme=savedTheme;
    this.isDropdownOpen = false;
  }
}
