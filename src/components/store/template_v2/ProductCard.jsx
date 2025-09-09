
import React, { useState } from 'react'; // Keep this one as it includes useState
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, Eye, Zap as BuyNowIcon, Edit } from 'lucide-react'; // Added Edit
import { useStore } from '@/contexts/StoreContext';
import ProductEditModal from '@/components/store/ProductEditModal'; // Import Edit Modal
import { Link } from 'react-router-dom';
import { stripePromise } from '@/lib/stripe';
import InlineTextEdit from '@/components/ui/InlineTextEdit'; // Added import
import { useEffect } from 'react'; // Added useEffect

const ProductCard = ({ product, theme, index, storeId, isPublishedView = false }) => {
  const [displayProduct, setDisplayProduct] = useState(product);

  useEffect(() => {
    setDisplayProduct(product);
  }, [product]);

  const { name, price, rating, description, image, currencyCode = 'USD', id: rawProductId, stripe_price_id, variants, inventory_count } = displayProduct; // Added variants & inventory_count
  const { addToCart, updateStore: updateContextStore, currentStore } = useStore(); // Get updateStore and currentStore
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const isAdmin = !isPublishedView;

  // Encode Shopify GIDs for URL safety
  const isShopifyGid = (id) => typeof id === 'string' && id.startsWith('gid://shopify/');
  const productId = isShopifyGid(rawProductId) ? btoa(rawProductId) : rawProductId;

  const imageUrl = image?.src?.medium || image?.url || (Array.isArray(displayProduct.images) && displayProduct.images.length > 0 ? displayProduct.images[0] : `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(name)}`);
  const imageAlt = image?.alt || `${name} product image`;
  
  const handleSaveProductText = async (field, value) => {
    if (storeId && rawProductId) {
      try {
        // Placeholder for actual product update logic, similar to the classic ProductCard
        console.log(`Attempting to save V2 product ${rawProductId}: ${field} = ${value}`);
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-product`, {
          method: 'PUT', // Or PATCH
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`, // Assuming auth is needed
          },
          body: JSON.stringify({ store_id: storeId, product_id: rawProductId, [field]: value })
        });
      } catch (error) {
        console.error(`Failed to update V2 product ${field}:`, error);
      }
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent link navigation if button inside Link
    e.stopPropagation();
    addToCart(product, storeId);
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // The stripe_price_id is fetched by the backend function now, 
    // but we can keep a client-side check if product object is expected to have it.
    // For now, let's rely on the backend to check if the product has a valid Stripe price ID.
    // if (!stripe_price_id) { 
    //   setCheckoutError('This product is not available for purchase at the moment (missing local Stripe Price ID).');
    //   console.error('Stripe Price ID is missing for product on client:', product);
    //   return;
    // }

    setIsCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // No Authorization header needed for public checkout usually
            // 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY // If function requires it
          },
          body: JSON.stringify({ 
            platform_product_id: rawProductId, // Use platform_product_id
            store_id: storeId,                 // Use store_id
            quantity: 1 
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session.');
      }

      // The function now returns checkoutUrl directly
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else if (data.sessionId) { // Fallback if only sessionId is returned (older Stripe.js integration)
        const stripe = await stripePromise;
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (stripeError) {
          console.error('Stripe redirect error:', stripeError);
          setCheckoutError(stripeError.message);
        }
      } else {
        throw new Error('Checkout session created, but no URL or Session ID returned.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setCheckoutError(err.message);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Conditionally render Buy Now button only if product has a stripe_default_price_id
  // This implies it's available for purchase via Stripe.
  // The backend function `create-stripe-checkout-session` will also verify this.
  const canBuyNow = (!!displayProduct.stripe_default_price_id || !!stripe_price_id) && (inventory_count === undefined || inventory_count > 0);

  const handleEditProductClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProductChanges = async (updatedProductData) => {
    if (storeId && rawProductId) {
      try {
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-product`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('supabase.auth.token')}`,
          },
          body: JSON.stringify({ store_id: storeId, product_id: rawProductId, ...updatedProductData })
        });
        setDisplayProduct(prevData => ({ ...prevData, ...updatedProductData }));

        // Update StoreContext
        if (currentStore && currentStore.id === storeId && currentStore.products) {
          const updatedProductsArray = currentStore.products.map(p =>
            p.id === rawProductId ? { ...p, ...updatedProductData } : p
          );
          updateContextStore(storeId, { products: updatedProductsArray });
        } else if (currentStore && currentStore.id === storeId && !currentStore.products) {
           updateContextStore(storeId, { products: [{ ...displayProduct, ...updatedProductData }] });
        }
        
        setIsEditModalOpen(false);
      } catch (error) {
        console.error('Failed to save V2 product changes:', error);
      }
    }
  };

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -8, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="product-card h-full"
    >
      <Card className="h-full overflow-hidden border hover:border-primary/50 transition-all duration-300 flex flex-col group bg-card shadow-sm hover:shadow-lg rounded-md"> {/* Added rounded-md */}
        {/* Removed isPublishedView from state, ProductDetail will get it from context */}
        <Link to={`/store/${storeId}/product/${productId}`} className="block">
          <div className="aspect-square relative overflow-hidden bg-muted">
            <img 
              alt={imageAlt}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={imageUrl} />
            
            <div 
              className="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold text-white rounded shadow-md" /* Changed rounded-full to rounded */
              style={{ backgroundColor: theme.primaryColor }}
            >
              NEW
            </div>
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Eye className="h-10 w-10 text-white" />
            </div>
          </div>
        </Link>
        
        <CardContent className="p-4 flex-grow">
          <Link to={`/store/${storeId}/product/${productId}`} className="block">
            <div className="flex justify-between items-start mb-1.5">
              <h3 className="font-semibold text-md lg:text-lg line-clamp-2 group-hover:text-primary transition-colors" style={{"--hover-color": theme.primaryColor}}>
                <InlineTextEdit
                  initialText={name}
                  onSave={(newText) => handleSaveProductText('name', newText)}
                  isAdmin={isAdmin}
                  placeholder="Product Name"
                />
              </h3>
              <span className="font-bold text-md lg:text-lg whitespace-nowrap" style={{ color: theme.primaryColor }}>
                {currencyCode} {typeof price === 'number' ? price.toFixed(2) : 'Price unavailable'}
              </span>
            </div>
          </Link>
          
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            <InlineTextEdit
              initialText={description}
              onSave={(newText) => handleSaveProductText('description', newText)}
              isAdmin={isAdmin}
              placeholder="Product Description"
            />
          </p>
          
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-3.5 w-3.5 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/50'}`} 
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">({rating} reviews)</span>
          </div>
          {/* Display Variants if they exist - for ProductEditModal consistency */}
          {variants && variants.length > 0 && (
            <div className="mt-2.5 text-xs text-muted-foreground">
              {variants.map((variant, vIndex) => (
                <div key={vIndex} className="mb-1 last:mb-0">
                  <span className="font-medium">{variant.name}: </span>
                  {variant.values.join(', ')}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="p-4 pt-0 mt-auto flex flex-col gap-2">
          <Button 
            className="w-full transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: theme.primaryColor, color: theme.primaryTextColor || 'white' }}
            onClick={handleAddToCart}
            disabled={isCheckoutLoading || (inventory_count !== undefined && inventory_count <= 0)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {inventory_count !== undefined && inventory_count <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
          {canBuyNow && ( 
            <Button 
              variant="outline"
              className="w-full transition-transform duration-200 hover:scale-105"
              onClick={handleBuyNow}
              disabled={isCheckoutLoading}
            >
              <BuyNowIcon className="mr-2 h-4 w-4" />
              {isCheckoutLoading ? 'Processing...' : 'Buy Now'}
            </Button>
          )}
          {checkoutError && <p className="text-xs text-red-500 mt-1">{checkoutError}</p>}
          {isAdmin && (
            <Button 
              variant="outline"
              className="w-full transition-transform duration-200 hover:scale-105 mt-2"
              onClick={handleEditProductClick}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
    {isEditModalOpen && (
      <ProductEditModal
        product={displayProduct} // Pass the full product object
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
