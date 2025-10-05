import React, { useState, useEffect } from 'react';
import { useSiteContent } from '../../hooks/useSiteContent';
import { useCars } from '../../hooks/useCars';
import type { SiteContent } from '../../types';
import { UploadIcon } from '../../components/IconComponents';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-12 last:mb-0">
    <h2 className="text-2xl font-bold text-foreground border-b border-border pb-3 mb-6">{title}</h2>
    <div className="bg-secondary p-6 rounded-lg border border-border">
        {children}
    </div>
  </div>
);

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const allSortOptions: Record<string, string> = {
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    'year-desc': 'Year: Newest First',
    'mileage-asc': 'Mileage: Lowest First',
};

const allConditionFilters = ['New', 'Used'];

const SiteContent: React.FC = () => {
    const { siteContent, updateSiteContent } = useSiteContent();
    const { cars } = useCars();
    const [formData, setFormData] = useState<SiteContent>(siteContent);

    useEffect(() => {
        setFormData(siteContent);
    }, [siteContent]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const keys = name.split('.');
        if (keys.length > 1) {
            setFormData(prev => {
                const newFormState = { ...prev };
                let current: any = newFormState;
                for (let i = 0; i < keys.length - 1; i++) {
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = value;
                return newFormState;
            });
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, options } = e.target;
        const value = Array.from(options)
            .filter(option => option.selected)
            .map(option => parseInt(option.value));
        
        setFormData(prev => ({...prev, [name]: value}));
    };
    
    const handleSingleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value ? parseInt(value) : null}));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const base64Image = await fileToBase64(e.target.files[0]);
                setFormData(prev => ({...prev, hero: {...prev.hero, image: base64Image }}));
            } catch (error) {
                console.error("Image conversion failed", error);
                alert("Failed to upload image.");
            }
        }
    };
    
    const handleCheckboxChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      category: 'sortOptions' | 'conditionFilters'
    ) => {
        const { name, checked } = e.target;
        setFormData(prev => {
            const currentOptions = prev.inventorySettings[category];
            const newOptions = checked
                ? [...currentOptions, name]
                : currentOptions.filter(option => option !== name);
            return {
                ...prev,
                inventorySettings: {
                    ...prev.inventorySettings,
                    [category]: newOptions,
                },
            };
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        updateSiteContent(formData);
        alert(`Content saved successfully!`);
    }

    const inputClass = "w-full bg-background border border-input rounded-md p-2 focus:ring-ring focus:border-ring text-foreground";
    const carOptions = cars.map(car => <option key={car.id} value={car.id}>{car.make} {car.model} ({car.year})</option>);

    return (
        <div>
            <h1 className="text-3xl font-bold text-foreground mb-6">Manage Site Content</h1>

            <form onSubmit={handleSave}>
                <Section title="General Settings">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Site Name</label>
                            <input type="text" name="siteName" value={formData.siteName} onChange={handleInputChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Facebook URL</label>
                            <input type="text" name="socialHandles.facebook" value={formData.socialHandles.facebook} onChange={handleInputChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Twitter URL</label>
                            <input type="text" name="socialHandles.twitter" value={formData.socialHandles.twitter} onChange={handleInputChange} className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Instagram URL</label>
                            <input type="text" name="socialHandles.instagram" value={formData.socialHandles.instagram} onChange={handleInputChange} className={inputClass} />
                        </div>
                    </div>
                </Section>
            
                <Section title="Homepage Management">
                    <div className="space-y-6">
                        <h3 className="font-semibold text-lg text-foreground">Hero Section</h3>
                        <div>
                            <label className="block text-sm font-medium mb-1">Hero Title</label>
                            <input type="text" name="hero.title" value={formData.hero.title} onChange={handleInputChange} className={inputClass} />
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
                            <textarea name="hero.subtitle" value={formData.hero.subtitle} onChange={handleInputChange} className={inputClass} rows={2} />
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-1">Hero Background Image</label>
                             <div className="flex items-center gap-4">
                                <img src={formData.hero.image} alt="Hero preview" className="w-40 h-24 object-cover rounded-md border border-border" />
                                <label className="cursor-pointer bg-background border-2 border-dashed border-border rounded-lg p-4 text-center flex-grow">
                                     <UploadIcon className="h-6 w-6 mx-auto mb-1 text-muted-foreground"/>
                                     <span className="text-sm text-muted-foreground">Change Image</span>
                                     <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                 </label>
                             </div>
                        </div>
                        
                        <hr className="border-border"/>
                        
                        <h3 className="font-semibold text-lg text-foreground">Featured Car Sections</h3>
                        <p className="text-xs text-muted-foreground -mt-4">Hold Ctrl (or Cmd on Mac) to select multiple cars.</p>
                        <div>
                            <label className="block text-sm font-medium mb-1">New Arrivals (Max 3)</label>
                            <select name="newArrivalsCarIds" multiple value={formData.newArrivalsCarIds.map(String)} onChange={handleMultiSelectChange} className={inputClass + " h-32"}>
                                {carOptions}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Best Deals (Max 3)</label>
                            <select name="bestDealsCarIds" multiple value={formData.bestDealsCarIds.map(String)} onChange={handleMultiSelectChange} className={inputClass + " h-32"}>
                                {carOptions}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Trending Cars (Max 3)</label>
                            <select name="trendingCarsCarIds" multiple value={formData.trendingCarsCarIds.map(String)} onChange={handleMultiSelectChange} className={inputClass + " h-32"}>
                                {carOptions}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">Quality Pre-Owned (Max 3)</label>
                            <select name="usedCarsCarIds" multiple value={formData.usedCarsCarIds.map(String)} onChange={handleMultiSelectChange} className={inputClass + " h-32"}>
                                {cars.filter(c => c.condition === 'Used').map(car => <option key={car.id} value={car.id}>{car.make} {car.model} ({car.year})</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1">Deal of the Week</label>
                            <select name="dealOfTheWeekCarId" value={formData.dealOfTheWeekCarId || ''} onChange={handleSingleSelectChange} className={inputClass}>
                                 <option value="">None</option>
                                {carOptions}
                            </select>
                        </div>
                    </div>
                </Section>
            
                 <Section title="Contact Page Settings">
                    <div className="space-y-4">
                        <div><label className="block text-sm font-medium mb-1">Address</label><input type="text" name="contactInfo.address" value={formData.contactInfo.address} onChange={handleInputChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium mb-1">Phone</label><input type="text" name="contactInfo.phone" value={formData.contactInfo.phone} onChange={handleInputChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" name="contactInfo.email" value={formData.contactInfo.email} onChange={handleInputChange} className={inputClass} /></div>
                        <h3 className="font-semibold text-lg text-foreground pt-2">Business Hours</h3>
                        <div><label className="block text-sm font-medium mb-1">Monday - Friday</label><input type="text" name="contactInfo.hours.week" value={formData.contactInfo.hours.week} onChange={handleInputChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium mb-1">Saturday</label><input type="text" name="contactInfo.hours.saturday" value={formData.contactInfo.hours.saturday} onChange={handleInputChange} className={inputClass} /></div>
                        <div><label className="block text-sm font-medium mb-1">Sunday</label><input type="text" name="contactInfo.hours.sunday" value={formData.contactInfo.hours.sunday} onChange={handleInputChange} className={inputClass} /></div>
                    </div>
                </Section>
                
                 <Section title="Inventory Page Settings">
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg text-foreground">Available Sort Options</h3>
                            <p className="text-sm text-muted-foreground mb-2">Select which options are available for users.</p>
                            {Object.entries(allSortOptions).map(([value, label]) => (
                                <div key={value} className="flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        id={`sort-${value}`}
                                        name={value}
                                        checked={formData.inventorySettings.sortOptions.includes(value)}
                                        onChange={(e) => handleCheckboxChange(e, 'sortOptions')}
                                        className="h-4 w-4 rounded border-border text-accent focus:ring-ring"
                                    />
                                    <label htmlFor={`sort-${value}`} className="ml-3 block text-sm font-medium text-foreground">
                                        {label}
                                    </label>
                                </div>
                            ))}
                        </div>
                         <div>
                            <h3 className="font-semibold text-lg text-foreground">Available Condition Filters</h3>
                            <p className="text-sm text-muted-foreground mb-2">Select which conditions users can filter by.</p>
                            {allConditionFilters.map((value) => (
                                <div key={value} className="flex items-center mt-2">
                                    <input
                                        type="checkbox"
                                        id={`filter-${value}`}
                                        name={value}
                                        checked={formData.inventorySettings.conditionFilters.includes(value)}
                                        onChange={(e) => handleCheckboxChange(e, 'conditionFilters')}
                                        className="h-4 w-4 rounded border-border text-accent focus:ring-ring"
                                    />
                                    <label htmlFor={`filter-${value}`} className="ml-3 block text-sm font-medium text-foreground">
                                        {value}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </Section>


                <div className="mt-8">
                    <button type="submit" className="w-full md:w-auto bg-primary text-primary-foreground font-bold py-3 px-8 rounded-lg hover:bg-primary/90 transition-colors">
                        Save All Content Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SiteContent;