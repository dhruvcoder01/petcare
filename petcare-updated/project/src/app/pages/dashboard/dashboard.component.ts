import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';
// --- Data Models ---

interface Pet {
  id: number;
  photo: string;
  name: string;
  breed: string;
  age: number; // Age in Years (primary mock data)
  gender: 'Male' | 'Female';
  weight: number; 
  microchipId: string; 
  vaccinationStatus: 'up-to-date' | 'due-soon' | 'overdue'; 
  lastVetVisit: string; // ISO date string: 'YYYY-MM-DD'
  notes: string;
}

interface Activity {
  id: number;
  date: string; // ISO date string: 'YYYY-MM-DD'
  petName: string;
  type: 'Vaccination' | 'Medicine' | 'Deworming' | 'Vet Visit' | 'Grooming' | 'New Pet';
  details: string;
  status: 'Completed' | 'Upcoming';
  nextDue?: string; // ISO date string: 'YYYY-MM-DD'
}

@Component({
  
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ChatbotComponent], 
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // --- Component State ---
  userName = 'Alex';
  sidebarCollapsed = false;
  activeSection: 'dashboard' | 'pets' | 'shop' | 'vaccines' | 'vets' | 'profile' = 'dashboard';
  
  // Modal State
  showModal = false;
  modalType: 'addPet' | 'addRecord' | 'addVaccine' = 'addPet';
  modalTitle = 'Add New Pet';
  
  // Form Data Models
  newPet: Partial<Pet> = { gender: 'Male', vaccinationStatus: 'up-to-date' };
  newActivity: Partial<Activity> = { type: 'Vet Visit', status: 'Upcoming' };

  // Daily Tip 
  dailyTips = [
    { emoji: '💡', tip: "Did you know? Cats sleep for about 70% of their lives!" },
    { emoji: '💧', tip: "Ensure your dog has fresh water every 2 hours during summer walks." },
    { emoji: '🐾', tip: "A tired dog is a happy dog. Ensure regular exercise!" },
    { emoji: '🩺', tip: "Always check your pet's paws for cuts or debris after a walk." },
  ];
  dailyTip: { emoji: string; tip: string };
  
  petOwnersName = "Luna's Mom"; 
  
  pets: Pet[] = [
    {
      id: 1,
      photo: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
      name: 'Bruno',
      breed: 'Golden Retriever',
      age: 3,
      gender: 'Male',
      weight: 32.5,
      microchipId: '981000001234567',
      vaccinationStatus: 'up-to-date',
      lastVetVisit: '2025-09-05',
      notes: 'Loves playing fetch. Next deworming due 2025-11-20.'
    },
    {
      id: 2,
      photo: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
      name: 'Whiskers',
      breed: 'Persian Cat',
      age: 2,
      gender: 'Female',
      weight: 4.1,
      microchipId: '981000007654321',
      vaccinationStatus: 'due-soon',
      lastVetVisit: '2025-09-29',
      notes: 'Annual check-up booked for Oct 8th.'
    },
    {
      id: 3,
      photo: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=400',
      name: 'Max',
      breed: 'Labrador',
      age: 5,
      gender: 'Male',
      weight: 35.0,
      microchipId: '981000001122334',
      vaccinationStatus: 'overdue',
      lastVetVisit: '2025-08-01',
      notes: 'Rabies vaccine expired! Need to book booster ASAP.'
    }
  ];

  activities: Activity[] = [
    {
      id: 1,
      date: '2025-10-20',
      petName: 'Bruno',
      type: 'Medicine',
      details: 'Deworming tablet completed (Next: Nov 20, 2025)',
      status: 'Completed',
      nextDue: '2025-11-20'
    },
    {
      id: 2,
      date: '2025-10-08',
      petName: 'Whiskers',
      type: 'Vet Visit',
      details: 'Annual Feline Health Check (Upcoming)',
      status: 'Upcoming',
    },
    {
      id: 3,
      date: '2025-10-05',
      petName: 'Max',
      type: 'Vaccination',
      details: 'Annual Flu Shot (Next: 05 Oct 2026)',
      status: 'Completed',
    },
    {
      id: 4,
      date: '2025-09-01',
      petName: 'Bruno',
      type: 'Grooming',
      details: 'Full Haircut and Nail Trim',
      status: 'Completed',
    }
  ];

  constructor(private router: Router) {
    this.dailyTip = this.dailyTips[Math.floor(Math.random() * this.dailyTips.length)];
  }

  // --- Dynamic Greeting ---
  getGreeting(): string {
    const hour = new Date().getHours();
    let timeOfDay: string;
    
    if (hour < 12) timeOfDay = 'Good Morning';
    else if (hour < 18) timeOfDay = 'Good Afternoon';
    else timeOfDay = 'Good Evening';

    const firstPetName = this.pets[0]?.name || 'Your Pet';
    let extraMessage = '';
    
    if (hour > 20 || hour < 6) { 
        extraMessage = `, ${this.petOwnersName}. Don't forget your last check-up! `;
    } else if (hour > 17) { 
        extraMessage = `, ${this.petOwnersName}. ${firstPetName} might be waiting for his treat 🐾`;
    }

    return `${timeOfDay}, ${this.userName}${extraMessage}`;
  }

  // --- Pet Age and Date Utilities ---

  getPetDetailedAge(ageYears: number): string {
    const monthsInYear = 12;
    const totalMonths = Math.round(ageYears * monthsInYear);
    const years = Math.floor(totalMonths / monthsInYear);
    const months = totalMonths % monthsInYear;
    
    let ageString = '';
    if (years > 0) ageString += `${years} yr${years > 1 ? 's' : ''}`;
    if (months > 0) ageString += `${years > 0 ? ' ' : ''}${months} mo`;
    
    return ageString || 'New Pet';
  }

  getPetHealthChipData(pet: Pet) {
    // Find earliest upcoming activity
    const upcomingActivities = this.activities
        .filter(a => a.petName === pet.name && a.status === 'Upcoming')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
    const nextEvent = upcomingActivities.length > 0 ? upcomingActivities[0].date : 'None Scheduled';

    // Fallback to nextDue if Vaccination/Medicine is completed but has a follow-up
    if (nextEvent === 'None Scheduled') {
        const completedWithDue = this.activities.find(a => a.petName === pet.name && a.status === 'Completed' && a.nextDue);
        if (completedWithDue) {
            return {
                nextEvent: completedWithDue.nextDue,
                lastVetVisit: this.getRelativeTime(pet.lastVetVisit),
                detailedAge: this.getPetDetailedAge(pet.age),
            };
        }
    }

    return {
      nextEvent: nextEvent,
      lastVetVisit: this.getRelativeTime(pet.lastVetVisit),
      detailedAge: this.getPetDetailedAge(pet.age),
    };
  }
  
  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = today.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'In the Future';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays <= 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    if (diffDays <= 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
    
    return 'Over a year ago';
  }

  // --- General & CRUD Methods ---

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  navigateTo(route: string): void {
    if (route === 'logout') {
      this.router.navigate(['/home']);
      return;
    }
    
    // FIX: Use router navigation for dedicated pages, otherwise switch internal section state
    if (route === 'dashboard') {
        this.activeSection = 'dashboard';
    } else if (['shop', 'vaccines', 'vets', 'profile'].includes(route)) {
        this.router.navigate([`/${route}`]); // <--- Direct navigation to dedicated page
    } else {
        // Fallback for internal section change if necessary
        this.activeSection = route as any;
    }
  }

  get healthAlert(): boolean {
    return this.pets.some(p => p.vaccinationStatus !== 'up-to-date');
  }

  openModal(type: 'addPet' | 'addRecord' | 'addVaccine', petName?: string): void {
    this.modalType = type;
    this.showModal = true;

    if (type === 'addPet') {
      this.modalTitle = 'Add New Pet';
      this.newPet = { 
        gender: 'Male', 
        vaccinationStatus: 'up-to-date', 
        photo: 'https://images.pexels.com/photos/10361288/pexels-photo-10361288.jpeg?auto=compress&cs=tinysrgb&w=400',
        age: 1,
        weight: 5.0,
        lastVetVisit: new Date().toISOString().substring(0, 10),
      };
    } else {
      this.modalTitle = type === 'addVaccine' ? 'Add New Vaccine' : 'Add Health Record';
      this.newActivity = { 
        petName: petName || this.pets[0]?.name, 
        date: new Date().toISOString().substring(0, 10), 
        type: type === 'addVaccine' ? 'Vaccination' : 'Vet Visit', 
        status: 'Upcoming' 
      };
    }
  }

  closeModal(): void {
    this.showModal = false;
  }

  submitModal(form: any): void {
    if (form.valid) {
      if (this.modalType === 'addPet') {
        this.addPet(this.newPet as Pet);
      } else {
        this.addActivity(this.newActivity as Activity);
      }
      this.closeModal();
    }
  }

  addPet(pet: Pet): void {
    const newPet: Pet = {
      ...pet,
      id: Date.now(), 
      name: pet.name || 'New Pet',
      photo: pet.photo || 'https://images.pexels.com/photos/10361288/pexels-photo-10361288.jpeg?auto=compress&cs=tinysrgb&w=400',
      vaccinationStatus: pet.vaccinationStatus || 'up-to-date',
      lastVetVisit: pet.lastVetVisit || 'N/A',
      notes: pet.notes || 'No notes added.'
    };
    this.pets = [...this.pets, newPet];
    
    this.activities = [{
        id: Date.now() + 1,
        date: new Date().toISOString().substring(0, 10),
        petName: newPet.name,
        type: 'New Pet',
        details: `Pet ${newPet.name} (${newPet.breed}) was added to your profile.`,
        status: 'Completed'
    }, ...this.activities];
  }

  removePet(petId: number): void {
    const petToRemove = this.pets.find(p => p.id === petId);
    if (confirm(`Are you sure you want to remove ${petToRemove?.name || 'this pet'}?`)) {
      this.pets = this.pets.filter(p => p.id !== petId);
      this.activities = this.activities.filter(a => a.petName !== petToRemove?.name);
    }
  }
  
  addActivity(activity: Activity): void {
      const newActivity: Activity = {
          ...activity,
          id: Date.now(),
          details: activity.details || `${activity.type} for ${activity.petName}`,
          status: activity.status || 'Upcoming'
      };
      this.activities = [newActivity, ...this.activities]; 
  }
  
  removeActivity(activityId: number): void {
    this.activities = this.activities.filter(a => a.id !== activityId);
  }
  
  openChatbot(): void {
    console.log('Chatbot opened');
  }
}