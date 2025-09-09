import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Star, ExternalLink, Heart } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useWishlist } from '../../contexts/WishlistContext';

const StarRating = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating);
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < filledStars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
};

const WalmartProductCard = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.usItemId);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.usItemId);
    } else {
      addToWishlist({ ...product, product_id: product.usItemId });
    }
  };

  return (
    <Card key={product.usItemId} className="relative overflow-hidden hover:shadow-xl transition-shadow bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-0 shadow-md">
      <Badge className="absolute top-2 left-2 bg-green-500 text-white z-10">Walmart</Badge>
      <Button
        size="icon"
        className="absolute top-2 right-2 bg-transparent hover:bg-transparent text-red-500 z-10"
        onClick={handleWishlistClick}
      >
        <Heart className={isWishlisted ? 'fill-current' : ''} />
      </Button>
      <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
        <img
          src={product.thumbnailUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium line-clamp-2 h-12">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-blue-600">{product.priceString}</p>
          {product.averageRating && <StarRating rating={product.averageRating} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600"
          onClick={() =>
            window.open(
              `https://www.walmart.com${product.canonicalUrl}`,
              "_blank",
            )
          }
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Product
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WalmartProductCard;
