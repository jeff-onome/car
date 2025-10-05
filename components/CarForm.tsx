
import React, { useState } from 'react';
import { Car } from '../types';
import { UploadIcon, XCircleIcon } from './IconComponents';

type CarFormData = Omit<Car, 'id' | 'dealerId'>;

interface CarFormProps {
  initialData?: CarFormData;
  onSubmit: (data: CarFormData) => void;
  isEdit?: boolean;
  children?: React.ReactNode;
}

const CarForm: React.FC<CarFormProps> = ({ initialData, onSubmit, isEdit = false, children }) => {
  const [formData, setFormData] = useState<CarFormData>(initialData || {
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    engine: '',
    horsepower: 0,
    features: [],
    images: [],
    description: '',
    condition: 'Used',
    tag: undefined,
  });

  const [featuresInput, setFeaturesInput] = useState(initialData?.features.join(', ') || '');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number = value;
    if (type === 'number') {
        processedValue = value === '' ? 0 : parseInt(value, 10);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
  };
  
  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFeaturesInput(e.target.value);
      const featuresArray = e.target.value.split(',').map(f => f.trim()).filter(Boolean);
      setFormData(prev => ({ ...prev, features: featuresArray }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        if (formData.images.length + e.target.files.length > 3) {
            alert("You can upload a maximum of 3 images.");
            return;
        }

        Array.from(e.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setFormData(prev => ({...prev, images: [...prev.images, event.target.result as string]}));
                }
            };
            reader.readAsDataURL(file);
        });
    }
  };

  const removeImage = (index: number) => {
      setFormData(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.images.length === 0) {
        alert("Please upload at least one image.");
        return;
    }
    onSubmit(formData);
  };

  const inputClass = "w-full bg-background border border-input rounded-md p-2 focus:ring-ring focus:border-ring text-foreground";
  
  return (
    <form onSubmit={handleSubmit} className="bg-secondary p-8 rounded-lg border border-border space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium mb-1">Make</label><input type="text" name="make" value={formData.make} onChange={handleChange} className={inputClass} required /></div>
        <div><label className="block text-sm font-medium mb-1">Model</label><input type="text" name="model" value={formData.model} onChange={handleChange} className={inputClass} required /></div>
        { children }
        <div><label className="block text-sm font-medium mb-1">Year</label><input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClass} required /></div>
        <div><label className="block text-sm font-medium mb-1">Price (₦)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className={inputClass} required /></div>
        <div><label className="block text-sm font-medium mb-1">Mileage (mi)</label><input type="number" name="mileage" value={formData.mileage} onChange={handleChange} className={inputClass} required /></div>
        <div><label className="block text-sm font-medium mb-1">Horsepower</label><input type="number" name="horsepower" value={formData.horsepower} onChange={handleChange} className={inputClass} required /></div>
        <div><label className="block text-sm font-medium mb-1">Engine</label><input type="text" name="engine" value={formData.engine} onChange={handleChange} className={inputClass} required /></div>
        <div><label className="block text-sm font-medium mb-1">Fuel Type</label><select name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputClass}><option>Gasoline</option><option>Diesel</option><option>Electric</option><option>Hybrid</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Transmission</label><select name="transmission" value={formData.transmission} onChange={handleChange} className={inputClass}><option>Automatic</option><option>Manual</option></select></div>
        <div><label className="block text-sm font-medium mb-1">Condition</label><select name="condition" value={formData.condition} onChange={handleChange} className={inputClass}><option>New</option><option>Used</option></select></div>
      </div>
      <div><label className="block text-sm font-medium mb-1">Tag (Optional)</label><select name="tag" value={formData.tag || ''} onChange={handleChange} className={inputClass}><option value="">None</option><option value="Best Deal">Best Deal</option><option value="New Arrival">New Arrival</option><option value="Trending">Trending</option></select></div>
      <div><label className="block text-sm font-medium mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={inputClass} required /></div>
      <div><label className="block text-sm font-medium mb-1">Features (comma-separated)</label><input type="text" value={featuresInput} onChange={handleFeaturesChange} className={inputClass} placeholder="e.g., Autopilot, Sunroof, Leather Seats" /></div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Images (up to 3)</label>
        <div className="grid grid-cols-3 gap-4">
            {formData.images.map((img, index) => (
                <div key={index} className="relative">
                    <img src={img} alt={`preview ${index}`} className="w-full h-32 object-cover rounded-md"/>
                    <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5"><XCircleIcon className="w-5 h-5"/></button>
                </div>
            ))}
            {formData.images.length < 3 && (
                <label className="cursor-pointer bg-background border-2 border-dashed border-border rounded-lg p-4 text-center flex flex-col items-center justify-center h-32">
                    <UploadIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground"/>
                    <span className="text-sm text-muted-foreground">Add Image</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                </label>
            )}
        </div>
      </div>

      <button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors">
        {isEdit ? 'Save Changes' : 'Add Vehicle'}
      </button>
    </form>
  );
};

export default CarForm;
