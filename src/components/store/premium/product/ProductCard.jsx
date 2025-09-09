import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ShoppingCart,
  Star,
  Eye,
  Zap,
  Crown,
  Sparkles,
  TrendingUp,
  Gift,
  ArrowRight,
  Plus,
  Minus,
  Edit, // Added Edit
} from "lucide-react";
import { Link } from "react-router-dom"; // Added Link import
import { Button } from "../../../ui/button"; // Adjusted path
import { useStore } from "../../../../contexts/StoreContext"; // Adjusted path
import { Badge } from "../../../ui/badge"; // Adjusted path
import ProductEditModal from "@/components/store/ProductEditModal"; // Import Edit Modal

const ProductCard = ({
  product: initialProductProp = { // Renamed product to initialProductProp
    id: "sample-1",
    name: "Premium Product",
    description:
      "A luxurious item crafted with exceptional attention to detail",
    price: 299.99,
    image: {
      src: {
        large:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
        medium:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=80",
      },
    },
    rating: 4.8,
    reviewCount: 127,
    isNew: true,
    isBestseller: false,
    discount: 15,
    originalPrice: 349.99,
    inventory_count: 10, // Default inventory
    variants: [], // Default variants
    currencyCode: 'USD', // Default currency
  },
  theme = {},
  index = 0,
  storeName, // Added storeName
  storeId = "sample-store", // Kept storeId for internal logic like addToCart
  isPublishedView = false,
  displayMode = "grid",
}) => {
  const { addToCart, store, updateStore: updateContextStore, currentStore } = useStore(); // Added updateContextStore, currentStore

  const [displayProduct, setDisplayProduct] = useState(() => {
    const rawId = initialProductProp.id || `product-${index}`;
    return {
      id: rawId,
      name: initialProductProp.name || "Premium Product",
      description: initialProductProp.description || "A luxurious item crafted with exceptional attention to detail",
      price: typeof initialProductProp.price === "number" ? initialProductProp.price : parseFloat(initialProductProp.price) || 299.99,
      image: initialProductProp.image || { src: { large: "https://via.placeholder.com/800", medium: "https://via.placeholder.com/400" } },
      rating: initialProductProp.rating || 4.8,
      reviewCount: initialProductProp.reviewCount || 127,
      isNew: initialProductProp.isNew || false,
      isBestseller: initialProductProp.isBestseller || false,
      discount: initialProductProp.discount || 0,
      originalPrice: initialProductProp.originalPrice || null,
      inventory_count: initialProductProp.inventory_count === undefined ? 10 : initialProductProp.inventory_count,
      variants: initialProductProp.variants || [],
      currencyCode: initialProductProp.currencyCode || 'USD',
    };
  });

  useEffect(() => {
    const rawId = initialProductProp.id || `product-${index}`;
    setDisplayProduct({
      id: rawId,
      name: initialProductProp.name || "Premium Product",
      description: initialProductProp.description || "A luxurious item crafted with exceptional attention to detail",
      price: typeof initialProductProp.price === "number" ? initialProductProp.price : parseFloat(initialProductProp.price) || 299.99,
      image: initialProductProp.image || { src: { large: "https://via.placeholder.com/800", medium: "https://via.placeholder.com/400" } },
      rating: initialProductProp.rating || 4.8,
      reviewCount: initialProductProp.reviewCount || 127,
      isNew: initialProductProp.isNew || false,
      isBestseller: initialProductProp.isBestseller || false,
      discount: initialProductProp.discount || 0,
      originalPrice: initialProductProp.originalPrice || null,
      inventory_count: initialProductProp.inventory_count === undefined ? 10 : initialProductProp.inventory_count,
      variants: initialProductProp.variants || [],
      currencyCode: initialProductProp.currencyCode || 'USD',
    });
  }, [initialProductProp, index]);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showQuickView, setShowQuickView] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const isAdmin = !isPublishedView;

  const primaryColor = store?.theme?.primaryColor || theme?.primaryColor || "#6366F1"; // Use store theme or passed theme

  // Helper function to generate a slightly darker shade
  const getDarkerShade = (color, percent = 20) => {
    if (!color.startsWith("#")) return color;
    let num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) - amt,
      G = (num >> 8 & 0x00FF) - amt,
      B = (num & 0x0000FF) - amt;
    R = Math.max(0, R); G = Math.max(0, G); B = Math.max(0, B);
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  };
  const secondaryColor = getDarkerShade(primaryColor, 20);

  // Encode Shopify GIDs for URL safety
  const isShopifyGid = (id) => typeof id === 'string' && id.startsWith('gid://shopify/');
  const productIdForUrl = isShopifyGid(displayProduct.id) ? btoa(displayProduct.id) : displayProduct.id;


  // Calculate discounted price
  const discountedPrice =
    displayProduct.discount > 0
      ? displayProduct.price * (1 - displayProduct.discount / 100)
      : displayProduct.price;

  // Generate smart badges based on product data
  const getBadges = () => {
    const badges = [];

    if (displayProduct.isNew) {
      badges.push({
        text: "New",
        icon: Sparkles,
        className: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
      });
    }

    if (displayProduct.isBestseller) {
      badges.push({
        text: "Bestseller",
        icon: Crown,
        className: "bg-gradient-to-r from-amber-500 to-orange-500 text-white",
      });
    }

    if (displayProduct.discount > 0) {
      badges.push({
        text: `-${displayProduct.discount}%`,
        icon: Zap,
        className: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
      });
    }

    if (displayProduct.rating >= 4.5) {
      badges.push({
        text: "Top Rated",
        icon: Star,
        style: { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` },
        className: "text-white", // Keep text white for contrast
      });
    }

    return badges.slice(0, 2); // Limit to 2 badges for clean design
  };

  const badges = getBadges();

  // Enhanced animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: index * 0.1,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hover: {
      scale: 1.1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (addToCart && isPublishedView && (displayProduct.inventory_count === undefined || displayProduct.inventory_count > 0)) {
      for (let i = 0; i < quantity; i++) {
        addToCart(displayProduct, storeId); // Use displayProduct
      }
    }
  };

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleEditProductClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProductChanges = async (updatedProductDataFromModal) => {
    if (storeId && displayProduct.id) { // Use displayProduct.id
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-product`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
          },
          body: JSON.stringify({ store_id: storeId, product_id: displayProduct.id, ...updatedProductDataFromModal }) // Use displayProduct.id
        });
        setDisplayProduct(prevData => ({ ...prevData, ...updatedProductDataFromModal })); // Update local state

        // Update StoreContext
        if (currentStore && currentStore.id === storeId && currentStore.products) {
          const updatedProductsArray = currentStore.products.map(p =>
            p.id === displayProduct.id ? { ...p, ...updatedProductDataFromModal } : p
          );
          updateContextStore(storeId, { products: updatedProductsArray });
        } else if (currentStore && currentStore.id === storeId && !currentStore.products) {
           updateContextStore(storeId, { products: [{ ...displayProduct, ...updatedProductDataFromModal }] });
        }

        setIsEditModalOpen(false);
      } catch (error) {
        console.error('Failed to save product changes:', error);
      }
    }
  };

  // List view layout
  if (displayMode === "list") {
    return (
      <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <Link to={`/${storeName}/product/${productIdForUrl}`} className="block relative md:w-1/3 aspect-square md:aspect-auto overflow-hidden"> {/* Use storeName and productIdForUrl */}
            <motion.img
              src={
                displayProduct.image?.src?.medium || displayProduct.image?.src?.large
              }
              alt={displayProduct.name}
              className="w-full h-full object-cover"
              variants={imageVariants}
              initial="hidden"
              animate={imageLoaded ? "visible" : "hidden"}
              whileHover="hover"
              onLoad={() => setImageLoaded(true)}
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <AnimatePresence>
                {badges.map((badge, badgeIndex) => {
                  const IconComponent = badge.icon;
                  return (
                    <motion.div
                      key={badge.text}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: badgeIndex * 0.1 }}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${badge.className || ''} shadow-lg backdrop-blur-sm`}
                      style={badge.style || {}}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span>{badge.text}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Wishlist Button */}
            <motion.button
              className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
            >
              <Heart
                className={`w-5 h-5 transition-colors duration-300 ${
                  isWishlisted
                    ? "text-red-500 fill-red-500"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              />
            </motion.button>

            {/* Loading shimmer */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
              </div>
            )}
          </Link>

          {/* Content Section */}
          <div className="flex-1 p-8">
            <Link to={`/${storeName}/product/${productIdForUrl}`} className="block"> {/* Use storeName and productIdForUrl */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300"
                    style={{ '--hover-text-color': primaryColor, '--dark-hover-text-color': secondaryColor }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = document.documentElement.classList.contains('dark') ? secondaryColor : primaryColor;
                    }}
                    onMouseLeave={(e) => {
                       e.currentTarget.style.color = ''; // Revert to CSS defined color
                    }}
                  >
                    {displayProduct.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {displayProduct.description}
                  </p>
                </div>
              </div>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(displayProduct.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {displayProduct.rating} ({displayProduct.reviewCount} reviews)
              </span>
            </div>

            {/* Price and Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${discountedPrice.toFixed(2)}
                </span>
                {displayProduct.originalPrice && displayProduct.discount > 0 && (
                  <span className="text-lg text-gray-500 dark:text-gray-400 line-through">
                    ${displayProduct.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {isPublishedView && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 rounded-full border-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(Math.max(1, quantity - 1));
                      }}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-10 h-10 rounded-full border-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuantity(quantity + 1);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <Button
                  onClick={handleAddToCart}
                  className="text-white border-0 rounded-full px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
                  style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                  onMouseEnter={(e) => e.currentTarget.style.background = `linear-gradient(to right, ${getDarkerShade(primaryColor, -10)}, ${getDarkerShade(secondaryColor, -10)})`} 
                  onMouseLeave={(e) => e.currentTarget.style.background = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`}
                  disabled={displayProduct.inventory_count !== undefined && displayProduct.inventory_count <= 0}
                >
                  <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  {displayProduct.inventory_count !== undefined && displayProduct.inventory_count <= 0 ? 'Out of Stock' : 'Add to Cart'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                {isAdmin && (
                  <Button
                    onClick={handleEditProductClick}
                    variant="outline"
                    className="rounded-full px-6 py-3 text-sm font-medium border-gray-300 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors duration-300"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      {isEditModalOpen && (
        <ProductEditModal
          product={displayProduct} 
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveProductChanges}
          storeId={storeId}
          theme={theme}
        />
      )}
      </>
    );
  }

  // Grid view layout (default)
  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/${storeName}/product/${productIdForUrl}`} className="block"> {/* Use storeName and productIdForUrl */}
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <motion.img
              src={displayProduct.image?.src?.medium || displayProduct.image?.src?.large}
              alt={displayProduct.name}
            className="w-full h-full object-cover"
            variants={imageVariants}
            initial="hidden"
          animate={imageLoaded ? "visible" : "hidden"}
          whileHover="hover"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <AnimatePresence>
            {badges.map((badge, badgeIndex) => {
              const IconComponent = badge.icon;
              return (
                <motion.div
                  key={badge.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: badgeIndex * 0.1 }}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${badge.className || ''} shadow-lg backdrop-blur-sm`}
                  style={badge.style || {}}
                >
                  <IconComponent className="w-3 h-3" />
                  <span>{badge.text}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Wishlist Button */}
        <motion.button
          className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 z-10"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleWishlistToggle}
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${
              isWishlisted
                ? "text-red-500 fill-red-500"
                : "text-gray-600 dark:text-gray-400"
            }`}
          />
        </motion.button>

        {/* Hover Overlay with Actions */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-20"
            >
              <div className="flex gap-3">
                <motion.button
                  className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleQuickView}
                >
                  <Eye className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </motion.button>

                <motion.button
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
                  onMouseEnter={(e) => e.currentTarget.style.background = `linear-gradient(to right, ${getDarkerShade(primaryColor, -10)}, ${getDarkerShade(secondaryColor, -10)})`}
                  onMouseLeave={(e) => e.currentTarget.style.background = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  disabled={displayProduct.inventory_count !== undefined && displayProduct.inventory_count <= 0}
                >
                  <ShoppingCart className="w-5 h-5 text-white" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading shimmer */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          )}
        </div>
      </Link>
      {/* Content */}
      <div className="p-6">
        <Link to={`/${storeName}/product/${productIdForUrl}`} className="block"> {/* Use storeName and productIdForUrl */}
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(displayProduct.rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({displayProduct.reviewCount})
            </span>
          </div>

          {/* Product Name */}
          <h3
            className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300 line-clamp-2"
            style={{ '--hover-text-color': primaryColor, '--dark-hover-text-color': secondaryColor }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = document.documentElement.classList.contains('dark') ? secondaryColor : primaryColor;
            }}
            onMouseLeave={(e) => {
               e.currentTarget.style.color = ''; // Revert to CSS defined color
            }}
          >
            {displayProduct.name}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-2 line-clamp-2">
            {displayProduct.description}
          </p>
          {/* Price */}
        </Link>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${discountedPrice.toFixed(2)}
            </span>
            {displayProduct.originalPrice && displayProduct.discount > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${displayProduct.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        {isPublishedView && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full border-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(Math.max(1, quantity - 1));
                }}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-6 text-center text-sm font-semibold">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 rounded-full border-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuantity(quantity + 1);
                }}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              className="flex-1 text-white border-0 rounded-full py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 group"
              style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
              onMouseEnter={(e) => e.currentTarget.style.background = `linear-gradient(to right, ${getDarkerShade(primaryColor, -10)}, ${getDarkerShade(secondaryColor, -10)})`}
              onMouseLeave={(e) => e.currentTarget.style.background = `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`}
              disabled={displayProduct.inventory_count !== undefined && displayProduct.inventory_count <= 0}
            >
              <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
              {displayProduct.inventory_count !== undefined && displayProduct.inventory_count <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        )}
        {isAdmin && (
          <div className="mt-4">
            <Button
              onClick={handleEditProductClick}
              variant="outline"
              className="w-full rounded-full py-2 text-sm font-medium border-gray-300 dark:border-gray-700 hover:border-primary hover:text-primary dark:hover:border-primary dark:hover:text-primary transition-colors duration-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
            </Button>
          </div>
        )}
      </div>
    </motion.div>
    {isEditModalOpen && (
      <ProductEditModal
        product={displayProduct}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={handleSaveProductChanges}
        storeId={storeId}
        theme={theme}
      />
    )}
    </>
  );
};

export default ProductCard;
