import React, { useState } from 'react';
// Link is no longer needed here as navigation happens from the dialog
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CollectionProductsDialog from './CollectionProductsDialog'; // Import the new dialog
import InlineTextEdit from '@/components/ui/InlineTextEdit'; // Added import
import { useStore } from '@/contexts/StoreContext'; // Added import

const CollectionCard = ({ collection, onCollectionClick, isAdmin, onSaveCollectionText, collectionIndex }) => { // Added isAdmin, onSaveCollectionText, collectionIndex
  const placeholderImage = `https://images.unsplash.com/photo-1588099768531-a72d4a198538?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNsb3RoaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60`;

  const collectionTitle = collection?.name || "Unnamed Collection"; // Use name as primary
  const collectionDescription = collection?.description || `Explore our ${collectionTitle} collection.`;
  const collectionImageSrc = collection?.image?.src || placeholderImage;
  const collectionImageAlt = `Image for ${collectionTitle}`;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative block overflow-hidden rounded-xl shadow-lg cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onClick={() => onCollectionClick(collection)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onCollectionClick(collection)}
    >
      <img
        src={collectionImageSrc}
        alt={collectionImageAlt}
        className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-80 lg:h-96"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 
          className="text-2xl font-bold group-hover:underline group-hover:decoration-primary"
          // style={{ textShadow: '0px 1px 4px rgba(0,0,0,0.7)' }} // Text shadow might interfere with editing
        >
          <InlineTextEdit
            initialText={collectionTitle}
            onSave={(newText) => onSaveCollectionText(collectionIndex, 'name', newText)}
            isAdmin={isAdmin}
            placeholder="Collection Title"
            textClassName="text-2xl font-bold" // Ensure styles apply to text
            // className="w-full" // Container class if needed
          />
        </h3>
        <p 
          className="mt-1 text-sm opacity-90 line-clamp-2"
          // style={{ textShadow: '0px 1px 3px rgba(0,0,0,0.6)' }}
        >
          <InlineTextEdit
            initialText={collectionDescription}
            onSave={(newText) => onSaveCollectionText(collectionIndex, 'description', newText)}
            isAdmin={isAdmin}
            placeholder="Collection Description"
            useTextarea={true}
            textClassName="text-sm opacity-90" // Ensure styles apply to text
            // className="w-full"
          />
        </p>
        <div className="mt-4 inline-flex items-center text-sm font-medium text-primary group-hover:text-yellow-300 transition-colors">
          View Products <ArrowRight className="ml-1.5 h-4 w-4" />
        </div>
      </div>
    </motion.div>
  );
};

const StoreCollections = ({ store, isPublishedView = false }) => {
  const { updateStore } = useStore(); // Get updateStore from context
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  const collections = store?.collections;
  const storeId = store?.id;
  const isAdmin = !isPublishedView; // Define isAdmin
  const content = store?.content || {}; // Ensure content object exists

  const handleCollectionClick = (collection) => {
    // Ensure the collection has products; this check might be redundant if StoreContext always provides them
    // The `loadStores` function in StoreContext is responsible for populating `collection.products`
    console.log("Clicked collection:", collection);
    if (collection && storeId) {
        // The products should already be part of the collection object from StoreContext
        // If collection.products is missing or empty, it means either:
        // 1. The collection genuinely has no products linked.
        // 2. There's an issue in StoreContext's loadStores or commonStoreCreation where products aren't being correctly associated.
        // Based on previous analysis, StoreContext *should* be populating this.
        setSelectedCollection(collection);
        setIsDialogOpen(true);
    } else {
        console.warn("Collection data or store ID is missing for dialog.", { collection, storeId });
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCollection(null);
  };

  const handleSaveText = async (field, value) => {
    if (storeId) {
      try {
        if (field === 'collectionsSectionTitle') {
          await updateStore(storeId, { content: { ...content, collectionsSectionTitle: value } });
        }
      } catch (error) {
        console.error(`Failed to update store ${field}:`, error);
      }
    }
  };

  const handleSaveCollectionText = async (index, field, value) => {
    if (storeId && collections && collections[index]) {
      const updatedCollections = collections.map((col, i) => {
        if (i === index) {
          return { ...col, [field]: value };
        }
        return col;
      });
      try {
        await updateStore(storeId, { collections: updatedCollections });
      } catch (error) {
        console.error(`Failed to update collection ${field} at index ${index}:`, error);
      }
    }
  };
  
  const sectionTitle = content?.collectionsSectionTitle || "Shop by Collection";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 12 }
    },
  };

  return (
    <>
      <section id={`collections-${store?.id || 'featured-collections'}`} className="container mx-auto px-4 pt-6 pb-12"> 
        <motion.h2 
          className="text-3xl font-bold tracking-tight text-center mb-10 md:mb-12"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <InlineTextEdit
            initialText={sectionTitle}
            onSave={(newText) => handleSaveText('collectionsSectionTitle', newText)}
            isAdmin={isAdmin}
            placeholder="Section Title"
            textClassName="text-3xl font-bold tracking-tight text-center"
            // className="w-full text-center" // Container class
          />
        </motion.h2>
        {!collections || collections.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No collections to display yet. Collections will appear here once added!</p>
            {!isPublishedView && (
              <Button variant="outline" className="mt-4" onClick={() => console.log('Manage Collections clicked - implement navigation or modal')}>
                Manage Collections
              </Button>
            )}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          > 
            {collections.map((collection, index) => ( // Added index
              <motion.div key={collection.id || collection.name} variants={itemVariants}>
                <CollectionCard 
                  collection={collection} 
                  onCollectionClick={handleCollectionClick}
                  isAdmin={isAdmin} // Pass isAdmin
                  onSaveCollectionText={handleSaveCollectionText} // Pass save handler
                  collectionIndex={index} // Pass index
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
      {selectedCollection && storeId && (
        <CollectionProductsDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          collection={selectedCollection}
          store={store}
          storeId={storeId}
          isPublishedView={isPublishedView}
        />
      )}
    </>
  );
};

export default StoreCollections;
