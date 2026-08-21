import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Scissors, X } from 'lucide-react';
import { api } from '../api/client';
import { Service } from '../types';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('24 Hours');
  const [availability, setAvailability] = useState('Available');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchServices = async () => {
    try {
      const res = await api.get('/services/admin/all');
      setServices(res.data.services);
    } catch (err) {
      console.error('Failed to fetch services', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setName(service.name);
      setDescription(service.description);
      setPrice(service.price);
      setDuration(service.duration);
      setAvailability(service.availability);
      setImageUrl(service.imageUrl);
    } else {
      setEditingService(null);
      setName('');
      setDescription('');
      setPrice('₹499 / saree');
      setDuration('24 Hours');
      setAvailability('Available');
      setImageUrl('');
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('duration', duration);
      formData.append('availability', availability);

      if (selectedFile) {
        formData.append('imageFile', selectedFile);
      } else if (imageUrl) {
        formData.append('imageUrl', imageUrl);
      }

      if (editingService) {
        await api.put(`/services/${editingService.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      fetchServices();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save service', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/services/${id}`);
        fetchServices();
      } catch (err) {
        console.error('Failed to delete service', err);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-pj-gold/20 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-pj-maroonDark">Manage Services Catalog</h1>
          <p className="text-xs text-pj-charcoal/70">Add, edit pricing, descriptions, and availability for saree services</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 rounded-xl bg-pj-maroon text-pj-gold font-bold text-xs shadow-md flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service Package</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-xs text-pj-charcoal/60">Loading services catalog...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv) => (
            <div key={srv.id} className="bg-pj-creamLight rounded-3xl overflow-hidden border border-pj-gold/20 shadow-card flex flex-col justify-between">
              <div className="relative h-44 bg-pj-creamDark">
                <img src={srv.imageUrl} alt={srv.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-pj-maroon text-pj-gold">
                  {srv.price}
                </span>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="font-serif font-bold text-lg text-pj-maroonDark">{srv.name}</h3>
                <p className="text-xs text-pj-charcoal/75 line-clamp-2">{srv.description}</p>
                
                <div className="text-[11px] text-pj-charcoal/60 flex items-center justify-between pt-2 border-t border-pj-gold/15">
                  <span>Duration: {srv.duration}</span>
                  <span className="font-semibold text-pj-goldDark">{srv.availability}</span>
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleOpenModal(srv)}
                    className="p-2 rounded-xl bg-pj-gold/15 text-pj-maroonDark hover:bg-pj-gold/30 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(srv.id)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="max-w-xl w-full bg-pj-creamLight rounded-3xl p-6 sm:p-8 border border-pj-gold/40 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-5 right-5 p-2 text-pj-charcoal/60 hover:text-pj-maroon">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-serif text-2xl font-bold text-pj-maroonDark mb-4">
              {editingService ? 'Edit Service Package' : 'Create New Service Package'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Bridal Saree Preparation"
                  className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What is included in this package..."
                  className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Price *</label>
                  <input
                    type="text"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="₹599 / saree"
                    className="w-full px-3 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="24 Hours"
                    className="w-full px-3 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Availability</label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-xs font-semibold"
                  >
                    <option value="Available">Available</option>
                    <option value="High Demand">High Demand</option>
                    <option value="Booking Open">Booking Open</option>
                    <option value="Limited Slots">Limited Slots</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-pj-maroonDark mb-1">Upload Service Image OR Image URL</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-pj-charcoal/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pj-gold/20 file:text-pj-maroonDark hover:file:bg-pj-gold/30 mb-2"
                />
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl border border-pj-gold/30 bg-white text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-xl bg-maroon-gradient text-pj-gold font-bold text-sm shadow-md"
              >
                {isSaving ? 'Saving Package...' : editingService ? 'Update Service' : 'Create Service Package'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
