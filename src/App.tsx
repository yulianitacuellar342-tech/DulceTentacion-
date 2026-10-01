/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Product, 
  CartItem, 
  CustomerVerification, 
  Order, 
  InventoryItem, 
  Review, 
  LoyaltyReward,
  OrderStatus 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_INVENTORY, 
  INITIAL_REVIEWS, 
  LOYALTY_REWARDS 
} from './data/initialData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { Donut3DStudio } from './components/Donut3DStudio';
import { IngredientsQuality } from './components/IngredientsQuality';
import { LoyaltyClub } from './components/LoyaltyClub';
import { SocialReviewWall } from './components/SocialReviewWall';
import { CheckoutDrawer } from './components/CheckoutDrawer';
import { ClientVerificationModal } from './components/ClientVerificationModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { PushNotificationCenter } from './components/PushNotificationCenter';
import { AdminPortal } from './components/AdminPortal';
import { Footer } from './components/Footer';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [userPoints, setUserPoints] = useState<number>(380);

  // Client Verification state (KYC)
  const [customerVerification, setCustomerVerification] = useState<CustomerVerification>({
    isVerified: false,
    fullName: 'Yuliana Cuéllar',
    phone: '3213610322',
    email: 'yulianitacuellar342@gmail.com',
    addressGualanday: 'Sector Central, Gualanday, Tolima',
    idNumber: 'CC-10058291',
  });

  // Orders State with an initial sample order for instant live tracking exploration
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ord_initial_1',
      orderNumber: 'DT-2026-4821',
      customer: {
        isVerified: true,
        fullName: 'Yuliana Cuéllar',
        phone: '3213610322',
        email: 'yulianitacuellar342@gmail.com',
        addressGualanday: 'Sector Central, Gualanday, Tolima',
        idNumber: 'CC-10058291',
      },
      items: [
        {
          id: 'item_init_1',
          productId: 'prod_individual',
          name: 'Dona Individual Artesanal',
          presentation: 'Individual',
          baseGlaze: 'Chocolate',
          toppings: ['Chispas', 'Almendras'],
          sauce: 'Arequipe',
          unitPriceCOP: 6500,
          quantity: 2,
          subtotalCOP: 13000,
          image: '/src/assets/images/donut_single_artisan_1790823100709.jpg',
        },
      ],
      subtotalCOP: 13000,
      deliveryFeeCOP: 2500,
      discountCOP: 0,
      totalCOP: 15500,
      paymentMethod: 'nequi',
      paymentStatus: 'aprobado',
      status: 'decorando',
      createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
      estimatedDeliveryTime: '20 - 25 min',
      notes: 'Entregar en la casa frente al parque de Gualanday',
    },
  ]);

  // Modal Controls
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);

  // Cart operations
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (it) =>
          it.productId === newItem.productId &&
          it.baseGlaze === newItem.baseGlaze &&
          it.presentation === newItem.presentation &&
          it.sauce === newItem.sauce
      );
      if (existing) {
        return prev.map((it) =>
          it === existing
            ? {
                ...it,
                quantity: it.quantity + newItem.quantity,
                subtotalCOP: (it.quantity + newItem.quantity) * it.unitPriceCOP,
              }
            : it
        );
      }
      return [...prev, newItem];
    });
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const nextQty = it.quantity + delta;
            return nextQty > 0
              ? { ...it, quantity: nextQty, subtotalCOP: nextQty * it.unitPriceCOP }
              : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCart((prev) => prev.filter((it) => it.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Award loyalty points
    const earnedPoints = Math.floor((newOrder.totalCOP / 5000) * 100);
    setUserPoints((prev) => prev + earnedPoints);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const handleApplyReward = (reward: LoyaltyReward) => {
    if (userPoints >= reward.pointsRequired) {
      setUserPoints((prev) => prev - reward.pointsRequired);
    }
  };

  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  const cartTotalCOP = cart.reduce((acc, it) => acc + it.subtotalCOP, 0);
  const cartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  const scrollToStudio = () => {
    document.getElementById('personalizador')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d0a0b] text-[#f8f5f2] selection:bg-amber-500/20 selection:text-white flex flex-col font-sans">
      {/* Top Header */}
      <Header
        cartCount={cartCount}
        cartTotalCOP={cartTotalCOP}
        verification={customerVerification}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenTracking={() => setIsTrackingModalOpen(true)}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
      />

      {/* Main Experience */}
      <main className="flex-1">
        {/* Luxury Hero */}
        <Hero
          onOpenCustomStudio={scrollToStudio}
          onExploreCatalog={scrollToCatalog}
        />

        {/* Product Catalog */}
        <ProductCatalog
          products={products}
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenCustomStudio={scrollToStudio}
        />

        {/* 3D Interactive Donut Studio */}
        <Donut3DStudio
          onAddToCart={handleAddToCart}
          onOpenCart={() => setIsCartOpen(true)}
        />

        {/* Ingredients Quality (From Document: Marco Fidel Suárez, Harina alta proteína, etc.) */}
        <IngredientsQuality />

        {/* Gamified Loyalty Club */}
        <LoyaltyClub
          userPoints={userPoints}
          onApplyReward={handleApplyReward}
        />

        {/* Social Proof & Reviews Wall */}
        <SocialReviewWall
          reviews={reviews}
          onAddReview={handleAddReview}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Checkout & Cart Drawer */}
      <CheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        verification={customerVerification}
        onOpenVerificationModal={() => setIsVerificationModalOpen(true)}
        onOrderCreated={handleOrderCreated}
      />

      {/* Client Verification Modal */}
      <ClientVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        verification={customerVerification}
        onVerifySuccess={(updated) => {
          setCustomerVerification(updated);
        }}
      />

      {/* Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />

      {/* Push Notifications Center */}
      <PushNotificationCenter
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectPromo={(text) => {
          scrollToCatalog();
        }}
      />

      {/* Admin Portal with Document AI, GitHub & Cloud Deployment */}
      {isAdminPortalOpen && (
        <AdminPortal
          orders={orders}
          inventory={inventory}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onUpdateInventory={(updated) => setInventory(updated)}
          onClose={() => setIsAdminPortalOpen(false)}
        />
      )}
    </div>
  );
}
