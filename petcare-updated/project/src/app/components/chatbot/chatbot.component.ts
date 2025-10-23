import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product, ShopService } from '../../services/shop.service';
import { CartService, CartItem } from '../../services/cart.service';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  isTyping?: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  isChatOpen = false;
  messages: ChatMessage[] = [];
  userInput = '';
  isBotTyping = false;
  
  private conversationData = {
    "hello": "Hello! I'm PawBot 🐶. I can help you shop or check your order status. Type 'recommend food' or 'order status'!",
    "hi": "Hello! I'm PawBot 🐶. I can help you shop or check your order status. Type 'recommend food' or 'order status'!",
    "recommend food": "I can recommend our top-rated puppy food! Type 'add puppy food' to quickly add it to your cart.",
    "recommend toys": "Sure! Our 'Durable Squeaky Bone' is rated 4.5 stars and is great for play. Explore our Toys category!",
    "order status": "To track your order, please visit the 'Profile' section under 'Orders'.",
    "delivery": "Standard delivery time is 3-5 business days. Express shipping is available at checkout!",
    "add puppy food": "Added **Drools Chicken Puppy Food** to your cart! You now have [COUNT] items. Ready to checkout?",
    "default": "I didn't quite catch that. Try asking about 'food', 'toys', or 'delivery'!"
  };

  constructor(
    private shopService: ShopService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.messages.push({ sender: 'bot', text: "Welcome to PetCare! How can I assist you today? 🐾" });
  }

  toggleChat(): void {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;

    const userMessage = this.userInput.trim();
    this.messages.push({ text: userMessage, sender: 'user' });
    this.userInput = '';
    
    this.processUserQuery(userMessage);
  }

  private processUserQuery(query: string): void {
    this.isBotTyping = true;
    
    setTimeout(() => {
      this.isBotTyping = false;
      
      const lowerQuery = query.toLowerCase();
      let botResponse = this.conversationData.default;
      
      if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
        botResponse = this.conversationData.hello;
      } else if (lowerQuery.includes('recommend food') || lowerQuery.includes('best food')) {
        botResponse = this.conversationData['recommend food'];
      } else if (lowerQuery.includes('recommend toy')) {
        botResponse = this.conversationData['recommend toys'];
      } else if (lowerQuery.includes('order status') || lowerQuery.includes('track')) {
        botResponse = this.conversationData['order status'];
      } else if (lowerQuery.includes('delivery') || lowerQuery.includes('ship')) {
        botResponse = this.conversationData.delivery;
      } else if (lowerQuery.includes('add puppy food')) {
        const product = this.shopService.getProducts().find(p => p.name.includes('Puppy Food'));
        if (product) {
          this.cartService.addToCart(product);
          botResponse = this.conversationData['add puppy food'].replace('[COUNT]', this.getCartCount().toString());
        } else {
          botResponse = "Sorry, I couldn't find that product.";
        }
      }
      
      this.messages.push({ text: botResponse, sender: 'bot' });
    }, 1000); 
  }
  
  getCartCount(): number {
    let count = 0;
    this.cartService.cartItems$.subscribe((items: CartItem[]) => { 
        count = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    });
    return count;
  }
}