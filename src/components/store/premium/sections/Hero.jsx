import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../../ui/button";
import {
  ArrowRight,
  Edit2Icon,
  Play,
  Sparkles,
  Star,
  TrendingUp,
  ShoppingBag,
  Award,
  Zap,
} from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import ReplaceVideoModal from "../ReplaceVideoModal";
import { useStore } from "../../../../contexts/StoreContext";
import InlineTextEdit from "../../../ui/InlineTextEdit";

const Hero = ({ store, isPublishedView = false }) => {
  const { updateStore, updateStoreTextContent, viewMode } = useStore();
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { scrollY } = useScroll();

  // Parallax effects
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.7]);
  const scale = useTransform(scrollY, [0, 500], [1, 1.1]);

  // Extract values from store prop
  const storeId = store?.id;
  // Content definitions for InlineTextEdit
  const heroBadgeText = store?.content?.heroBadgeText || "Premium Collection 2024";
  const title = store?.content?.heroTitle || store?.name || "Luxury Redefined";
  const subtitle =
    store?.content?.heroDescription ||
    "Experience the pinnacle of premium shopping with our curated collection of extraordinary products designed for the discerning customer.";
  const heroFeature1Text = store?.content?.heroFeature1Text || "Free Worldwide Shipping";
  const heroFeature2Text = store?.content?.heroFeature2Text || "Lifetime Warranty";
  const heroFeature3Text = store?.content?.heroFeature3Text || "Exclusive Access";
  const heroPrimaryCtaText = store?.content?.heroPrimaryCtaText || "Explore Collection";
  const heroSecondaryCtaText = store?.content?.heroSecondaryCtaText || "Watch Story";
  const heroSocialProofMainText = store?.content?.heroSocialProofMainText || "10,000+ happy customers";

  const videoUrl = store?.hero_video_url;
  const imageUrl =
    store?.heroImage?.src?.large ||
    store?.heroImage?.url ||
    store?.hero_video_poster_url ||
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80";
  const primaryCtaLink = `#products-${store?.id || "featured-products"}`;
  const secondaryCtaLink = `#features-${store?.id || "features"}`;
  const primaryColor = store?.theme?.primaryColor || "#8B5CF6";

  // Dynamic background images for rotation
  const backgroundImages = [
    imageUrl,
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1200&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80",
  ];

  // Rotate background images every 6 seconds
  useEffect(() => {
    if (!videoUrl) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [videoUrl, backgroundImages.length]);

  const handleScrollTo = (event, targetId) => {
    event.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenReplaceModal = () => {
    setIsReplaceModalOpen(true);
  };

  const handleVideoReplaced = async (newVideoUrl) => {
    if (storeId && newVideoUrl) {
      try {
        await updateStore(storeId, {
          hero_video_url: newVideoUrl,
          hero_video_poster_url: "",
        });
      } catch (error) {
        console.error("Failed to update store with new video URL:", error);
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-15, 15, -15],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-950 dark:to-pink-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-premium-gradient rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 50, 0],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-80 h-80 bg-premium-gradient rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.35, 0.15],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-premium-gradient rounded-full blur-2xl opacity-15"
          animate={{
            x: [-30, 30, -30],
            y: [-20, 20, -20],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 14, repeat: Infinity }}
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-32 right-20 text-purple-400/30"
        variants={floatingVariants}
        animate="animate"
      >
        <Sparkles className="w-12 h-12" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-16 text-pink-400/30"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <Star className="w-10 h-10" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-1/4 text-blue-400/30"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 4 }}
      >
        <Award className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute bottom-1/3 left-1/4 text-orange-400/30"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 6 }}
      >
        <Zap className="w-9 h-9" />
      </motion.div>

      <motion.div
        className="container mx-auto px-6 relative z-10"
        style={{ y, opacity }}
      >
        <motion.div
          className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-[85vh]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Text Content */}
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left space-y-10 lg:space-y-12"
          >
            {/* Premium Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-premium-gradient rounded-full text-sm font-semibold text-gray-800 dark:text-purple-300 border border-gray-800/50 dark:border-purple-700/50 backdrop-blur-sm mt-[100px]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5 text-gray-800 dark:text-purple-300" />
              </motion.div>
              <InlineTextEdit
                initialText={heroBadgeText}
                onSave={(newText) => updateStoreTextContent('heroBadgeText', newText)}
                isAdmin={!isPublishedView && viewMode === 'edit'}
                as="span"
                textClassName="premium-font-body text-gray-800 dark:text-purple-300"
                inputClassName="premium-font-body text-gray-800 dark:text-purple-300"
              />
            </motion.div>

            {/* Main Title */}
            <InlineTextEdit
              initialText={title}
              onSave={(newText) => updateStoreTextContent('heroTitle', newText)}
              isAdmin={!isPublishedView && viewMode === 'edit'}
              as="h1"
              textClassName="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight tracking-tighter premium-font-display"
              inputClassName="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight tracking-tighter premium-font-display bg-transparent"
              className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black leading-tight tracking-tighter premium-font-display"
            >
              <motion.span
                className="bg-premium-gradient bg-clip-text text-transparent dark:text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 8, repeat: Infinity }}
                style={{
                  backgroundSize: "200% auto",
                }}
              >
                {title}
              </motion.span>
            </InlineTextEdit>

            {/* Subtitle */}
            <InlineTextEdit
              initialText={subtitle}
              onSave={(newText) => updateStoreTextContent('heroDescription', newText)}
              isAdmin={!isPublishedView && viewMode === 'edit'}
              as="p"
              textClassName="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto lg:mx-0 leading-relaxed premium-font-body"
              inputClassName="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto lg:mx-0 leading-relaxed premium-font-body bg-transparent"
              className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto lg:mx-0 leading-relaxed premium-font-body"
              useTextarea={true}
            />

            {/* Premium Features */}
            <motion.div
              className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-3 h-3 bg-premium-gradient rounded-full animate-pulse shadow-lg" />
                <InlineTextEdit
                  initialText={heroFeature1Text}
                  onSave={(newText) => updateStoreTextContent('heroFeature1Text', newText)}
                  isAdmin={!isPublishedView && viewMode === 'edit'}
                  as="span"
                  textClassName="premium-font-body font-medium"
                  inputClassName="premium-font-body font-medium bg-transparent"
                />
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-3 h-3 bg-premium-gradient rounded-full animate-pulse shadow-lg" />
                <InlineTextEdit
                  initialText={heroFeature2Text}
                  onSave={(newText) => updateStoreTextContent('heroFeature2Text', newText)}
                  isAdmin={!isPublishedView && viewMode === 'edit'}
                  as="span"
                  textClassName="premium-font-body font-medium"
                  inputClassName="premium-font-body font-medium bg-transparent"
                />
              </motion.div>
              <motion.div
                className="flex items-center gap-3 text-gray-600 dark:text-gray-400"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-3 h-3 bg-premium-gradient rounded-full animate-pulse shadow-lg" />
                <InlineTextEdit
                  initialText={heroFeature3Text}
                  onSave={(newText) => updateStoreTextContent('heroFeature3Text', newText)}
                  isAdmin={!isPublishedView && viewMode === 'edit'}
                  as="span"
                  textClassName="premium-font-body font-medium"
                  inputClassName="premium-font-body font-medium bg-transparent"
                />
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 pt-8"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="group relative overflow-hidden rounded-full px-10 py-6 text-lg font-bold shadow-2xl transition-all duration-500 bg-premium-gradient text-gray-800 dark:text-white border-0" /* Main CTA button */
                >
                  <Link
                    to={primaryCtaLink}
                    onClick={(e) =>
                      handleScrollTo(e, primaryCtaLink.substring(1))
                    }
                  >
                    <motion.span
                      className="relative z-10 flex items-center gap-3 premium-font-body text-gray-800 dark:text-white"
                      whileHover={{ x: 5 }}
                    >
                      <ShoppingBag className="w-6 h-6 text-gray-800 dark:text-white" />
                      <InlineTextEdit
                        initialText={heroPrimaryCtaText}
                        onSave={(newText) => updateStoreTextContent('heroPrimaryCtaText', newText)}
                        isAdmin={!isPublishedView && viewMode === 'edit'}
                        as="span"
                        textClassName="" // Inherits from parent
                        inputClassName="bg-transparent"
                      />
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2 text-gray-800 dark:text-white" />
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.6 }}
                    />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="group rounded-full px-10 py-6 text-lg font-semibold border-2 border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 backdrop-blur-sm"
                >
                  <Link
                    to={secondaryCtaLink}
                    onClick={(e) =>
                      handleScrollTo(e, secondaryCtaLink.substring(1))
                    }
                  >
                    <motion.span
                      className="flex items-center gap-3 premium-font-body"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Play className="w-5 h-5" />
                      <InlineTextEdit
                        initialText={heroSecondaryCtaText}
                        onSave={(newText) => updateStoreTextContent('heroSecondaryCtaText', newText)}
                        isAdmin={!isPublishedView && viewMode === 'edit'}
                        as="span"
                        textClassName="" // Inherits from parent
                        inputClassName="bg-transparent"
                      />
                    </motion.span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-8"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 rounded-full bg-premium-gradient border-2 border-white dark:border-gray-900 flex items-center justify-center text-white font-bold text-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + i * 0.1 }}
                    >
                      {String.fromCharCode(65 + i - 1)}
                    </motion.div>
                  ))}
                </div>
                <div className="ml-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <InlineTextEdit
                    initialText={heroSocialProofMainText}
                    onSave={(newText) => updateStoreTextContent('heroSocialProofMainText', newText)}
                    isAdmin={!isPublishedView && viewMode === 'edit'}
                    as="p"
                    textClassName="text-sm text-gray-600 dark:text-gray-400 premium-font-body"
                    inputClassName="text-sm text-gray-600 dark:text-gray-400 premium-font-body bg-transparent"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Content */}
          <motion.div
            variants={itemVariants}
            className="relative aspect-square lg:aspect-[4/3] max-w-3xl mx-auto"
          >
            {/* Main container with glassmorphism */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm bg-white/10 dark:bg-black/10 border border-white/20 dark:border-gray-700/20">
              {/* Edit button */}
              {!isPublishedView && (videoUrl || imageUrl) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-6 right-6 z-20 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 text-gray-900 dark:text-white backdrop-blur-sm border-white/30 dark:border-gray-700/30 rounded-full shadow-lg"
                    onClick={handleOpenReplaceModal}
                    title="Replace Media"
                  >
                    <Edit2Icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {/* Video content */}
              {videoUrl ? (
                <div className="relative w-full h-full group">
                  <video
                    key={videoUrl}
                    src={videoUrl}
                    poster={imageUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onPlay={() => setIsVideoPlaying(true)}
                    onPause={() => setIsVideoPlaying(false)}
                  />

                  {/* Video overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Play indicator */}
                  <AnimatePresence>
                    {!isVideoPlaying && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 shadow-2xl">
                          <Play className="w-10 h-10 text-white ml-1" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Image content with rotation */
                <div className="relative w-full h-full">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={backgroundImages[currentImageIndex]}
                      alt="Hero visual"
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="eager"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 1.5 }}
                    />
                  </AnimatePresence>

                  {/* Image overlay */}
                  <div className="absolute inset-0 bg-premium-gradient opacity-20" />
                </div>
              )}

              {/* Decorative elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-32 h-32 bg-premium-gradient rounded-full blur-2xl opacity-30"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-40 h-40 bg-premium-gradient rounded-full blur-3xl opacity-20"
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />
            </div>

            {/* Floating elements around the image */}
            <motion.div
              className="absolute -top-12 -left-12 w-20 h-20 bg-premium-gradient dark:opacity-50 rounded-3xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 flex items-center justify-center shadow-2xl"
              animate={{
                y: [-8, 8, -8],
                rotate: [0, 10, 0],
              }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <Sparkles className="w-10 h-10 text-purple-600 dark:text-purple-400" />
            </motion.div>

            <motion.div
              className="absolute -bottom-6 -right-12 w-24 h-24 bg-premium-gradient dark:opacity-50 rounded-3xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 flex items-center justify-center shadow-2xl"
              animate={{
                y: [8, -8, 8],
                rotate: [0, -10, 0],
              }}
              transition={{ duration: 7, repeat: Infinity, delay: 1 }}
            >
              <Star className="w-12 h-12 text-yellow-500" />
            </motion.div>

            <motion.div
              className="absolute top-1/4 -right-8 w-16 h-16 bg-premium-gradient dark:opacity-50 rounded-2xl backdrop-blur-sm border border-white/30 dark:border-gray-700/30 flex items-center justify-center shadow-xl"
              animate={{
                x: [0, 10, 0],
                y: [-5, 5, -5],
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 2 }}
            >
              <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Replace Video Modal */}
      {!isPublishedView && storeId && (
        <ReplaceVideoModal
          open={isReplaceModalOpen}
          onOpenChange={setIsReplaceModalOpen}
          storeId={storeId}
          currentVideoUrl={videoUrl}
          onVideoReplaced={handleVideoReplaced}
        />
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="w-8 h-12 border-2 border-purple-400/50 dark:border-purple-300/50 rounded-full flex justify-center backdrop-blur-sm">
          <motion.div
            className="w-1.5 h-4 bg-premium-gradient rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero; // Renamed component
