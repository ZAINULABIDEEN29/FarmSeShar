import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { FeaturedProductsSection, HeroSection, ShopByCategorySection, WhyChooseUsSection } from '@/components/sections'
import { useNavigate } from 'react-router-dom'
import React from 'react'

const LandingPage:React.FC = () => {
    const navigate = useNavigate()
    
    const handleShopNow = () => {
        console.log('Shop Now clicked')
      }
    
      const handleLearnMore = () => {
        navigate('/farmer-registration')
      }
    
      const handleCategoryClick = (category: any) => {
        console.log('Category clicked:', category)
      }
    
      const handleViewAll = () => {
        console.log('View All clicked')
      }
    
      const handleAddToCart = (product: any) => {
        console.log('Add to Cart:', product)
      }
  return (
    <div className="w-full flex flex-col min-h-screen">
    <Header/>
    <main className="w-full flex-1">
      <HeroSection
        onShopNow={handleShopNow}
        onLearnMore={handleLearnMore}
      />
      <ShopByCategorySection
        onCategoryClick={handleCategoryClick}
      />
      <FeaturedProductsSection
        onViewAll={handleViewAll}
        onAddToCart={handleAddToCart}
      />
      <WhyChooseUsSection />
    </main>
    <Footer/>
  </div>
  )
}

export default LandingPage