import React from "react";
import CategoryPageLayout from "@/components/category/CategoryPageLayout";
import type { Product } from "@/hooks/useCategoryPage";

// Mock data - Replace with API call later
// Using placeholder images - Replace with actual farmer image URLs from API
const mockProducts: Product[] = [
  { _id: "1", name: "Fresh Basil", price: 180, unit: "Kg", sellerName: "Ali Ahmad", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliAhmad", location: "Lahore, Punjab", rating: 4.7 },
  { _id: "2", name: "Organic Cilantro", price: 120, unit: "Kg", sellerName: "Muhammad Islam", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=MuhammadIslam", location: "Faisalabad, Punjab", rating: 4.8 },
  { _id: "3", name: "Fresh Parsley", price: 150, unit: "Kg", sellerName: "Hassan Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HassanAli", location: "Multan, Punjab", rating: 4.9 },
  { _id: "4", name: "Organic Mint", price: 100, unit: "Kg", sellerName: "Ahmed Khan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedKhan", location: "Rawalpindi, Punjab", rating: 4.6 },
  { _id: "5", name: "Fresh Oregano", price: 200, unit: "Kg", sellerName: "Zain Malik", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZainMalik", location: "Sargodha, Punjab", rating: 4.7 },
  { _id: "6", name: "Organic Thyme", price: 220, unit: "Kg", sellerName: "Bilal Hassan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=BilalHassan", location: "Gujranwala, Punjab", rating: 4.8 },
  { _id: "7", name: "Fresh Rosemary", price: 250, unit: "Kg", sellerName: "Riaz Hussain", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=RiazHussain", location: "Nokot, Mansehra", rating: 4.9 },
  { _id: "8", name: "Organic Sage", price: 280, unit: "Kg", sellerName: "Saad Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=SaadAli", location: "Sheikhupura, Punjab", rating: 4.7 },
  { _id: "9", name: "Fresh Dill", price: 160, unit: "Kg", sellerName: "Taha Ahmed", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=TahaAhmed", location: "Sialkot, Punjab", rating: 4.6 },
  { _id: "10", name: "Organic Chives", price: 190, unit: "Kg", sellerName: "Hamza Khan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HamzaKhan", location: "Jhang, Punjab", rating: 4.8 },
  { _id: "11", name: "Fresh Coriander Seeds", price: 140, unit: "Kg", sellerName: "Faisal Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=FaisalAli", location: "Sahiwal, Punjab", rating: 4.7 },
  { _id: "12", name: "Organic Cumin Seeds", price: 130, unit: "Kg", sellerName: "Yousuf Malik", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=YousufMalik", location: "Bahawalpur, Punjab", rating: 4.9 },
  { _id: "13", name: "Fresh Fenugreek Leaves", price: 110, unit: "Kg", sellerName: "Ali Ahmad", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliAhmad2", location: "Lahore, Punjab", rating: 4.6 },
  { _id: "14", name: "Organic Curry Leaves", price: 170, unit: "Kg", sellerName: "Muhammad Islam", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=MuhammadIslam2", location: "Faisalabad, Punjab", rating: 4.8 },
  { _id: "15", name: "Fresh Bay Leaves", price: 240, unit: "Kg", sellerName: "Hassan Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HassanAli2", location: "Multan, Punjab", rating: 4.7 },
  { _id: "16", name: "Organic Fennel Seeds", price: 160, unit: "Kg", sellerName: "Ahmed Khan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedKhan2", location: "Rawalpindi, Punjab", rating: 4.6 },
  { _id: "17", name: "Fresh Mustard Seeds", price: 120, unit: "Kg", sellerName: "Zain Malik", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZainMalik2", location: "Sargodha, Punjab", rating: 4.7 },
  { _id: "18", name: "Organic Turmeric", price: 300, unit: "Kg", sellerName: "Bilal Hassan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=BilalHassan2", location: "Gujranwala, Punjab", rating: 4.9 },
  { _id: "19", name: "Fresh Cardamom", price: 350, unit: "Kg", sellerName: "Umar Farooq", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=UmarFarooq2", location: "Kasur, Punjab", rating: 4.8 },
  { _id: "20", name: "Organic Cloves", price: 380, unit: "Kg", sellerName: "Saad Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=SaadAli2", location: "Sheikhupura, Punjab", rating: 4.9 },
  { _id: "21", name: "Fresh Cinnamon Sticks", price: 320, unit: "Kg", sellerName: "Taha Ahmed", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=TahaAhmed2", location: "Sialkot, Punjab", rating: 4.7 },
  { _id: "22", name: "Organic Black Pepper", price: 280, unit: "Kg", sellerName: "Hamza Khan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HamzaKhan2", location: "Jhang, Punjab", rating: 4.8 },
  { _id: "23", name: "Fresh Star Anise", price: 360, unit: "Kg", sellerName: "Faisal Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=FaisalAli2", location: "Sahiwal, Punjab", rating: 4.7 },
  { _id: "24", name: "Organic Nutmeg", price: 400, unit: "Kg", sellerName: "Yousuf Malik", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=YousufMalik2", location: "Bahawalpur, Punjab", rating: 4.9 },
  { _id: "25", name: "Fresh Mace", price: 420, unit: "Kg", sellerName: "Ali Ahmad", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AliAhmad3", location: "Lahore, Punjab", rating: 4.8 },
  { _id: "26", name: "Organic Coriander Powder", price: 150, unit: "Kg", sellerName: "Muhammad Islam", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=MuhammadIslam3", location: "Faisalabad, Punjab", rating: 4.7 },
  { _id: "27", name: "Fresh Turmeric Powder", price: 310, unit: "Kg", sellerName: "Hassan Ali", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=HassanAli3", location: "Multan, Punjab", rating: 4.8 },
  { _id: "28", name: "Organic Red Chili Powder", price: 200, unit: "Kg", sellerName: "Ahmed Khan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=AhmedKhan3", location: "Rawalpindi, Punjab", rating: 4.9 },
  { _id: "29", name: "Fresh Garam Masala", price: 340, unit: "Kg", sellerName: "Zain Malik", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=ZainMalik3", location: "Sargodha, Punjab", rating: 4.8 },
  { _id: "30", name: "Organic Curry Powder", price: 260, unit: "Kg", sellerName: "Bilal Hassan", farmerImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=BilalHassan3", location: "Gujranwala, Punjab", rating: 4.7 },
];

const HerbsPage: React.FC = () => {
  return <CategoryPageLayout products={mockProducts} categoryName="Herbs" />;
};

export default HerbsPage;

