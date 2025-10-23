import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../services/shop.service';

interface FilterState {
  category: string;
  petType: string;
  sortBy: string;
}

@Component({
  selector: 'app-filter-sort',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-sort-container">
      <div class="filter-group">
        <label for="category">Category</label>
        <select id="category" [(ngModel)]="filters.category" (change)="applyFilters()">
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Toys">Toys</option>
          <option value="Medicine">Medicine</option>
          <option value="Grooming">Grooming</option>
          <option value="Accessories">Accessories</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="petType">Pet Type</label>
        <select id="petType" [(ngModel)]="filters.petType" (change)="applyFilters()">
          <option value="All">All Pets</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
        </select>
      </div>
      
      <div class="filter-group">
        <label for="sortBy">Sort By</label>
        <select id="sortBy" [(ngModel)]="filters.sortBy" (change)="applyFilters()">
          <option value="popularity">Popularity</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
    </div>
  `,
  styles: [`
    .filter-sort-container {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
      background-color: #FAF6F1;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      margin-bottom: 2rem;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
    }
    label {
      font-size: 0.9rem;
      font-weight: 600;
      color: #6D4C41;
      margin-bottom: 0.4rem;
    }
    select {
      padding: 0.6rem 1rem;
      border-radius: 6px;
      border: 1px solid #D7CCC8;
      background-color: white;
      font-size: 1rem;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    select:focus {
      outline: none;
      border-color: #3E2723;
    }
    @media (max-width: 768px) {
      .filter-sort-container {
        flex-direction: column;
      }
      .filter-group {
        width: 100%;
      }
    }
  `]
})
export class FilterSortComponent implements OnInit {
  @Output() filterChanged = new EventEmitter<FilterState>();

  filters: FilterState = {
    category: 'All',
    petType: 'All',
    sortBy: 'popularity'
  };

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filterChanged.emit(this.filters);
  }
}