import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ShopPageComponent } from './pages/shop-page/shop-page.component';
import { ProfilePageComponent } from './pages/profile/profile-page.component';
import { VetsPageComponent } from './pages/vets/vets-page.component';
import { VaccinePageComponent } from './pages/vaccine/vaccine-page.component'; // FIX: Ensures correct import

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },

  // --- Main Application Pages ---
  { path: 'dashboard', component: DashboardComponent },
  
  // Shop Routes
  { path: 'shop', component: ShopPageComponent },
  { path: 'shop/:id', component: ShopPageComponent },

  // Profile/Order Tracking Route
  { path: 'profile', component: ProfilePageComponent },
  
  // Vets Route
  { path: 'vets', component: VetsPageComponent }, 
  
  // Vaccines Route
  { path: 'vaccines', component: VaccinePageComponent }, 

  // --- Placeholder / Static Pages ---
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent }
];
