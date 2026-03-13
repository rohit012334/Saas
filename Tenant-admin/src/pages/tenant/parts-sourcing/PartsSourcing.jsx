import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, Filter, Plus, Package, ShoppingCart, 
  ExternalLink, Bookmark, CheckCircle, Info
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Badge } from '@/components/shared/Badge';

const PartsSourcing = () => {
  const { t } = useTranslation();

  const brands = ['BOSCH', 'NGK', 'Mobil1', 'Castrol', 'Brembo', 'Mann Filter'];
  const categories = ['Engine', 'Brakes', 'Suspension', 'Electrical', 'Filters', 'Lubricants'];

  const results = [
    { id: 1, name: 'BOSCH Spark Plug', price: 450, code: 'FR7DC+', brand: 'BOSCH', availability: 'In Stock', rating: 4.8 },
    { id: 2, name: 'Mobil1 Engine Oil 5W-30', price: 3200, code: 'MOB-5W30-4L', brand: 'Mobil1', availability: 'In Stock', rating: 4.9 },
    { id: 3, name: 'Brembo Brake Pads (Front)', price: 5800, code: 'P06038', brand: 'Brembo', availability: '2-3 Days', rating: 4.7 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('sidebar:partsSourcing')} 
        breadcrumbs={['GMS', t('sidebar:partsSourcing')]}
      />

      <div className="glass-card p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
         <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center text-white">Find parts from global suppliers</h2>
            <div className="relative flex items-center gap-3">
               <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                  <input 
                    placeholder="Search by Part Name, Number, or OEM Code..." 
                    className="w-full bg-surface border border-border rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-smooth shadow-2xl" 
                  />
               </div>
               <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold transition-smooth shadow-xl shadow-primary/20">
                  Search
               </button>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
               {['Honda City 2021', 'Engine Parts', 'Brake Pads', 'Oil Filters'].map(tag => (
                 <span key={tag} className="text-[10px] text-muted bg-white/5 border border-border px-2 py-1 rounded-full cursor-pointer hover:bg-white/10 transition-smooth">
                    {tag}
                 </span>
               ))}
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Filters Sidebar */}
         <div className="lg:col-span-3 space-y-6">
            <div className="surface-card p-6">
               <h3 className="font-bold text-sm mb-4 border-b border-border pb-2 uppercase tracking-wider">Brands</h3>
               <div className="space-y-2">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" className="w-4 h-4 rounded border-border bg-surface text-primary" />
                       <span className="text-sm text-muted group-hover:text-white transition-smooth">{brand}</span>
                    </label>
                  ))}
               </div>
            </div>
            <div className="surface-card p-6">
               <h3 className="font-bold text-sm mb-4 border-b border-border pb-2 uppercase tracking-wider">Category</h3>
               <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                       <input type="checkbox" className="w-4 h-4 rounded border-border bg-surface text-primary" />
                       <span className="text-sm text-muted group-hover:text-white transition-smooth">{cat}</span>
                    </label>
                  ))}
               </div>
            </div>
         </div>

         {/* Results Grid */}
         <div className="lg:col-span-9 space-y-6">
            <div className="flex items-center justify-between">
               <p className="text-sm text-muted">Showing {results.length} results for "Spark Plug"</p>
               <div className="flex gap-2">
                  <button className="p-2 border border-border rounded-lg text-muted hover:text-white"><Filter size={18} /></button>
                  <select className="bg-surface border border-border rounded-lg text-sm px-3 py-1 outline-none">
                     <option>Price: Low to High</option>
                     <option>Price: High to Low</option>
                  </select>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {results.map(item => (
                 <div key={item.id} className="glass-card overflow-hidden group hover:border-primary transition-smooth flex flex-col">
                    <div className="aspect-square bg-surface flex items-center justify-center p-8 relative overflow-hidden">
                       <Package size={64} className="text-muted/20 group-hover:text-primary/20 transition-smooth" />
                       <img src={`https://picsum.photos/seed/${item.id + 50}/300/300`} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:opacity-60 transition-smooth" alt="part" />
                       <div className="absolute top-3 right-3 flex flex-col gap-2">
                          <button className="p-2 bg-background/80 backdrop-blur rounded-lg text-muted hover:text-white shadow-xl translate-x-12 group-hover:translate-x-0 transition-smooth">
                             <Bookmark size={16} />
                          </button>
                       </div>
                    </div>
                    <div className="p-5 space-y-4 flex-1 flex flex-col">
                       <div>
                          <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">{item.brand}</p>
                          <h4 className="text-white font-bold text-lg leading-tight mb-1">{item.name}</h4>
                          <p className="text-muted text-xs font-mono">{item.code}</p>
                       </div>
                       
                       <div className="flex items-center justify-between">
                          <p className="text-2xl font-black text-white">₹{item.price}</p>
                          <Badge variant={item.availability === 'In Stock' ? 'success' : 'warning'}>{item.availability}</Badge>
                       </div>

                       <div className="mt-auto pt-4 flex gap-2">
                          <button className="flex-1 bg-surface border border-border text-white px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-white/5 transition-smooth flex items-center justify-center gap-2">
                             <Plus size={14} /> Add to PO
                          </button>
                          <button className="flex-1 bg-primary text-white px-3 py-2.5 rounded-xl text-xs font-bold hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2">
                             <ShoppingCart size={14} /> Buy Now
                          </button>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};

export default PartsSourcing;
