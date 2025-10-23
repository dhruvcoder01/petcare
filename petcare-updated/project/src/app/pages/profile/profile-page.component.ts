import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order, ShopService, User, Pet, Address } from '../../services/shop.service';
import { Router } from '@angular/router';
import { ChatbotComponent } from '../../components/chatbot/chatbot.component';
// --- Data Models ---
// Define the structure for dynamic section loading (Internal Profile Sections)
type ProfileSection = 'profile' | 'pets' | 'orders' | 'addresses' | 'settings';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule,ChatbotComponent],
  templateUrl: './profile-page.component.html', 
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {
  // --- Profile State ---
  activeSection: ProfileSection = 'profile'; // Controls internal profile views
  userData!: User;
  pets: Pet[] = [];
  orders: Order[] = [];
  addresses: Address[] = [];
  
  // Edit Profile Form State
  editMode = false;
  editableUser: Partial<User> = {};
  
  // Address Modal State (NEW)
  showAddressModal = false;
  isEditingAddress = false;
  currentAddress: Partial<Address> = {}; // Used for form input
  
  // Settings State (NEW)
  userSettings = {
      orderEmail: true,
      offersEmail: false,
      darkMode: false // Example setting
  };

  // Order Tracking Status Steps
  statusSteps = [
    { name: 'Ordered', icon: '📝' },
    { name: 'Packed', icon: '📦' },
    { name: 'Shipped', icon: '🚚' },
    { name: 'Out for Delivery', icon: '🏠' },
    { name: 'Delivered', icon: '✅' }
  ];

  constructor(private shopService: ShopService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.userData = this.shopService.getUserData();
    this.pets = this.shopService.getPets();
    this.orders = this.shopService.getOrders();
    this.addresses = this.shopService.getAddresses();
    this.editableUser = { ...this.userData };
  }

  // --- Dashboard/Sidebar Methods ---
  navigateTo(route: string): void {
    if (route === 'logout') {
      this.router.navigate(['/home']);
      return;
    }
    this.router.navigate([`/${route}`]); 
  }
  
  toggleSidebar(): void {
    console.log('Sidebar toggle requested.');
  }
  
  // --- Internal Profile Methods ---
  selectSection(section: ProfileSection): void {
    this.activeSection = section;
    this.editMode = false;
  }
  
  toggleEdit(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.editableUser = { ...this.userData };
    }
  }

  saveProfile(): void {
    this.userData = { ...this.userData, ...this.editableUser };
    this.editMode = false;
    alert('Profile updated successfully! (Mock)');
  }

  addNewPet(): void {
    alert('Form to add new pet is displayed. (Mock)');
  }
  
  reorderProduct(productId: number): void {
      this.router.navigate(['/shop', productId]);
      console.log(`Navigating to product ID ${productId} for re-order.`);
  }

  cancelOrder(orderId: string): void {
      const order = this.orders.find(o => o.id === orderId);
      if (order && order.status !== 'Delivered' && order.status !== 'Cancelled') {
          if (confirm(`Are you sure you want to cancel order ${orderId}?`)) {
              order.status = 'Cancelled';
              alert(`Order ${orderId} has been successfully cancelled.`);
          }
      } else if (order) {
          alert(`Order ${orderId} cannot be cancelled as its status is ${order.status}.`);
      }
  }
  
  // --- Address Management Methods ---
  openAddressModal(address?: Address): void {
      if (address) {
          this.isEditingAddress = true;
          this.currentAddress = { ...address };
      } else {
          this.isEditingAddress = false;
          this.currentAddress = {
              id: '', 
              fullName: '',
              phone: '',
              street: '',
              city: '',
              state: '',
              zipCode: '',
              isDefault: this.addresses.length === 0 
          };
      }
      this.showAddressModal = true;
  }

  closeAddressModal(): void {
      this.showAddressModal = false;
      this.currentAddress = {};
  }

  saveAddress(): void {
      const addressToSave = this.currentAddress as Address;

      if (this.isEditingAddress) {
          this.shopService.editAddress(addressToSave);
          alert('Address updated successfully!');
      } else {
          this.shopService.addAddress(addressToSave);
          alert('New address added successfully!');
      }
      this.loadData(); 
      this.closeAddressModal();
  }

  deleteAddress(addressId: string): void {
      if (confirm('Are you sure you want to delete this address?')) {
          this.shopService.deleteAddress(addressId);
          this.loadData(); 
          alert('Address deleted successfully!');
      }
  }
  
  setDefaultAddress(addressId: string): void {
      const address = this.addresses.find(a => a.id === addressId);
      if (address) {
          const defaultAddress = { ...address, isDefault: true };
          this.shopService.editAddress(defaultAddress); 
          this.loadData();
          alert('Default address set. (Mock)');
      }
  }
  
  // --- Settings Management Methods (NEW) ---
  updateSetting(key: 'orderEmail' | 'offersEmail' | 'darkMode', value: boolean): void {
      this.userSettings[key] = value;
      console.log(`Setting ${key} updated to ${value}`);
      // Note: Actual data persistence would happen in saveSettings or immediately here via service.
  }

  saveSettings(): void {
      // Logic to send this.userSettings to the backend/service
      alert('Account settings saved successfully! (Mock)');
  }
  
  deleteAccount(): void {
      if (confirm('WARNING: Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
          alert('Account deletion process initiated. (Mock)');
          this.router.navigate(['/logout']);
      }
  }

  // --- Utility Methods ---
  getPetsSummary(): { count: number, names: string } {
      const count = this.pets.length;
      const names = this.pets.map(p => p.name).join(', ');
      return { count, names };
  }

  getOrdersSummary(): { delivered: number, inTransit: number, total: number } {
    const delivered = this.orders.filter(o => o.status === 'Delivered').length;
    const inTransit = this.orders.filter(o => ['Shipped', 'Out for Delivery'].includes(o.status)).length;
    return { delivered, inTransit, total: this.orders.length };
  }
  
  isStepCompleted(currentStatus: Order['status'], stepName: string): boolean {
    const statusOrder = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepName);
    if (currentStatus === 'Cancelled') return stepName === 'Ordered';
    return stepIndex <= currentIndex;
  }
  
  getPetAgeString(age: number): string {
      return age > 1 ? `${age} years` : `${age} year`;
  }
  
  getJoinedDateString(): string {
      return this.userData.joinedDate.toLocaleDateString();
  }
  
  getRecommedationText(petName: string): string {
      const pet = this.pets.find(p => p.name === petName);
      if (!pet) return 'No recommendation available.';
      let reco = '';
      if (pet.type === 'Dog' && pet.age < 1) reco = 'High-protein puppy food for bone development.';
      else if (pet.type === 'Cat' && pet.vaccinationStatus === 'due-soon') reco = 'It\'s time to check the Feline Distemper booster!';
      else reco = 'New durable toys just arrived, perfect for chewing!';
      return `AI Reco for ${petName}: ${reco}`;
  }
  
  getEstimatedDelivery(date: Date): string {
      const diff = date.getTime() - new Date().getTime();
      const days = Math.ceil(diff / (1000 * 3600 * 24));
      return days > 0 ? `In ${days} day${days > 1 ? 's' : ''}` : 'Today';
  }
  
  openChatbot(): void {
    console.log('Chatbot opened for help/order tracking.');
  }
}