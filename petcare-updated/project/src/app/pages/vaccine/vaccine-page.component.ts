import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';

import {
  ShopService,
  Pet,
  VaccineRecord,
  VaccineRecommendation
} from '../../services/shop.service'; 

// Define the interface for the modal form data
interface NewRecordForm {
  vaccineName: string;
  dateGiven: string; 
  nextDueDate: string; 
  vetName: string;
}

@Component({
  selector: 'app-vaccine-page',
  standalone: true, 
  // 🔑 FIX: Removed ChatbotComponent import to clear NG8113 warning.
  imports: [CommonModule, FormsModule, DatePipe,ChatbotComponent], 
  templateUrl: './vaccine-page.component.html',
  styleUrls: ['./vaccine-page.component.scss']
})
export class VaccinePageComponent implements OnInit {

  // 🔑 Add 'pets' to the type definition for navigation consistency
  activeSection: 'dashboard' | 'shop' | 'vaccines' | 'vets' | 'profile' | 'logout' | 'pets' = 'vaccines';
  
  // --- Sidebar & Navigation Properties ---
  sidebarCollapsed: boolean = false;

  // --- Data Properties ---
  pets: Pet[] = [];
  selectedPet: Pet | null = null;
  vaccineRecords: VaccineRecord[] = [];
  recommendations: VaccineRecommendation[] = [];

  // --- Modal Properties ---
  showAddModal: boolean = false;
  newRecord: NewRecordForm = this.getInitialNewRecordForm();

  // --- Calculated Properties (Getters for HTML) ---
  get overdueCount(): number {
    return this.vaccineRecords.filter(r => this.isOverdue(r.nextDueDate)).length;
  }

  get dueSoonCount(): number {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

    return this.vaccineRecords.filter(r => {
      const dueDate = new Date(r.nextDueDate);
      return dueDate > today && dueDate <= thirtyDaysFromNow;
    }).length;
  }

  constructor(
    private router: Router,
    private shopService: ShopService 
  ) { }

  ngOnInit(): void {
    this.loadPets();
  }

  // --- Data Loading & Selection ---
  private loadPets(): void {
    this.pets = this.shopService.getPets();
    if (this.pets.length > 0) {
      const defaultPet = this.pets.find(p => p.vaccinationStatus !== 'up-to-date') || this.pets[0];
      this.selectPet(defaultPet.id);
    }
  }

  selectPet(petId: string): void {
    this.selectedPet = this.pets.find(p => p.id === petId) || null;
    this.loadPetData();
  }

  private loadPetData(): void {
    if (this.selectedPet) {
      this.vaccineRecords = this.shopService.getVaccineRecords(this.selectedPet.id);
      this.recommendations = this.shopService.getVaccineRecommendations(this.selectedPet.type);
    } else {
      this.vaccineRecords = [];
      this.recommendations = [];
    }
  }
  
  // --- Utility Methods ---
  isOverdue(nextDueDate: Date): boolean {
    const dueDate = new Date(nextDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    return dueDate < today;
  }

  navigateTo(route: 'dashboard' | 'shop' | 'vaccines' | 'vets' | 'profile' | 'logout' | 'pets'): void {
    this.activeSection = route;

    if (route === 'logout') {
      this.router.navigate(['/home']);
      return;
    }
    
    if (route !== 'vaccines') {
        this.router.navigate([`/${route}`]);
    }
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private getInitialNewRecordForm(): NewRecordForm {
    const today = new Date();
    const oneYearFromNow = new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000);
    return {
      vaccineName: '',
      dateGiven: this.formatDate(today),
      nextDueDate: this.formatDate(oneYearFromNow),
      vetName: ''
    };
  }

  // --- Modal & Form Methods ---
  openAddRecordModal(): void {
    if (this.selectedPet) {
      this.newRecord = this.getInitialNewRecordForm();
      this.showAddModal = true;
    }
  }

  closeAddRecordModal(): void {
    this.showAddModal = false;
  }

  saveVaccineRecord(isValid: boolean): void {
    if (isValid && this.selectedPet) {
      const recordToSave: Omit<VaccineRecord, 'id' | 'status'> = {
        petId: this.selectedPet.id,
        vaccineName: this.newRecord.vaccineName,
        dateGiven: new Date(this.newRecord.dateGiven),
        nextDueDate: new Date(this.newRecord.nextDueDate),
        vetName: this.newRecord.vetName || 'Unknown Vet/Clinic',
      };

      this.shopService.addVaccineRecord(recordToSave);
      this.loadPetData();
      this.closeAddRecordModal();
    }
  }
}
