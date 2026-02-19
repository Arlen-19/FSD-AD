const data = [
  {
    "id": 101,
    "name": "Wireless Bluetooth Headphones",
    "brand": "Sony",
    "category": "Electronics",
    "price": 2999,
    "stock": 45,
    "rating": 4.6,
    "description": "High-quality wireless headphones with noise cancellation."
  },
  {
    "id": 102,
    "name": "Smartphone 5G",
    "brand": "Samsung",
    "category": "Mobiles",
    "price": 24999,
    "stock": 30,
    "rating": 4.7,
    "description": "Latest 5G smartphone with AMOLED display and powerful processor."
  },
  {
    "id": 103,
    "name": "Gaming Laptop",
    "brand": "ASUS",
    "category": "Computers",
    "price": 75999,
    "stock": 12,
    "rating": 4.8,
    "description": "High-performance laptop with RTX graphics for gaming and editing."
  },
  {
    "id": 104,
    "name": "Men's Running Shoes",
    "brand": "Nike",
    "category": "Footwear",
    "price": 4999,
    "stock": 60,
    "rating": 4.5,
    "description": "Comfortable and lightweight running shoes for daily workouts."
  },
  {
    "id": 105,
    "name": "Smart Watch",
    "brand": "Boat",
    "category": "Wearables",
    "price": 1999,
    "stock": 80,
    "rating": 4.4,
    "description": "Fitness tracking smart watch with heart rate monitor."
  },
  {
    "id": 106,
    "name": "Coffee Maker",
    "brand": "Philips",
    "category": "Home Appliances",
    "price": 3499,
    "stock": 25,
    "rating": 4.3,
    "description": "Automatic coffee maker with quick brewing technology."
  },
  {
    "id": 107,
    "name": "Backpack for Travel",
    "brand": "American Tourister",
    "category": "Bags",
    "price": 1599,
    "stock": 100,
    "rating": 4.6,
    "description": "Spacious and durable backpack suitable for travel and college."
  },
  {
    "id": 108,
    "name": "Organic Face Wash",
    "brand": "Mamaearth",
    "category": "Skincare",
    "price": 399,
    "stock": 150,
    "rating": 4.2,
    "description": "Natural and chemical-free face wash for glowing skin."
  },
  {
    "id": 109,
    "name": "Office Chair",
    "brand": "Green Soul",
    "category": "Furniture",
    "price": 8999,
    "stock": 20,
    "rating": 4.7,
    "description": "Ergonomic office chair with lumbar support and adjustable height."
  },
  {
    "id": 110,
    "name": "LED TV 43 inch",
    "brand": "LG",
    "category": "Electronics",
    "price": 32999,
    "stock": 10,
    "rating": 4.8,
    "description": "Full HD Smart LED TV with streaming apps support."
  }
];

data.forEach(product => {
    console.log(`Product ID: ${product.id}`);
    console.log(`Name: ${product.name}`);
    console.log(`Brand: ${product.brand}`);
    console.log(`Category: ${product.category}`);
    console.log(`Price: ₹${product.price}`);
    console.log(`Stock: ${product.stock} units`);
    console.log(`Rating: ${product.rating} stars`);
    console.log(`Description: ${product.description}`);
    console.log('-----------------------------------');
});

console.log("********************************************** Filtered Products **********************************************");


const filterProductsByMinPrice = (products, minPrice) => {
  if (minPrice < 0) {
    console.log('Error: Minimum price cannot be negative.');
    return [];
  }
  
  const filtered = products.filter(product => product.price >= minPrice);
  return filtered;
}

const displayFilteredProducts = (products, minPrice) => {
  console.log(`\n--- Products with minimum price of ₹${minPrice} ---`);
  
  const filtered = filterProductsByMinPrice(products, minPrice);
  
  if (filtered.length === 0) {
    console.log('No products found matching your criteria.');
    return;
  }
  
  filtered.forEach(product => {
    console.log(`${product.name} - ₹${product.price}`);
  });
}

displayFilteredProducts(data, 5000);
