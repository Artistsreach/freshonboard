
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useParams } from 'react-router-dom'; // useSearchParams no longer needed for 'edit'
import { useStore } from '../contexts/StoreContext';
// import StoreHeader from '../components/store/StoreHeader';
// import StoreHero from '../components/store/StoreHero';
// import ProductGrid from '../components/store/ProductGrid';
// import StoreFeatures from '../components/store/StoreFeatures';
// import StoreNewsletter from '../components/store/StoreNewsletter';
// import StoreFooter from '../components/store/StoreFooter';
import PreviewControls from '../components/PreviewControls';
import EditStoreForm from '../components/EditStoreForm';
import { useToast } from '../components/ui/use-toast';
import RealtimeChatbot from '../components/store/RealtimeChatbot';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Lock, Unlock } from 'lucide-react';
import StoreWaySection from '../components/store/StoreWaySection.jsx';
import ModernStoreFeatures from '../components/store/modern/sections/StoreFeatures.jsx'; // Using modern as the base for now

const StorePreview = () => {
  console.log('[StorePreview] Component mounted.');

  const { storeName, slug, productHandle: productHandleFromParams } = useParams(); // Get productHandle
  const currentStoreName = storeName || slug;
  console.log('[StorePreview] storeName from params:', currentStoreName);
  // Use updateStore from context instead of a separate updateStoreInContext
  // Assuming getStoreByName will be available in StoreContext
  const { getStoreByName, getStoreBySlug, getStoreById, currentStore: contextCurrentStore, setCurrentStore, updateStore, viewMode, isLoadingStores, user } = useStore(); 
  const { toast } = useToast();
  
  const [store, setStore] = useState(null); // Local state for the store being previewed
  const [isFetchingStore, setIsFetchingStore] = useState(false);
  const [previewTemplateVersion, setPreviewTemplateVersion] = useState(null); // For manual template switching

  useEffect(() => {
    if (store) {
      setPreviewTemplateVersion(store.template_version);
    }
  }, [store]);

  // Classic Template (formerly V1) Components - these will use the existing StoreHeader, StoreHero etc. states
  
  // Modern Template Components
  const [ModernHeader, setModernHeader] = useState(null);
  const [ModernHero, setModernHero] = useState(null);
  const [ModernFeatures, setModernFeatures] = useState(null);
  const [ModernCollections, setModernCollections] = useState(null);
  const [ModernProductGrid, setModernProductGrid] = useState(null);
  const [ModernFooter, setModernFooter] = useState(null);

  // Premium Template Components
  const [PHeader, setPHeader] = useState(null);
  const [PHero, setPHero] = useState(null);
  const [PFeaturedProducts, setPFeaturedProducts] = useState(null);
  const [PCategoryShowcase, setPCategoryShowcase] = useState(null);
  const [PSocialProof, setPSocialProof] = useState(null);
  const [PNewsletter, setPNewsletter] = useState(null);
  const [PFooter, setPFooter] = useState(null);

  // Sharp Template Components
  const [SharpHeader, setSharpHeader] = useState(null);
  const [SharpHero, setSharpHero] = useState(null);
  const [SharpFeatures, setSharpFeatures] = useState(null);
  const [SharpProductGrid, setSharpProductGrid] = useState(null);
  const [SharpTestimonials, setSharpTestimonials] = useState(null);
  const [SharpImageRightSection, setSharpImageRightSection] = useState(null);
  const [SharpVideoLeftSection, setSharpVideoLeftSection] = useState(null);
  const [SharpHeroFollowUpVideo, setSharpHeroFollowUpVideo] = useState(null);
  const [SharpNewsletter, setSharpNewsletter] = useState(null);
  const [SharpFooter, setSharpFooter] = useState(null);

  // Fresh Template (V6) Components
  const [FreshHeader, setFreshHeader] = useState(null);
  const [FreshHero, setFreshHero] = useState(null);
  const [FreshFeatures, setFreshFeatures] = useState(null);
  const [FreshProductGrid, setFreshProductGrid] = useState(null);
  const [FreshStoreCollectionsComponent, setFreshStoreCollectionsComponent] = useState(null); // Renamed and will hold the new Fresh-specific collections component
  const [FreshTestimonials, setFreshTestimonials] = useState(null);
  const [FreshNewsletter, setFreshNewsletter] = useState(null);
  const [FreshFooter, setFreshFooter] = useState(null);
  // Add other Fresh components here as they are created

  // Sleek Template Components
  const [SleekHeader, setSleekHeader] = useState(null);
  const [SleekHero, setSleekHero] = useState(null);
  const [SleekProductGrid, setSleekProductGrid] = useState(null);
  const [SleekFeatures, setSleekFeatures] = useState(null);
  const [SleekTestimonials, setSleekTestimonials] = useState(null);
  const [SleekNewsletter, setSleekNewsletter] = useState(null);
  const [SleekFooter, setSleekFooter] = useState(null);
  const [SleekCollections, setSleekCollections] = useState(null); // Added
  const [SleekStoreWay, setSleekStoreWay] = useState(null);

  // Generic sections like StoreWaySection
  const [StoreWay, setStoreWay] = useState(null);
  const [StoreFeaturesComponent, setStoreFeaturesComponent] = useState(null);

  // Component states for V1/V2 templates
  const [StoreHeader, setStoreHeader] = useState(null); 
  const [StoreHero, setStoreHero] = useState(null);
  const [StoreCollections, setStoreCollections] = useState(null);
  const [ProductGrid, setProductGrid] = useState(null);
  const [StoreFeatures, setStoreFeatures] = useState(null);
  const [StoreTestimonials, setStoreTestimonials] = useState(null);
  const [StoreNewsletter, setStoreNewsletter] = useState(null);
  const [StoreFooter, setStoreFooter] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [enteredPassKey, setEnteredPassKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingPassKey, setIsCheckingPassKey] = useState(false); // To show loading during check

  // Effect to initialize and update the local 'store' state for preview
  useEffect(() => {
    const fetchStoreData = async () => {
      if (!currentStoreName || isFetchingStore) return;

      setIsFetchingStore(true);

      let sourceStoreData = null;

      if (contextCurrentStore && contextCurrentStore.urlSlug === currentStoreName) {
        sourceStoreData = contextCurrentStore;
      } else {
        sourceStoreData = getStoreByName(currentStoreName);
        if (!sourceStoreData) {
          sourceStoreData = await getStoreBySlug(currentStoreName);
        }
      }

      if (sourceStoreData) {
        setStore(sourceStoreData);
        // If the store is new (from import) and has no template, default to 'fresh'
        if (!sourceStoreData.template_version) {
          setPreviewTemplateVersion('fresh');
        }
        if (!contextCurrentStore || contextCurrentStore.id !== sourceStoreData.id) {
          setCurrentStore(sourceStoreData);
        }
      } else if (!isLoadingStores) {
        toast({ title: 'Store Not Found', description: `Could not find store with slug: ${currentStoreName}`, variant: 'destructive' });
        setStore(null);
      }
      
      setIsFetchingStore(false);
    };

    fetchStoreData();
  }, [currentStoreName, isLoadingStores, isFetchingStore, contextCurrentStore, getStoreByName, getStoreBySlug, setCurrentStore, toast]);


  // Effect to update CSS variables when store theme changes and handle sharp dark mode
  useEffect(() => {
    const templateForTheme = previewTemplateVersion || store?.template_version;
    const root = document.documentElement;

    if (store && store.theme) {
      // Set general theme colors as CSS variables
      if (store.theme.primaryColor) {
        root.style.setProperty('--theme-primary-color', store.theme.primaryColor);
      } else {
        root.style.removeProperty('--theme-primary-color');
      }
      if (store.theme.secondaryColor) {
        root.style.setProperty('--theme-secondary-color', store.theme.secondaryColor);
      } else {
        root.style.removeProperty('--theme-secondary-color');
      }

      // Specific handling for premium template gradients
      if (templateForTheme === 'premium') {
        root.style.setProperty('--premium-gradient-start-color', store.theme.primaryColor || '#667eea');
        root.style.setProperty('--premium-gradient-end-color', store.theme.secondaryColor || '#764ba2');
      } else {
        root.style.removeProperty('--premium-gradient-start-color');
        root.style.removeProperty('--premium-gradient-end-color');
      }
    } else {
      // Clear all theme variables if no store or theme
      root.style.removeProperty('--theme-primary-color');
      root.style.removeProperty('--theme-secondary-color');
      root.style.removeProperty('--premium-gradient-start-color');
      root.style.removeProperty('--premium-gradient-end-color');
    }

    // Force dark mode for sharp template
    let sharpWasDark = false;
    if (templateForTheme === 'sharp') {
      if (!root.classList.contains('dark')) {
        root.classList.add('dark');
        sharpWasDark = true; // Flag that this effect instance added 'dark'
      }
    }
    
    // Cleanup function
    return () => {
      // Only remove 'dark' if this specific effect instance for 'sharp' added it,
      // and the template is no longer 'sharp'. This avoids conflicts if another
      // mechanism (or another template) wants dark mode.
      // This cleanup is still imperfect if multiple instances of StorePreview could exist or
      // if global theme toggles are present. A more robust solution uses a global theme context.
      if (sharpWasDark && templateForTheme !== 'sharp' && root.classList.contains('dark')) {
        // Check if another component/template might still want dark mode.
        // For now, if sharp added it, and it's not sharp anymore, remove it.
        // This might need refinement based on how other templates manage dark mode.
        // A simple approach: if template is no longer sharp, remove dark class.
        // The new template's own useEffect (if it has one for theme) would then apply its preference.
      }
      // General cleanup of theme variables is implicitly handled by the next run of the effect
      // or if the component unmounts and these styles are no longer applied by this instance.
      // To be absolutely clean on unmount, one might remove them:
      // root.style.removeProperty('--theme-primary-color');
      // root.style.removeProperty('--theme-secondary-color');
      // etc. But this is often not necessary if the component is simply unmounted.
    };
  }, [store?.theme, store?.template_version, previewTemplateVersion]);


  // Effect for dynamically loading template components based on previewTemplateVersion
  useEffect(() => {
    if (store) { // Only run if store data is available
      const templateVersionToLoad = previewTemplateVersion || store.template_version || 'classic';
      console.log(`[StorePreview] Loading components for template: ${templateVersionToLoad}`);

      // Reset all template component states initially
      setStoreHeader(null); setStoreHero(null); setStoreCollections(null); setProductGrid(null); setStoreFeatures(null); setStoreTestimonials(null); setStoreNewsletter(null); setStoreFooter(null);
      setModernHeader(null); setModernHero(null); setModernFeatures(null); setModernCollections(null); setModernProductGrid(null); setModernFooter(null);
      setPHeader(null); setPHero(null); setPFeaturedProducts(null); setPCategoryShowcase(null); setPSocialProof(null); setPNewsletter(null); setPFooter(null);
      setSharpHeader(null); setSharpHero(null); setSharpFeatures(null); setSharpProductGrid(null); setSharpTestimonials(null); setSharpImageRightSection(null); setSharpVideoLeftSection(null); setSharpHeroFollowUpVideo(null); setSharpNewsletter(null); setSharpFooter(null);
      setFreshHeader(null); setFreshHero(null); setFreshFeatures(null); setFreshProductGrid(null); setFreshStoreCollectionsComponent(null); setFreshTestimonials(null); setFreshNewsletter(null); setFreshFooter(null);
      setSleekHeader(null); setSleekHero(null); setSleekProductGrid(null); setSleekFeatures(null); setSleekTestimonials(null); setSleekNewsletter(null); setSleekFooter(null); setSleekCollections(null); setSleekStoreWay(null);
      setStoreWay(null); 
      setStoreFeaturesComponent(null); // Reset StoreFeaturesComponent

      // Load StoreWaySection and StoreFeaturesComponent for all templates
      setStoreWay(() => StoreWaySection); 
      setStoreFeaturesComponent(() => ModernStoreFeatures); // Use the modern one for now for all templates

      if (templateVersionToLoad === 'classic') { 
        setStoreHeader(() => lazy(() => import('@/components/store/StoreHeader.jsx'))); 
        setStoreHero(() => lazy(() => import('@/components/store/StoreHero.jsx')));
        setStoreCollections(() => lazy(() => import('@/components/store/StoreCollections.jsx')));
        setProductGrid(() => lazy(() => import('@/components/store/ProductGrid.jsx')));
        setStoreFeatures(() => lazy(() => import('@/components/store/StoreFeatures.jsx')));
        setStoreTestimonials(() => lazy(() => import('@/components/store/StoreTestimonials.jsx')));
        setStoreNewsletter(() => lazy(() => import('@/components/store/StoreNewsletter.jsx')));
        setStoreFooter(() => lazy(() => import('@/components/store/StoreFooter.jsx')));
      } else if (templateVersionToLoad === 'modern') {
        setModernHeader(() => lazy(() => import('@/components/store/modern/layout/StoreHeader.jsx')));
        setModernHero(() => lazy(() => import('@/components/store/modern/sections/StoreHero.jsx')));
        setModernFeatures(() => lazy(() => import('@/components/store/modern/sections/StoreFeatures.jsx')));
        setModernCollections(() => lazy(() => import('@/components/store/modern/sections/StoreCollections.jsx')));
        setModernProductGrid(() => lazy(() => import('@/components/store/modern/sections/ProductGrid.jsx')));
        setModernFooter(() => lazy(() => import('@/components/store/modern/layout/Footer.jsx')));
      } else if (templateVersionToLoad === 'premium') {
        setPHeader(() => lazy(() => import('@/components/store/premium/layout/Header.jsx')));
        setPHero(() => lazy(() => import('@/components/store/premium/sections/Hero.jsx')));
        setPFeaturedProducts(() => lazy(() => import('@/components/store/premium/sections/FeaturedProducts.jsx')));
        setPCategoryShowcase(() => lazy(() => import('@/components/store/premium/sections/CategoryShowcase.jsx')));
        setPSocialProof(() => lazy(() => import('@/components/store/premium/sections/SocialProof.jsx')));
        setPNewsletter(() => lazy(() => import('@/components/store/premium/sections/Newsletter.jsx')));
        setPFooter(() => lazy(() => import('@/components/store/premium/layout/Footer.jsx')));
      } else if (templateVersionToLoad === 'sharp') {
        setSharpHeader(() => lazy(() => import('@/components/store/sharp/layout/StoreHeader.jsx')));
        setSharpHero(() => lazy(() => import('@/components/store/sharp/sections/StoreHero.jsx')));
        setSharpFeatures(() => lazy(() => import('@/components/store/sharp/sections/StoreFeatures.jsx')));
        setSharpProductGrid(() => lazy(() => import('@/components/store/sharp/sections/ProductGrid.jsx')));
        setSharpTestimonials(() => lazy(() => import('@/components/store/sharp/sections/Testimonials.jsx')));
        setSharpImageRightSection(() => lazy(() => import('@/components/store/sharp/sections/ImageRightSection.jsx')));
        setSharpVideoLeftSection(() => lazy(() => import('@/components/store/sharp/sections/VideoLeftSection.jsx')));
        setSharpHeroFollowUpVideo(() => lazy(() => import('@/components/store/sharp/sections/HeroFollowUpVideo.jsx')));
        setSharpNewsletter(() => lazy(() => import('@/components/store/sharp/sections/Newsletter.jsx')));
        setSharpFooter(() => lazy(() => import('@/components/store/sharp/layout/Footer.jsx')));
      } else if (templateVersionToLoad === 'fresh') {
        setFreshHeader(() => lazy(() => import('@/components/store/fresh/layout/StoreHeader.jsx')));
        setFreshHero(() => lazy(() => import('@/components/store/fresh/sections/StoreHero.jsx')));
        setFreshFeatures(() => lazy(() => import('@/components/store/fresh/sections/StoreFeatures.jsx')));
        setFreshProductGrid(() => lazy(() => import('@/components/store/fresh/sections/ProductGrid.jsx')));
        setFreshStoreCollectionsComponent(() => lazy(() => import('@/components/store/fresh/sections/StoreCollections.jsx'))); // Use new Fresh-specific collections
        setFreshTestimonials(() => lazy(() => import('@/components/store/fresh/sections/Testimonials.jsx')));
        setFreshNewsletter(() => lazy(() => import('@/components/store/fresh/sections/Newsletter.jsx')));
        setFreshFooter(() => lazy(() => import('@/components/store/fresh/layout/Footer.jsx')));
      } else if (templateVersionToLoad === 'sleek') {
        setSleekHeader(() => lazy(() => import('@/components/store/sleek/layout/StoreHeader.jsx')));
        setSleekHero(() => lazy(() => import('@/components/store/sleek/sections/StoreHero.jsx')));
        setSleekProductGrid(() => lazy(() => import('@/components/store/sleek/sections/ProductGrid.jsx')));
        setSleekFeatures(() => lazy(() => import('@/components/store/sleek/sections/StoreFeatures.jsx')));
        setSleekTestimonials(() => lazy(() => import('@/components/store/sleek/sections/Testimonials.jsx')));
        setSleekNewsletter(() => lazy(() => import('@/components/store/sleek/sections/Newsletter.jsx')));
        setSleekFooter(() => lazy(() => import('@/components/store/sleek/layout/Footer.jsx')));
        setSleekCollections(() => lazy(() => import('@/components/store/sleek/sections/StoreCollections.jsx')));
        setSleekStoreWay(() => lazy(() => import('@/components/store/sleek/sections/StoreWaySection.jsx')));
      }
    }
  }, [store?.id, previewTemplateVersion]); // Depends on store.id and previewTemplateVersion

  const handlePassKeySubmit = () => {
    if (!store || !store.pass_key) {
      setIsAuthenticated(true); // Should not happen if pass_key is required
      return;
    }
    setIsCheckingPassKey(true);
    // Simulate a check; in a real app, this might involve an API call if keys were hashed server-side
    // For now, direct comparison.
    setTimeout(() => { // Adding a small delay to simulate async check
      if (enteredPassKey === store.pass_key) {
        setIsAuthenticated(true);
        toast({ title: 'Access Granted', description: 'Welcome to the store!' });
      } else {
        toast({ title: 'Access Denied', description: 'Incorrect pass key.', variant: 'destructive' });
        setEnteredPassKey(''); // Clear the input
      }
      setIsCheckingPassKey(false);
    }, 500);
  };
  
  if (isLoadingStores || isFetchingStore || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && store.pass_key) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <div className="bg-card p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
          <Lock className="h-16 w-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-card-foreground mb-3">Protected Store</h2>
          <p className="text-muted-foreground mb-8">
            This store requires a pass key to view its content.
          </p>
          <div className="flex flex-col gap-4">
            <Input
              type="password"
              placeholder="Enter Pass Key"
              value={enteredPassKey}
              onChange={(e) => setEnteredPassKey(e.target.value)}
              className="h-12 text-lg text-center bg-input border-border focus:ring-primary focus:border-primary"
              onKeyPress={(e) => e.key === 'Enter' && handlePassKeySubmit()}
            />
            <Button 
              onClick={handlePassKeySubmit} 
              disabled={isCheckingPassKey || !enteredPassKey.trim()}
              className="h-12 text-lg w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isCheckingPassKey ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
              ) : (
                <>
                  <Unlock className="mr-2 h-5 w-5" /> Access Store
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // No separate "Store Not Found" return here, as it's covered by the loading state
  // or the toast + potential navigation in useEffect.
  // The redundant 'if (isLoadingStores || !store)' block has been removed.
  
  const isPublished = viewMode === 'published';
  // Use previewTemplateVersion for rendering logic
  // Default to 'classic' if store.template_version is 'v1' or null/undefined
  let templateVersionToRender = previewTemplateVersion || store?.template_version;
  if (!templateVersionToRender || templateVersionToRender === 'v1') {
    templateVersionToRender = 'classic';
  }
  console.log(`[StorePreview] Determined templateVersionToRender: ${templateVersionToRender}. (previewTemplateVersion: ${previewTemplateVersion}, store.template_version: ${store?.template_version})`);


  console.log(`[StorePreview] Rendering template: ${templateVersionToRender}. Store products: ${store?.products?.length || 0}, collections: ${store?.collections?.length || 0}`);

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Store...</p>
          </div>
        </div>
      }>
        {templateVersionToRender === 'classic' ? (
          <React.Fragment key="classic">
            {StoreHeader && <StoreHeader store={store} isPublishedView={isPublished} />}
            {StoreHero && <StoreHero store={store} isPublishedView={isPublished} />}
            {ProductGrid && <ProductGrid store={store} isPublishedView={isPublished} />}
            {StoreCollections && <StoreCollections store={store} isPublishedView={isPublished} />}
            {StoreFeaturesComponent && <StoreFeaturesComponent store={store} isPublishedView={isPublished} />}
            {StoreWay && <StoreWay store={store} isPublishedView={isPublished} />}
            {StoreTestimonials && <StoreTestimonials store={store} isPublishedView={isPublished} />}
            {StoreNewsletter && <StoreNewsletter store={store} isPublishedView={isPublished} />}
            {StoreFooter && <StoreFooter store={store} isPublishedView={isPublished} />}
          </React.Fragment>
        ) : templateVersionToRender === 'modern' ? (
          <React.Fragment key="modern">
            <div className="min-h-screen flex flex-col">
              <main className="flex-1">
                {ModernHeader && <ModernHeader store={store} isPublishedView={isPublished} />}
                {ModernHero && <ModernHero store={store} isPublishedView={isPublished} />}
                {/* ModernFeatures is already specific to modern, so we use it directly if loaded, otherwise the generic one */}
                {ModernFeatures ? <ModernFeatures store={store} isPublishedView={isPublished} /> : (StoreFeaturesComponent && <StoreFeaturesComponent store={store} isPublishedView={isPublished} />)}
                {ModernProductGrid && <ModernProductGrid store={store} products={store?.products || []} isPublishedView={isPublished} />}
                {ModernCollections && <ModernCollections store={store} isPublishedView={isPublished} />}
                {StoreWay && <StoreWay store={store} isPublishedView={isPublished} />}
              </main>
              <footer className="mt-auto">
                {ModernFooter && <ModernFooter store={store} isPublishedView={isPublished} />}
              </footer>
            </div>
          </React.Fragment>
        ) : templateVersionToRender === 'premium' ? (
          <React.Fragment key="premium">
            {PHeader && <PHeader store={store} isPublishedView={isPublished} />}
            {PHero && <PHero store={store} isPublishedView={isPublished} />}
            {PFeaturedProducts && <PFeaturedProducts store={store} isPublishedView={isPublished} />}
            {PCategoryShowcase && <PCategoryShowcase store={store} isPublishedView={isPublished} />}
            {StoreFeaturesComponent && <StoreFeaturesComponent store={store} isPublishedView={isPublished} />}
            {StoreWay && <StoreWay store={store} isPublishedView={isPublished} />}
            {PSocialProof && <PSocialProof store={store} isPublishedView={isPublished} />}
            {PNewsletter && <PNewsletter store={store} isPublishedView={isPublished} />}
            {PFooter && <PFooter store={store} isPublishedView={isPublished} />}
          </React.Fragment>
        ) : templateVersionToRender === 'sharp' ? (
          <React.Fragment key="sharp">
            {SharpHeader && <SharpHeader store={store} isPublishedView={isPublished} />}
            {SharpHero && <SharpHero store={store} isPublishedView={isPublished} />}
            {SharpHeroFollowUpVideo && <SharpHeroFollowUpVideo store={store} />}
            {SharpProductGrid && <SharpProductGrid store={store} isPublishedView={isPublished} />}
            {/* SharpFeatures is loaded specifically, if not, use generic */}
            {SharpFeatures ? <SharpFeatures store={store} isPublishedView={isPublished} /> : (StoreFeaturesComponent && <StoreFeaturesComponent store={store} isPublishedView={isPublished} />)}
            {StoreWay && <StoreWay store={store} isPublishedView={isPublished} />}
            {SharpImageRightSection && <SharpImageRightSection store={store} isPublishedView={isPublished} />}
            {SharpVideoLeftSection && <SharpVideoLeftSection store={store} isPublishedView={isPublished} />}
            {SharpTestimonials && <SharpTestimonials store={store} isPublishedView={isPublished} />}
            {SharpNewsletter && <SharpNewsletter store={store} />}
            {SharpFooter && <SharpFooter store={store} />}
          </React.Fragment>
        ) : templateVersionToRender === 'fresh' ? (
          <React.Fragment key="fresh">
            {FreshHeader && <FreshHeader store={store} isPublishedView={isPublished} />}
            {FreshHero && <FreshHero store={store} isPublishedView={isPublished} />}
            {FreshProductGrid && <FreshProductGrid store={store} isPublishedView={isPublished} />} {/* This is "Our Products" */}
            {FreshStoreCollectionsComponent && <FreshStoreCollectionsComponent store={store} isPublishedView={isPublished} />} {/* This is "Shop by Collection" */}
            {/* FreshFeatures is loaded specifically, if not, use generic */}
            {FreshFeatures ? <FreshFeatures store={store} isPublishedView={isPublished} /> : (StoreFeaturesComponent && <StoreFeaturesComponent store={store} isPublishedView={isPublished} />)}
            {FreshTestimonials && <FreshTestimonials store={store} isPublishedView={isPublished} />}
            {StoreWay && <StoreWay store={store} isPublishedView={isPublished} />}
            {FreshNewsletter && <FreshNewsletter store={store} />}
            {FreshFooter && <FreshFooter store={store} />}
          </React.Fragment>
        ) : templateVersionToRender === 'sleek' ? (
          <React.Fragment key="sleek">
            {SleekHeader && <SleekHeader store={store} isPublishedView={isPublished} />}
            {SleekHero && <SleekHero store={store} isPublishedView={isPublished} />}
            {SleekProductGrid && <SleekProductGrid store={store} isPublishedView={isPublished} />}
            {SleekCollections && <SleekCollections store={store} isPublishedView={isPublished} />}
            {/* SleekFeatures is loaded specifically, if not, use generic */}
            {SleekFeatures ? <SleekFeatures store={store} isPublishedView={isPublished} /> : (StoreFeaturesComponent && <StoreFeaturesComponent store={store} isPublishedView={isPublished} />)}
            {SleekStoreWay ? <SleekStoreWay store={store} isPublishedView={isPublished} /> : (StoreWay && <StoreWay store={store} isPublishedView={isPublished} />)}
            {SleekTestimonials && <SleekTestimonials store={store} isPublishedView={isPublished} />}
            {SleekNewsletter && <SleekNewsletter store={store} isPublishedView={isPublished} />}
            {SleekFooter && <SleekFooter store={store} isPublishedView={isPublished} />}
          </React.Fragment>
        ) : null /* Fallback or default rendering if needed, though covered by 'classic' default */ }
      </Suspense>
      
      {user && store && user.uid === store.merchant_id && (
        <PreviewControls
          store={store}
          onEdit={() => setIsEditOpen(true)}
          currentTemplate={previewTemplateVersion}
          onTemplateChange={setPreviewTemplateVersion} // Pass the setter
          availableTemplates={['classic', 'modern', 'premium', 'sharp', 'fresh', 'sleek']} // Updated available templates
        />
      )}
      
      {!isPublished && store && ( // Ensure store is not null before rendering EditStoreForm
        <EditStoreForm 
          store={store} 
          open={isEditOpen} 
          onOpenChange={setIsEditOpen}
          // Pass a callback to update the store in StorePreview if template is changed via EditStoreForm
          onStoreUpdate={(updatedStoreData) => {
            setStore(prevStore => ({ ...prevStore, ...updatedStoreData }));
            if (updatedStoreData.template_version && updatedStoreData.template_version !== previewTemplateVersion) {
              setPreviewTemplateVersion(updatedStoreData.template_version); // Sync preview with actual if changed
            }
            // Also update in global context using the main updateStore function
            // This will handle local state, localStorage, and Supabase sync.
            if (store && store.id === updatedStoreData.id) { // Ensure we are updating the correct store
                updateStore(updatedStoreData.id, updatedStoreData); 
            } else if (contextCurrentStore && contextCurrentStore.id === updatedStoreData.id) {
                // Fallback if local store state is somehow out of sync but context has the ID
                updateStore(updatedStoreData.id, updatedStoreData);
            }
          }}
        />
      )}
      <RealtimeChatbot storeId={store?.id} /> {/* Pass storeId to RealtimeChatbot */}
    </div>
  );
};

export default StorePreview;
