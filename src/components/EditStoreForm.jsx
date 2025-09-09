
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Switch } from '../components/ui/switch'; // Added Switch import
import { useStore } from '../contexts/StoreContext';

const EditStoreForm = ({ store, open, onOpenChange }) => {
  const navigate = useNavigate();
  const { updateStore, isLoadingStores } = useStore(); // Added isLoadingStores
  
  const [formData, setFormData] = useState({
    name: store.name,
    description: store.description,
    type: store.type,
    theme: {
      primaryColor: store.theme.primaryColor,
      secondaryColor: store.theme.secondaryColor,
      fontFamily: store.theme.fontFamily,
      layout: store.theme.layout,
    },
    settings: { // Initialize settings
      showThemeToggle: store.settings?.showThemeToggle ?? true,
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleThemeChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [name]: value
      }
    }));
  };

  const handleSettingsChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: value
      }
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure formData includes the settings object when updating
    const dataToUpdate = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      theme: formData.theme,
      settings: formData.settings, // Pass the whole settings object
    };
    updateStore(store.id, dataToUpdate);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
          <DialogDescription>
            Customize your store's details and appearance.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Store Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select store type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Theme Settings</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      name="primaryColor"
                      type="color"
                      value={formData.theme.primaryColor}
                      onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.theme.primaryColor}
                      onChange={(e) => handleThemeChange('primaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      name="secondaryColor"
                      type="color"
                      value={formData.theme.secondaryColor}
                      onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      value={formData.theme.secondaryColor}
                      onChange={(e) => handleThemeChange('secondaryColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select 
                    value={formData.theme.fontFamily} 
                    onValueChange={(value) => handleThemeChange('fontFamily', value)}
                  >
                    <SelectTrigger id="fontFamily">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="layout">Layout Style</Label>
                  <Select 
                    value={formData.theme.layout} 
                    onValueChange={(value) => handleThemeChange('layout', value)}
                  >
                    <SelectTrigger id="layout">
                      <SelectValue placeholder="Select layout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="masonry">Masonry</SelectItem>
                      <SelectItem value="carousel">Carousel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Theme Toggle Switch */}
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="showThemeToggle" className="flex items-center">
                    Show Light/Dark Mode Toggle in Store Header
                  </Label>
                  <Switch
                    id="showThemeToggle"
                    checked={formData.settings.showThemeToggle}
                    onCheckedChange={(checked) => handleSettingsChange('showThemeToggle', checked)}
                    disabled={isLoadingStores}
                  />
                   <p className="text-xs text-muted-foreground">
                    Allows customers to switch between light and dark themes on your store page.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoadingStores}>Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStoreForm;
