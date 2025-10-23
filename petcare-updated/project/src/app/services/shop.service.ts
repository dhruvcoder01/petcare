import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs'; // Keep Observable for general return types

// Assume global existence of Firebase/Auth objects if running in a Canvas environment
declare const auth: any;
declare const db: any;

// --- INTERFACES (As provided) ---
export interface Product {
  id: number;
  name: string;
  category: 'Food' | 'Toys' | 'Medicine' | 'Grooming' | 'Accessories';
  petType: 'Dog' | 'Cat' | 'All';
  price: number;
  description: string;
  whyNeed: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  tag: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
}

export interface Pet {
  id: string;
  name: string;
  type: 'Dog' | 'Cat' | 'Bird' | 'Other';
  breed: string;
  age: number; // in years
  gender: string;
  healthNotes?: string;
  photo?: string;
  vaccinationStatus: 'up-to-date' | 'due-soon' | 'overdue';
}

export interface Order {
  id: string;
  products: { id: number, name: string, imageUrl: string, quantity: number }[];
  status: 'Ordered' | 'Packed' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  expectedDelivery: Date;
  orderDate: Date;
  total: number;
  trackingId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  joinedDate: Date;
  loyaltyPoints: number;
  preferredPetType: 'Dog' | 'Cat' | 'All';
}

// --- VET INTERFACE ---
export interface Vet {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  phone: string;
  distance: number;
  openNow: boolean;
  placeId: string;
  website?: string;
}

// --- VACCINE INTERFACES ---
export interface VaccineRecord {
  id: string;
  petId: string;
  vaccineName: string;
  dateGiven: Date;
  nextDueDate: Date;
  vetName: string;
  status: 'Completed' | 'Due Soon' | 'Overdue';
}

export interface VaccineRecommendation {
  name: string;
  species: string;
  frequency: string;
  ageStart: string;
  whyNeeded: string;
}

// --- NEW INTERFACE FOR CART ---
export interface CartItem {
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}


@Injectable({
  providedIn: 'root'
})
export class ShopService {
  // --- MOCK DATA (Retained and used for fallback/initial state) ---
  private mockProducts: Product[] = [
    {
      id: 1, name: 'Drools Chicken Puppy Food', category: 'Food', petType: 'Dog', price: 799,
      description: 'Rich in protein and calcium for healthy puppy growth.',
      whyNeed: 'Promotes muscle development, strengthens bones, and supports healthy digestion with added prebiotics. Essential for the first year of growth.',
      imageUrl: 'https://images.pexels.com/photos/1792613/pexels-photo-1792613.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 4.8, reviews: 150, tag: 'Puppy Essential'
    },
    {
      id: 2, name: 'Durable Squeaky Bone', category: 'Toys', petType: 'Dog', price: 499,
      description: 'Built for power chewers. Floats and is non-toxic.',
      whyNeed: 'Satisfies natural chewing instincts, reduces anxiety, and keeps teeth clean. Perfect for interactive fetch games and safe for strong jaws.',
      imageUrl: 'https://images.pexels.com/photos/2257252/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 4.5, reviews: 85, tag: 'Aggressive Chewer'
    },
    {
      id: 5, name: 'Luxury Cat Tower', category: 'Accessories', petType: 'Cat', price: 3499,
      description: 'Multi-level scratching post and comfortable sleeping areas.',
      whyNeed: "Provides essential vertical territory, encourages exercise, and protects furniture by giving a dedicated scratching surface. Great for multi-cat households.",
      imageUrl: 'https://images.pexels.com/photos/207851/pexels-photo-207851.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 4.6, reviews: 55, tag: "Cat's Haven"
    },
    {
      id: 8, name: 'Beef Jerky Training Treats', category: 'Food', petType: 'Dog', price: 549,
      description: 'High-value, single-ingredient reward for training.',
      whyNeed: 'Motivates pets during training sessions and is easily digestible. High-protein to support sustained energy levels for active dogs.',
      imageUrl: 'https://images.pexels.com/photos/3373944/pexels-photo-3373944.jpeg?auto=compress&cs=tinysrgb&w=1600',
      rating: 4.9, reviews: 300, tag: 'Training Reward'
    },
  ];

  private mockUser: User = {
    id: 'user-001', name: 'Riya Sharma', email: 'riya.sharma@example.com', phone: '9876543210',
    profileImage: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=800',
    joinedDate: new Date('2023-08-15'), loyaltyPoints: 1250, preferredPetType: 'Dog'
  };

  private mockPets: Pet[] = [
    { id: 'pet-001', name: 'Nova', type: 'Dog', breed: 'Golden Retriever', age: 3, gender: 'Female', healthNotes: 'Allergic to chicken proteins.', photo: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=800', vaccinationStatus: 'up-to-date' },
    { id: 'pet-002', name: 'Milo', type: 'Cat', breed: 'Persian', age: 1, gender: 'Male', healthNotes: 'Needs daily brushing for coat health.', photo: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=800', vaccinationStatus: 'due-soon' }
  ];

  private mockAddresses: Address[] = [
    { id: 'addr-001', fullName: 'Riya Sharma', phone: '9876543210', street: '12, Blossom Lane, Apartment #4B', city: 'Petville', state: 'Maharashtra', zipCode: '400001', isDefault: true, latitude: 19.0760, longitude: 72.8777 },
    { id: 'addr-002', fullName: 'Riya Sharma (Office)', phone: '9999999999', street: 'Tower 5, Tech Park, Office 101', city: 'Business City', state: 'Maharashtra', zipCode: '400002', isDefault: false, latitude: 19.0800, longitude: 72.9000 }
  ];

  private mockOrders: Order[] = [
    { id: 'ORD-9001', products: [{ id: 1, name: 'Drools Chicken Puppy Food', imageUrl: '...', quantity: 2 }], status: 'Out for Delivery', expectedDelivery: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), orderDate: new Date('2025-01-01'), total: 2097.00, trackingId: 'TRK-245890-IND' },
    { id: 'ORD-7711', products: [{ id: 8, name: 'Beef Jerky Training Treats', imageUrl: '...', quantity: 3 }], status: 'Delivered', expectedDelivery: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), orderDate: new Date('2024-12-01'), total: 1647.00, trackingId: 'TRK-990011-IND' },
  ];

  private mockVets: Vet[] = [
    { id: 'vet-101', name: "Dr. Pet's Multispecialty Hospital", address: '1.2 km away, Mumbai', latitude: 19.0765, longitude: 72.8780, rating: 4.8, phone: '9876543211', distance: 1.2, openNow: true, placeId: 'ChIJjQkQJk4R5zsR3k2U', website: 'https://drpetshospital.in/' },
    { id: 'vet-103', name: 'Happy Paws Veterinary (Jalandhar)', address: '4.1 km away, Jalandhar', latitude: 31.3270, longitude: 75.5780, rating: 4.1, phone: '9876543213', distance: 4.1, openNow: true, placeId: 'ChIJKgkQJk4R5zsR3k2U', website: 'https://happypawsvet.in/' },
  ];

  private mockVetsPatna: Vet[] = [
    { id: 'vet-201', name: 'Patna Pet Wellness Center', address: '1.0 km, Boring Road, Patna', latitude: 25.5945, longitude: 85.1380, rating: 4.7, phone: '9123456701', distance: 1.0, openNow: true, placeId: 'PATNA101', website: 'https://patnawellness.in/' },
    { id: 'vet-202', name: 'Kankarbagh Veterinary Clinic', address: '4.5 km, Kankarbagh, Patna', latitude: 25.6000, longitude: 85.1500, rating: 4.2, phone: '9123456702', distance: 4.5, openNow: false, placeId: 'PATNA102', website: 'https://kankarbaghvet.in/' }
  ];

  private mockVaccineRecords: VaccineRecord[] = [
    { id: 'rec-001', petId: 'pet-001', vaccineName: 'Rabies', dateGiven: new Date('2025-01-10'), nextDueDate: new Date('2026-01-10'), vetName: "Dr. Pet's Hospital", status: 'Completed' },
    { id: 'rec-003', petId: 'pet-001', vaccineName: 'Bordetella', dateGiven: new Date('2025-08-01'), nextDueDate: new Date('2025-11-01'), vetName: "Dr. Pet's Hospital", status: 'Due Soon' },
    { id: 'rec-004', petId: 'pet-002', vaccineName: 'FVRCP (Annual)', dateGiven: new Date('2024-10-20'), nextDueDate: new Date('2025-10-20'), vetName: 'Local Vet', status: 'Overdue' }
  ];

  private mockVaccineRecommendations: VaccineRecommendation[] = [
    { name: 'Rabies', species: 'Dog', frequency: 'Annually', ageStart: '3 months', whyNeeded: 'Prevents a fatal viral disease transferable to humans. Mandatory in many states.' },
    { name: 'DHLPP', species: 'Dog', frequency: 'Annually', ageStart: '6-8 weeks', whyNeeded: 'Core vaccine protecting against Distemper, Hepatitis, Leptospirosis, Parainfluenza, and Parvovirus.' },
    { name: 'FVRCP', species: 'Cat', frequency: 'Annually', ageStart: '6-8 weeks', whyNeeded: 'Core vaccine protecting against Feline Viral Rhinotracheitis, Calicivirus, and Panleukopenia.' },
    { name: 'FeLV', species: 'Cat', frequency: 'Annually', ageStart: '9 weeks', whyNeeded: 'Feline Leukemia Virus. Highly recommended for cats who go outdoors.' },
  ];

  // --- CART STATE MANAGEMENT ---
  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>(this.cartItems);
  public cart$: Observable<CartItem[]> = this.cartSubject.asObservable();
  public cartTotalSubject = new BehaviorSubject<number>(0);
  public cartTotal$: Observable<number> = this.cartTotalSubject.asObservable();

  constructor() {
    this.updateCartTotal();
  }

  // --- GETTERS (Mock data used for other profile components) ---
  getProducts(): Product[] { return this.mockProducts; }
  getUserData(): User { return this.mockUser; }
  getOrders(): Order[] { return this.mockOrders; }
  getAddresses(): Address[] { return this.mockAddresses; }

  // --- PET CRUD ---
  getPets(): Pet[] {
    return [...this.mockPets]; // Return a copy to prevent external modification
  }

  addPet(newPet: Omit<Pet, 'id' | 'vaccinationStatus'>): void {
    const newId = 'pet-' + (this.mockPets.length + 1).toString().padStart(3, '0');
    const pet: Pet = {
      ...newPet,
      id: newId,
      // Default to up-to-date upon creation for simplicity
      vaccinationStatus: 'up-to-date'
    } as Pet;
    this.mockPets.push(pet);
  }

  updatePet(updatedPet: Pet): void {
    const index = this.mockPets.findIndex(p => p.id === updatedPet.id);
    if (index !== -1) {
      this.mockPets[index] = updatedPet;
    }
  }

  // --- VACCINE METHODS ---
  getVaccineRecommendations(species: Pet['type']): VaccineRecommendation[] {
    return this.mockVaccineRecommendations.filter(r => r.species.toLowerCase() === species.toLowerCase());
  }

  getVaccineRecords(petId: string): VaccineRecord[] {
    return this.mockVaccineRecords.filter(r => r.petId === petId).sort((a, b) => b.dateGiven.getTime() - a.dateGiven.getTime());
  }

  addVaccineRecord(record: Omit<VaccineRecord, 'id' | 'status'>): void {
    const newId = 'rec-' + (this.mockVaccineRecords.length + 1);
    // Recalculate status based on logic
    const status: VaccineRecord['status'] = new Date(record.nextDueDate).getTime() < new Date().getTime()
      ? 'Overdue'
      : (new Date(record.nextDueDate).getTime() < new Date().getTime() + 30 * 24 * 60 * 60 * 1000 ? 'Due Soon' : 'Completed');

    const newRecord: VaccineRecord = { ...record, id: newId, status: status } as VaccineRecord;
    this.mockVaccineRecords.push(newRecord);

    // OPTIONAL: Update the pet's top-level vaccinationStatus
    const pet = this.mockPets.find(p => p.id === record.petId);
    if (pet) {
      pet.vaccinationStatus = status === 'Overdue' ? 'overdue' : (status === 'Due Soon' ? 'due-soon' : 'up-to-date');
    }
  }

  // --- CART METHODS ---
  private updateCartTotal(): void {
    const total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    this.cartTotalSubject.next(total);
  }

  addToCart(product: Product, quantity: number = 1): void {
    const existingItem = this.cartItems.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity
      });
    }

    this.cartSubject.next(this.cartItems);
    this.updateCartTotal();
  }

  updateCartItemQuantity(productId: number, quantity: number): void {
    const item = this.cartItems.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        this.cartSubject.next(this.cartItems);
        this.updateCartTotal();
      }
    }
  }

  removeFromCart(productId: number): void {
    this.cartItems = this.cartItems.filter(item => item.productId !== productId);
    this.cartSubject.next(this.cartItems);
    this.updateCartTotal();
  }

  clearCart(): void {
    this.cartItems = [];
    this.cartSubject.next(this.cartItems);
    this.updateCartTotal();
  }


  // --- REAL BACKEND INTEGRATION METHODS (VETS) ---

  async getDefaultAddress(): Promise<Address | undefined> {
    return Promise.resolve(this.mockAddresses.find(a => a.isDefault));
  }

  // FIX: This method uses Gemini to find real vets via Google Search/Places API proxy
  async getVets(locationQuery: string, radius: number, lat?: number, lng?: number): Promise<Vet[]> {
    const apiKey = ""; // Canvas environment provides the API key in runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    console.log(`[API Call] Searching for real vets near: ${locationQuery} (Radius: ${radius}km)`);

    const userPrompt = `Find 5 real veterinary clinics in India near the location "${locationQuery}", along with their exact name, address, latitude, longitude, rating (between 4.0 and 5.0), phone number (use a valid Indian 10-digit number format), placeId, and a website URL if available. Prioritize results within a ${radius}km radius.`;

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      tools: [{ "google_search": {} }],
      systemInstruction: { parts: [{ text: "You are a specialized search agent. Always respond strictly in the requested JSON format based on Google Search results." }] },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              id: { type: "STRING" },
              name: { type: "STRING" },
              address: { type: "STRING" },
              latitude: { type: "NUMBER" },
              longitude: { type: "NUMBER" },
              rating: { type: "NUMBER" },
              phone: { type: "STRING" },
              placeId: { type: "STRING" },
              website: { type: "STRING" },
            },
            required: ["id", "name", "address", "latitude", "longitude", "rating", "phone", "placeId"]
          }
        }
      }
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (jsonText) {
        const apiVets: Vet[] = JSON.parse(jsonText);
        // Clean up data and mock distance/openNow
        return apiVets.map((v, index) => ({
          ...v,
          id: v.id || `api-vet-${index}`,
          distance: parseFloat((Math.random() * radius).toFixed(1)),
          openNow: Math.random() > 0.5,
        }));
      }
      console.error("Gemini API returned no usable JSON. Falling back to mock data.");

      // FALLBACK LOGIC
      const queryLower = locationQuery.toLowerCase();
      if (queryLower.includes('patna')) return this.mockVetsPatna;
      return this.mockVets;

    } catch (error) {
      console.error("API Fetch failed. Falling back to mock data:", error);

      // FALLBACK LOGIC
      const queryLower = locationQuery.toLowerCase();
      if (queryLower.includes('patna')) return this.mockVetsPatna;
      return this.mockVets;
    }
  }

  // --- ADDRESS CRUD METHODS (Retained) ---
  addAddress(newAddress: Omit<Address, 'id'>): void {
    const newIndex = this.mockAddresses.length + 1;
    const id = 'addr-' + newIndex.toString().padStart(3, '0');

    if (newAddress.isDefault) {
      this.mockAddresses.forEach(a => a.isDefault = false);
    }

    const address: Address = { ...newAddress, id: id } as Address;
    this.mockAddresses.push(address);
  }

  editAddress(updatedAddress: Address): void {
    if (!updatedAddress.id) {
      console.error("Cannot edit address: ID is missing.");
      return;
    }

    const index = this.mockAddresses.findIndex(a => a.id === updatedAddress.id);
    if (index !== -1) {
      if (updatedAddress.isDefault) {
        this.mockAddresses.forEach(a => a.isDefault = false);
      }
      this.mockAddresses[index] = updatedAddress;
    }
  }

  deleteAddress(addressId: string): void {
    const index = this.mockAddresses.findIndex(a => a.id === addressId);
    if (index !== -1) {
      const wasDefault = this.mockAddresses[index].isDefault;
      this.mockAddresses.splice(index, 1);
      if (wasDefault && this.mockAddresses.length > 0) {
        this.mockAddresses[0].isDefault = true; // Set first address as new default
      }
    }
  }
}