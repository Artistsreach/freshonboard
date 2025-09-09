
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, Menu, X, Trash2, Sun, Moon, Edit } from 'lucide-react'; // Added Sun, Moon, Edit
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch'; // Added Switch
import { useStore } from '@/contexts/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import InlineTextEdit from '@/components/ui/InlineTextEdit';
import ChangeLogoModal from '@/components/store/ChangeLogoModal'; // Import the new modal

const StoreHeader = ({ store, isPublishedView = false }) => {
  const { name, theme, logo_url: logoUrl, id: storeId, settings, content, template_version: storeTemplateVersion } = store; // Renamed template_version for clarity
  const { cart, removeFromCart, updateQuantity, updateStore, updateStoreTemplateVersion } = useStore(); // Added updateStoreTemplateVersion
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChangeImageDialogOpen, setIsChangeImageDialogOpen] = useState(false); // State for image dialog
  const isAdmin = !isPublishedView;
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  const storeCartItems = cart.filter(item => item.storeId === storeId);
  const cartItemCount = storeCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = storeCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    // This component might be used on pages that don't control the global HTML class.
  // For now, we'll manage a local state and assume the global class is handled elsewhere (e.g., by the main Header or a theme provider).
  // If this StoreHeader is meant to *also* control the global theme, this logic would need to be more robust
  // or ideally, theme state would be managed globally (e.g. in a context).
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    setIsDarkMode(true);
    // Optionally, if this header *should* control the theme:
    // document.documentElement.classList.add('dark');
  } else {
    setIsDarkMode(false);
    // document.documentElement.classList.remove('dark');
  }
}, []);

const handleSaveHeaderText = async (field, value, index = null) => {
  if (storeId) {
    try {
      if (field === 'storeName') {
        await updateStore(storeId, { name: value });
      } else if (field === 'navLink' && index !== null) {
        const currentNavLinks = content?.navLinks || navLinks.map(l => ({ label: l.label, href: l.href }));
        const updatedNavLinks = currentNavLinks.map((link, i) =>
          i === index ? { ...link, label: value } : link
        );
        await updateStore(storeId, { content: { ...content, navLinks: updatedNavLinks } });
      }
      await performTemplateRefresh(); // Refresh after successful text update
    } catch (error) {
      console.error(`Failed to update store ${field} or refresh template:`, error);
    }
  }
};

  const performTemplateRefresh = async () => {
    const currentVersion = storeTemplateVersion || 'v1'; // Use destructured and potentially renamed prop
    console.log(`Performing template refresh. Current version: ${currentVersion}`);
    if (currentVersion === 'v1') {
      await updateStoreTemplateVersion(storeId, 'v2');
      await updateStoreTemplateVersion(storeId, 'v1');
      console.log("Template refreshed: v1 -> v2 -> v1");
    } else if (currentVersion === 'v2') {
      await updateStoreTemplateVersion(storeId, 'v1');
      await updateStoreTemplateVersion(storeId, 'v2');
      console.log("Template refreshed: v2 -> v1 -> v2");
    }
  };

  const openChangeImageDialog = () => {
    // TODO: Implement the actual dialog opening logic.
    setIsChangeImageDialogOpen(true);
    console.log("Open change image dialog (placeholder)");
  };

  const handleLogoReplaced = async (newLogoUrl) => {
    if (storeId && newLogoUrl) {
      try {
        await updateStore(storeId, { logo_url: newLogoUrl });
        console.log("Store logo updated successfully. Setting template to modern (v2).");
        await updateStoreTemplateVersion(storeId, 'v2');
        console.log("Store template set to modern (v2).");
      } catch (error) {
        console.error("Failed to update store logo or set template to modern:", error);
        // Optionally, show a toast notification to the user about the failure
      }
    }
  };

const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Simplified base path, as there's only one main store URL structure now
  const basePath = `/store/${storeId}`;
  const defaultNavLinks = [
    { href: basePath, label: 'Home' },
    { href: `#products-${storeId}`, label: 'Products' },
    { href: `#features-${storeId}`, label: 'Features' },
    { href: `#contact-${storeId}`, label: 'Contact' },
  ];
  const navLinks = (content?.navLinks && content.navLinks.length === defaultNavLinks.length)
    ? content.navLinks.map((cl, i) => ({ ...defaultNavLinks[i], label: cl.label || defaultNavLinks[i].label }))
    : defaultNavLinks;

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (href.startsWith('/store/')) { // Only one base path now
      navigate(href);
    } else { // For anchor links like #products
      const elementId = href.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback for sections not yet rendered or if ID is incorrect
        navigate(basePath); // Navigate to store home if anchor target not found
      }
    }
  };
  
  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout', { state: { cart: storeCartItems, storeName: name, storeId: storeId } });
  };


  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b"
        style={{ borderColor: `${theme.primaryColor}30` }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2"> {/* Main container for logo area + name */}
            {/* Logo and Edit Button Area */}
            <div className="relative flex items-center">
              <Link to={basePath} className="group">
                {logoUrl && <img src={logoUrl} alt={`${name} logo`} className="h-16 w-16 object-contain group-hover:scale-105 transition-transform duration-200" />}
              </Link>
              {isAdmin && logoUrl && (
                <Button variant="outline" size="icon" onClick={openChangeImageDialog} className="absolute top-0 right-0 h-7 w-7 p-1 bg-background/75 hover:bg-muted rounded-full -mr-2 -mt-2 z-10 shadow-md">
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            {/* Store Name */}
            <Link to={basePath} className="group ml-2">
              <span className="font-bold text-xl tracking-tight group-hover:text-primary transition-colors" style={{color: theme.primaryColor}}>
                <InlineTextEdit
                  initialText={name}
                onSave={(newText) => handleSaveHeaderText('storeName', newText)}
                isAdmin={isAdmin}
                placeholder="Store Name"
              />
            </span>
            </Link>
          </div> {/* Closes the "flex items-center gap-2" for logo and name */}
          
          <nav className="hidden md:flex items-center gap-x-6">
            {navLinks.map((link, index) => (
              <a key={link.label + index} href={link.href} onClick={(e) => handleNavLinkClick(e, link.href)} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors" style={{ '--hover-color': theme.primaryColor }}>
                <InlineTextEdit
                  initialText={link.label}
                  onSave={(newText) => handleSaveHeaderText('navLink', newText, index)}
                  isAdmin={isAdmin}
                  placeholder={`Link ${index + 1}`}
                />
              </a>
            ))}
          </nav>
          
          <div className="flex items-center gap-2">
            {(settings?.showThemeToggle ?? true) && ( // Conditionally render based on store setting, default to true if not set
            <div className="hidden md:flex items-center gap-2 mr-2">
              <Switch
                id={`store-theme-switcher-${storeId}`}
                checked={isDarkMode}
                onCheckedChange={toggleTheme}
                aria-label="Toggle dark mode"
              />
              {isDarkMode ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
            </div>
            )}

            <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-primary" style={{ '--hover-color': theme.primaryColor }}>
              <Search className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline"
              className="relative"
              onClick={() => setIsCartOpen(true)}
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs" style={{backgroundColor: theme.secondaryColor || 'red'}}>
                  {cartItemCount}
                </Badge>
              )}
              <span className="ml-2 hidden sm:inline">Cart</span>
            </Button>
            
            <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(true)} style={{ '--hover-color': theme.primaryColor }}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 bg-background p-6 md:hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2"> {/* Main container for logo area + name */}
                {/* Logo and Edit Button Area */}
                <div className="relative flex items-center">
                  <Link to={basePath} className="group" onClick={() => setIsMobileMenuOpen(false)}>
                    {logoUrl && <img src={logoUrl} alt={`${name} logo`} className="h-16 w-16 object-contain" />}
                  </Link>
                  {isAdmin && logoUrl && (
                    <Button variant="outline" size="icon" onClick={() => { openChangeImageDialog(); setIsMobileMenuOpen(false); }} className="absolute top-0 right-0 h-7 w-7 p-1 bg-background/75 hover:bg-muted rounded-full -mr-2 -mt-2 z-10 shadow-md">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {/* Store Name */}
                <Link to={basePath} className="group ml-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <span className="font-bold text-xl" style={{color: theme.primaryColor}}>
                    <InlineTextEdit
                      initialText={name}
                    onSave={(newText) => handleSaveHeaderText('storeName', newText)}
                    isAdmin={isAdmin}
                    placeholder="Store Name"
                  />
                </span>
                </Link>
              </div> {/* Closes the main flex container for logo area + name */}
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col gap-y-4">
              {navLinks.map((link, index) => (
                <a key={link.label + index} href={link.href} onClick={(e) => handleNavLinkClick(e, link.href)} className="text-lg font-medium text-foreground hover:text-primary transition-colors" style={{ '--hover-color': theme.primaryColor }}>
                  <InlineTextEdit
                    initialText={link.label}
                    onSave={(newText) => handleSaveHeaderText('navLink', newText, index)}
                    isAdmin={isAdmin}
                    placeholder={`Link ${index + 1}`}
                  />
                </a>
              ))}
               {/* Theme toggle for mobile menu */}
              {(settings?.showThemeToggle ?? true) && ( // Conditionally render based on store setting
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Switch
                  id={`mobile-store-theme-switcher-${storeId}`}
                  checked={isDarkMode}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
                {isDarkMode ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
                <span className="text-sm text-muted-foreground">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
              </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <DialogPrimitive.Root open={isCartOpen} onOpenChange={setIsCartOpen}>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
              <DialogPrimitive.Content 
                className="fixed z-50 inset-y-0 right-0 h-full w-full max-w-md bg-background border-l shadow-xl flex flex-col"
                as={motion.div}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="flex items-center justify-between p-6 border-b">
                  <h2 className="text-xl font-semibold">Your Cart</h2>
                  <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {storeCartItems.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground">Looks like you haven't added anything yet.</p>
                    <Button onClick={() => setIsCartOpen(false)} className="mt-6" style={{backgroundColor: theme.primaryColor}}>Continue Shopping</Button>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1 p-6">
                      <div className="space-y-4">
                        {storeCartItems.map(item => (
                          <div key={item.id} className="flex items-start gap-4">
                            <img 
                              src={item.image?.src?.tiny || item.image?.src?.medium || `https://via.placeholder.com/80x80.png?text=${item.name.substring(0,1)}`} 
                              alt={item.name} 
                              className="w-20 h-20 object-cover rounded-md border" 
                            />
                            <div className="flex-1">
                              <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
                              <p className="text-xs text-muted-foreground">Price: ${item.price.toFixed(2)}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, storeId, item.quantity - 1)}><span className="text-lg leading-none">-</span></Button>
                                <span className="text-sm w-4 text-center">{item.quantity}</span>
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.id, storeId, item.quantity + 1)}><span className="text-lg leading-none">+</span></Button>
                              </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                <Button variant="ghost" size="icon" className="h-7 w-7 mt-1 text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id, storeId)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Separator />
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between font-medium">
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
                        <Button className="w-full" size="lg" style={{backgroundColor: theme.primaryColor}} onClick={handleCheckout}>
                            Proceed to Checkout
                        </Button>
                    </div>
                  </>
                )}
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>
        )}
      </AnimatePresence>

      {isAdmin && (
        <ChangeLogoModal
          open={isChangeImageDialogOpen}
          onOpenChange={setIsChangeImageDialogOpen}
          storeId={storeId}
          storeName={name}
          currentLogoUrl={logoUrl}
          onLogoReplaced={handleLogoReplaced}
        />
      )}
    </>
  );
};

// Minimal DialogPrimitive components for Cart Drawer
const DialogPrimitive = { 
  Root: ({ children, ...props }) => <div {...props}>{children}</div>,
  Portal: ({ children }) => <>{children}</>, 
  Overlay: React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("fixed inset-0 z-50", className)} {...props} />
  )),
  Content: React.forwardRef(({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("fixed z-50", className)} {...props}>
      {children}
    </div>
  ))
};
DialogPrimitive.Overlay.displayName = "DialogPrimitive.Overlay";
DialogPrimitive.Content.displayName = "DialogPrimitive.Content";


export default StoreHeader;
