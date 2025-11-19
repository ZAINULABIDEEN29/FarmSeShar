import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { FeaturedProductsSection, HeroSection, ShopByCategorySection, WhyChooseUsSection } from '@/components/sections'
import { useNavigate } from 'react-router-dom'
import React from 'react'
import { useAppSelector } from '@/store/hooks'
import { selectCartItemCount } from '@/store/slices/cartSlice'
const LandingPage:React.FC = () => {
    const navigate = useNavigate()
    const cartItemCount = useAppSelector(selectCartItemCount)
    const handleShopNow = () => {
        console.log('Shop Now clicked')
      }
      const handleLearnMore = () => {
        navigate('/farmer-registration')
      }
      const handleAccountClick = () => {
        navigate('/login')
      }
      const handleCartClick = () => {
        navigate('/cart')
      }
      const handleLogoClick = () => {
        navigate('/')
      }
      const handleCategoryClick = (category: unknown) => {
        console.log('Category clicked:', category)
      }
      const handleViewAll = () => {
        console.log('View All clicked')
      }
      const handleAddToCart = (product: unknown) => {
        console.log('Add to Cart:', product)
      }
  return (
    <div className="w-full flex flex-col min-h-screen">
    <Header 
      cartCount={cartItemCount}
      onAccountClick={handleAccountClick}
      onCartClick={handleCartClick}
      onLogoClick={handleLogoClick}
    />
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