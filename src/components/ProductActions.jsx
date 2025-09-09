import React from 'react';
import { Button } from './ui/button';
import { BarChart2, GitCompare, Scan } from 'lucide-react';

const ProductActions = ({ product, onVisualize, onAnalyze, onCompare }) => {
  const handleVisualizeClick = (e) => {
    e.stopPropagation(); // Stop event propagation
    if (onVisualize) {
      onVisualize(product);
    }
  };

  const handleAnalyzeClick = (e) => {
    e.stopPropagation(); // Stop event propagation
    if (onAnalyze) {
      onAnalyze(product);
    }
  };

  const handleCompareClick = (e) => {
    e.stopPropagation(); // Stop event propagation
    if (onCompare) {
      onCompare(product);
    }
  };

  return (
    <div className="flex justify-around mt-2">
      <Button variant="ghost" size="sm" onClick={handleAnalyzeClick}>
        <BarChart2 className="h-4 w-4 mr-1" />
        Analyze
      </Button>
      <Button variant="ghost" size="sm" onClick={handleCompareClick}>
        <GitCompare className="h-4 w-4 mr-1" />
        Compare
      </Button>
      <Button variant="ghost" size="sm" onClick={handleVisualizeClick}>
        <Scan className="h-4 w-4 mr-1" />
        Visualize
      </Button>
    </div>
  );
};

export default ProductActions;
