import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDarkMode = false;

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark'); // Add dark mode class to <html>
    } else {
      document.documentElement.classList.remove('dark'); // Remove dark mode class
    }
  }

  getDarkMode(): boolean {
    return this.isDarkMode;
  }
}
