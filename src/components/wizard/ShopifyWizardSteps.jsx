import React, { useState } from 'react';
import { useStore } from '../../contexts/StoreContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Loader2, AlertTriangle, Sparkles, Image as ImageIcon, Edit3 as EditIcon } from 'lucide-react';
import ShopifyProductEditModal from './ShopifyProductEditModal';
import ShopifyCollectionEditModal from './ShopifyCollectionEditModal'; // Import collection edit modal

export const ShopifyMetadataPreview = () => {
  const { shopifyPreviewMetadata, isFetchingShopifyPreviewData, shopifyImportError, updateShopifyPreviewMetadata } = useStore(); // Added updateShopifyPreviewMetadata
  const [primaryColor, setPrimaryColor] = useState(shopifyPreviewMetadata?.brand?.colors?.primary?.background || '#000000');
  const [secondaryColor, setSecondaryColor] = useState(shopifyPreviewMetadata?.brand?.colors?.secondary?.background || '#ffffff');

  React.useEffect(() => {
    if (shopifyPreviewMetadata?.brand?.colors) {
      setPrimaryColor(shopifyPreviewMetadata.brand.colors.primary?.background || '#000000');
      setSecondaryColor(shopifyPreviewMetadata.brand.colors.secondary?.background || '#ffffff');
    }
  }, [shopifyPreviewMetadata]);

  const handlePrimaryColorChange = (e) => {
    const newColor = e.target.value;
    setPrimaryColor(newColor);
    if (updateShopifyPreviewMetadata) {
      updateShopifyPreviewMetadata({
        ...shopifyPreviewMetadata,
        brand: {
          ...shopifyPreviewMetadata.brand,
          colors: {
            ...shopifyPreviewMetadata.brand?.colors,
            primary: { ...shopifyPreviewMetadata.brand?.colors?.primary, background: newColor },
          },
        },
      });
    }
  };

  const handleSecondaryColorChange = (e) => {
    const newColor = e.target.value;
    setSecondaryColor(newColor);
    if (updateShopifyPreviewMetadata) {
      updateShopifyPreviewMetadata({
        ...shopifyPreviewMetadata,
        brand: {
          ...shopifyPreviewMetadata.brand,
          colors: {
            ...shopifyPreviewMetadata.brand?.colors,
            secondary: { ...shopifyPreviewMetadata.brand?.colors?.secondary, background: newColor },
          },
        },
      });
    }
  };

  if (isFetchingShopifyPreviewData && !shopifyPreviewMetadata) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Fetching store information...</p>
      </div>
    );
  }

  if (shopifyImportError && !shopifyPreviewMetadata) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive">
        <AlertTriangle className="h-12 w-12 mb-4" />
        <p className="font-semibold">Error Fetching Store Info</p>
        <p className="text-sm text-center">{shopifyImportError}</p>
      </div>
    );
  }

  if (!shopifyPreviewMetadata) {
    return <div className="text-center text-muted-foreground">No store metadata to display.</div>;
  }

  const { name, description, primaryDomain, brand } = shopifyPreviewMetadata;
  const logoUrlToShow = brand?.logo?.image?.url || brand?.squareLogo?.image?.url;

  return (
    <div className="w-full p-4">
      <h3 className="text-xl font-semibold mb-4 text-center">Store Preview</h3>
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center space-x-4">
            {logoUrlToShow ? (
              <img src={logoUrlToShow} alt={`${name} logo`} className="h-16 w-16 object-contain rounded border" />
            ) : (
              <div className="h-16 w-16 bg-muted rounded border flex items-center justify-center text-muted-foreground">
                <ImageIcon size={32} />
              </div>
            )}
            <div>
              <CardTitle>{name || 'N/A'}</CardTitle>
              {primaryDomain?.host && <CardDescription>{primaryDomain.host}</CardDescription>}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-1"><strong>Slogan:</strong> {brand?.slogan || 'N/A'}</p>
          <p className="text-sm text-muted-foreground mb-1"><strong>Description:</strong> {description || brand?.shortDescription || 'N/A'}</p>
          {brand?.coverImage?.url && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Cover Image:</p>
              <img src={brand.coverImage.url} alt="Store cover" className="rounded max-h-40 w-auto mx-auto border" />
            </div>
          )}
        </CardContent>
      </Card>
      {brand?.colors && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Brand Colors</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="primaryColorPicker" className="block text-sm font-medium text-muted-foreground mb-1">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  id="primaryColorPicker"
                  value={primaryColor}
                  onChange={handlePrimaryColorChange}
                  className="h-10 w-10 rounded border cursor-pointer"
                />
                <div
                  className="w-12 h-10 rounded border"
                  style={{ backgroundColor: primaryColor }}
                  title={`Primary Background: ${primaryColor}`}
                ></div>
                <span className="text-sm">{primaryColor}</span>
              </div>
              {brand?.colors?.primary?.foreground && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Text/Icon Color (from Shopify):</p>
                  <div
                    className="w-full h-6 rounded border mt-1"
                    style={{ backgroundColor: brand.colors.primary.foreground }}
                    title={`Primary Foreground: ${brand.colors.primary.foreground}`}
                  ></div>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="secondaryColorPicker" className="block text-sm font-medium text-muted-foreground mb-1">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  id="secondaryColorPicker"
                  value={secondaryColor}
                  onChange={handleSecondaryColorChange}
                  className="h-10 w-10 rounded border cursor-pointer"
                />
                <div
                  className="w-12 h-10 rounded border"
                  style={{ backgroundColor: secondaryColor }}
                  title={`Secondary Background: ${secondaryColor}`}
                ></div>
                <span className="text-sm">{secondaryColor}</span>
              </div>
              {brand?.colors?.secondary?.foreground && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Text/Icon Color (from Shopify):</p>
                  <div
                    className="w-full h-6 rounded border mt-1"
                    style={{ backgroundColor: brand.colors.secondary.foreground }}
                    title={`Secondary Foreground: ${brand.colors.secondary.foreground}`}
                  ></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      {/* TODO: Add display for square logo etc. if available and distinct from main logo */}
    </div>
  );
};

export const ShopifyItemsPreview = () => {
  const {
    shopifyPreviewProducts,
    shopifyPreviewCollections,
    fetchShopifyWizardProducts,
    fetchShopifyWizardCollections,
    isFetchingShopifyPreviewData,
    shopifyImportError,
    // Logo generation related state and functions
    shopifyPreviewMetadata,
    generatedLogoImage,
    isGeneratingLogo,
    logoGenerationError,
    generateShopifyStoreLogo,
    updateShopifyPreviewProduct,
    updateShopifyPreviewCollection // Function to update collection in context
  } = useStore();

  const [isProductEditModalOpen, setIsProductEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isCollectionEditModalOpen, setIsCollectionEditModalOpen] = useState(false);
  const [collectionToEdit, setCollectionToEdit] = useState(null);

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setIsProductEditModalOpen(true);
  };

  const handleCloseProductEditModal = () => {
    setIsProductEditModalOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = (updatedProduct) => {
    updateShopifyPreviewProduct(updatedProduct);
  };

  const handleEditCollection = (collection) => {
    setCollectionToEdit(collection);
    setIsCollectionEditModalOpen(true);
  };

  const handleCloseCollectionEditModal = () => {
    setIsCollectionEditModalOpen(false);
    setCollectionToEdit(null);
  };

  const handleSaveCollection = (updatedCollection) => {
    updateShopifyPreviewCollection(updatedCollection); // This function needs to be added to StoreContext
  };

  const handleLoadMoreProducts = () => {
    if (shopifyPreviewProducts.pageInfo.hasNextPage) {
      fetchShopifyWizardProducts(10, shopifyPreviewProducts.pageInfo.endCursor);
    }
  };

  const handleLoadMoreCollections = () => {
    if (shopifyPreviewCollections.pageInfo.hasNextPage) {
      fetchShopifyWizardCollections(10, shopifyPreviewCollections.pageInfo.endCursor);
    }
  };

  const storeName = shopifyPreviewMetadata?.name || "Your Store";
  const existingShopifyLogo = shopifyPreviewMetadata?.brand?.logo?.image?.url || shopifyPreviewMetadata?.brand?.squareLogo?.image?.url;

  return (
    <div className="w-full p-4 space-y-6">
      {/* Logo Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Store Logo</CardTitle>
          <CardDescription>
            Optionally, generate a new logo for "{storeName}" using AI.
            The generated logo will be used for your new store if you proceed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <h4 className="font-semibold mb-2">Current Shopify Logo (if any):</h4>
              {existingShopifyLogo ? (
                <img src={existingShopifyLogo} alt={`${storeName} current logo`} className="h-48 w-auto object-contain"/>
              ) : (
                <p className="text-sm text-muted-foreground">No logo found in Shopify data.</p>
              )}
            </div>
            <div>
              <h4 className="font-semibold mb-2">Generated Logo Preview:</h4>
              {isGeneratingLogo && (
                <div className="h-48 w-full flex items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" /> {/* Increased loader size */}
                </div>
              )}
              {!isGeneratingLogo && generatedLogoImage && (
                <div className="h-48 w-auto flex items-center justify-center"> 
                  <img src={generatedLogoImage} alt={`${storeName} AI generated logo`} className="h-full w-auto object-contain"/>
                </div>
              )}
              {!isGeneratingLogo && !generatedLogoImage && (
                <div className="h-48 w-full flex items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mr-2" /> {/* Increased icon size */}
                  <span>Logo will appear here</span>
                </div>
              )}
            </div>
          </div>
          <Button
            onClick={generateShopifyStoreLogo}
            disabled={isGeneratingLogo || !shopifyPreviewMetadata?.name}
            className="w-full md:w-auto"
          >
            {isGeneratingLogo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Generate New Logo with AI
          </Button>
          {logoGenerationError && <p className="text-sm text-destructive text-center mt-2"><AlertTriangle className="inline h-4 w-4 mr-1"/>{logoGenerationError}</p>}
          {!shopifyPreviewMetadata?.name && <p className="text-sm text-amber-600 text-center mt-2">Store name from Shopify is required to generate a logo.</p>}
        </CardContent>
      </Card>

      {/* Existing Products and Collections Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Products ({shopifyPreviewProducts.edges.length} loaded)</h3>
          {shopifyImportError && shopifyImportError.includes("products") && <p className="text-destructive text-sm mb-2">{shopifyImportError}</p>}
          <ScrollArea className="h-60 border rounded p-2">
            {shopifyPreviewProducts.edges.length === 0 && !isFetchingShopifyPreviewData && <p className="text-muted-foreground text-sm p-2">No products loaded yet or none found.</p>}
            {shopifyPreviewProducts.edges.map(({ node: product }) => (
              <div key={product.id} className="p-3 border-b last:border-b-0">
                <div className="flex items-start space-x-3">
                  {product.images?.edges[0]?.node?.url && (
                    <img src={product.images.edges[0].node.url} alt={product.title} className="h-16 w-16 rounded object-cover border"/>
                  )}
                  {!product.images?.edges[0]?.node?.url && (
                    <div className="h-16 w-16 bg-muted rounded border flex items-center justify-center text-muted-foreground"><ImageIcon size={24}/></div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{product.title}</p>
                    {product.variants?.edges[0]?.node?.price && (
                      <p className="text-xs text-muted-foreground">
                        Price: {product.variants.edges[0].node.price.amount} {product.variants.edges[0].node.price.currencyCode}
                      </p>
                    )}
                    {product.description && (
                       <p className="text-xs text-muted-foreground mt-1 truncate" title={product.description}>
                         Desc: {product.description.substring(0, 50)}{product.description.length > 50 ? '...' : ''}
                       </p>
                    )}
                    {product.tags && product.tags.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">Tags: {product.tags.join(', ')}</p>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)} className="ml-auto">
                    <EditIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {isFetchingShopifyPreviewData && shopifyPreviewProducts.pageInfo.hasNextPage && <div className="flex justify-center py-2"><Loader2 className="h-5 w-5 animate-spin" /></div>}
          </ScrollArea>
          {shopifyPreviewProducts.pageInfo.hasNextPage && (
            <Button onClick={handleLoadMoreProducts} disabled={isFetchingShopifyPreviewData} className="mt-2 w-full">
              {isFetchingShopifyPreviewData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Load More Products'}
            </Button>
          )}
          {!shopifyPreviewProducts.pageInfo.hasNextPage && shopifyPreviewProducts.edges.length > 0 && <p className="text-sm text-muted-foreground mt-2 text-center">All products loaded.</p>}
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Collections ({shopifyPreviewCollections.edges.length} loaded)</h3>
          {shopifyImportError && shopifyImportError.includes("collections") && <p className="text-destructive text-sm mb-2">{shopifyImportError}</p>}
          <ScrollArea className="h-60 border rounded p-2">
            {shopifyPreviewCollections.edges.length === 0 && !isFetchingShopifyPreviewData && <p className="text-muted-foreground text-sm p-2">No collections loaded yet or none found.</p>}
            {shopifyPreviewCollections.edges.map(({ node: collection }) => (
              <div key={collection.id} className="p-2 border-b text-sm flex justify-between items-center">
                <span>{collection.title}</span>
                <Button variant="ghost" size="sm" onClick={() => handleEditCollection(collection)}>
                  <EditIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {isFetchingShopifyPreviewData && shopifyPreviewCollections.pageInfo.hasNextPage && <div className="flex justify-center py-2"><Loader2 className="h-5 w-5 animate-spin" /></div>}
          </ScrollArea>
          {shopifyPreviewCollections.pageInfo.hasNextPage && (
            <Button onClick={handleLoadMoreCollections} disabled={isFetchingShopifyPreviewData} className="mt-2 w-full">
              {isFetchingShopifyPreviewData ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Load More Collections'}
            </Button>
          )}
          {!shopifyPreviewCollections.pageInfo.hasNextPage && shopifyPreviewCollections.edges.length > 0 && <p className="text-sm text-muted-foreground mt-2 text-center">All collections loaded.</p>}
        </div>
      </div>
      {productToEdit && (
        <ShopifyProductEditModal
          isOpen={isProductEditModalOpen}
          onClose={handleCloseProductEditModal}
          product={productToEdit}
          onSave={handleSaveProduct}
        />
      )}
      {collectionToEdit && (
        <ShopifyCollectionEditModal
          isOpen={isCollectionEditModalOpen}
          onClose={handleCloseCollectionEditModal}
          collection={collectionToEdit}
          onSave={handleSaveCollection}
        />
      )}
    </div>
  );
};

export const ShopifyConfirmImport = () => {
  const {
    shopifyPreviewMetadata,
    shopifyPreviewProducts,
    shopifyPreviewCollections,
    isGenerating,
    shopifyImportError,
    generatedLogoImage // To display in confirmation
  } = useStore();

  if (isGenerating) {
     return <div className="flex flex-col items-center justify-center h-full"><Loader2 className="h-12 w-12 animate-spin text-primary mb-4" /><p>Finalizing import...</p></div>;
  }
  if (shopifyImportError && !isGenerating) { // Show error only if not in final generation phase (where error might be from previous step)
    return <div className="text-destructive text-center p-4"><AlertTriangle className="h-8 w-8 mx-auto mb-2" />Error: {shopifyImportError}</div>;
  }

  const shopifyProvidedLogo = shopifyPreviewMetadata?.brand?.logo?.image?.url || shopifyPreviewMetadata?.brand?.squareLogo?.image?.url;
  const logoToDisplay = generatedLogoImage || shopifyProvidedLogo;

  return (
    <div className="w-full p-4 text-center">
      <h3 className="text-xl font-semibold mb-4">Confirm Import Details</h3>
      <Card className="max-w-lg mx-auto">
        <CardHeader>
            <CardTitle>Store: {shopifyPreviewMetadata?.name || 'N/A'}</CardTitle>
            {logoToDisplay && (
                <div className="mt-2 flex justify-center">
                    <img
                        src={logoToDisplay}
                        alt={`${shopifyPreviewMetadata?.name || 'Store'} logo`}
                        className="h-40 w-auto object-contain" /* Removed p-1 */
                    />
                </div>
            )}
            {generatedLogoImage && <p className="text-xs text-green-600 mt-1">New AI-generated logo will be used.</p>}
            {!generatedLogoImage && shopifyProvidedLogo && <p className="text-xs text-muted-foreground mt-1">Existing Shopify logo will be used.</p>}
            {!generatedLogoImage && !shopifyProvidedLogo && <p className="text-xs text-muted-foreground mt-1">A placeholder logo will be used.</p>}
        </CardHeader>
        <CardContent>
            <p className="mb-3">You are about to import the following from Shopify:</p>
            <ul className="list-disc list-inside text-left mx-auto max-w-md bg-muted p-4 rounded space-y-1">
                <li><strong>Products:</strong> {shopifyPreviewProducts?.edges?.length || 0} items</li>
                <li><strong>Collections:</strong> {shopifyPreviewCollections?.edges?.length || 0} groups</li>
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">
                Click "Finalize Import" to create a new store with this data.
            </p>
        </CardContent>
      </Card>
    </div>
  );
};

// TODO: Add ShopifyLocalizationPreview if needed
