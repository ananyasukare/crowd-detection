import React, { useState, useEffect } from 'react';
import { superAdminAPI, officeAPI } from '../../services/api';
import { FiPlus, FiBriefcase, FiUser, FiMapPin, FiActivity, FiSearch, FiTrash2, FiSettings, FiGrid, FiBell, FiLogOut, FiMap, FiMail, FiPhone, FiEdit2 } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import toast from 'react-hot-toast';
import Loader from '../../components/user/Loader';
import { useAuth } from '../../context/AuthContext';
import 'leaflet/dist/leaflet.css';

// Component to handle map clicks and update coordinates
const MapPicker = ({ setCoordinates }) => {
  useMapEvents({
    click(e) {
      setCoordinates({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
      toast.success("Location selected!");
    },
  });
  return null;
};

const SuperAdmin = () => {
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState('offices');
  const [offices, setOffices] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddOffice, setShowAddOffice] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Form states
  const [officeForm, setOfficeForm] = useState({
    name: '', branch: '', location: '', category: 'Bank', 
    latitude: 28.61, longitude: 77.20, max_capacity: 100
  });
  
  const [adminForm, setAdminForm] = useState({
    name: '', email: '', password: '', phone: '', office_id: ''
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [officesRes, adminsRes] = await Promise.all([
        officeAPI.getAll(),
        superAdminAPI.listAdmins()
      ]);
      setOffices(officesRes.data);
      setAdmins(adminsRes.data);
    } catch (err) {
      toast.error("Failed to fetch initial data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOffice = async (e) => {
    e.preventDefault();
    try {
      await officeAPI.create(officeForm);
      toast.success("Office added successfully!");
      setShowAddOffice(false);
      fetchInitialData();
    } catch (err) {
      toast.error("Failed to add office");
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        await superAdminAPI.updateAdmin(editingAdmin.id, {
          name: adminForm.name,
          email: adminForm.email,
          phone: adminForm.phone,
          office_id: adminForm.office_id
        });
        toast.success("Admin updated successfully!");
      } else {
        const { office_id, ...adminData } = adminForm;
        await superAdminAPI.createAdmin(adminData, office_id);
        toast.success("Admin created successfully!");
      }
      setShowAddAdmin(false);
      setEditingAdmin(null);
      setAdminForm({ name: '', email: '', password: '', phone: '', office_id: '' });
      fetchInitialData();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Action failed");
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm("Delete this administrator?")) return;
    try {
      await superAdminAPI.deleteAdmin(id);
      toast.success("Admin removed");
      fetchInitialData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setAdminForm({
      name: admin.name,
      email: admin.email,
      phone: admin.phone || '',
      office_id: admin.office_id || '',
      password: '' // Keep empty for edit
    });
    setShowAddAdmin(true);
  };

  const handleDeleteOffice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this office? All related tokens will be lost.")) return;
    try {
      await superAdminAPI.deleteOffice(id);
      toast.success("Office deleted");
      fetchInitialData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const updateCoords = (coords) => {
    setOfficeForm(prev => ({
      ...prev,
      latitude: coords.lat,
      longitude: coords.lng
    }));
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-inter">
      {/* Sidebar */}
      <aside className="w-80 bg-[#0F172A] flex flex-col h-screen sticky top-0 border-r border-slate-800 shrink-0">
        <div className="p-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20">
              Q
            </div>
            <div>
              <h1 className="text-white font-black text-xl tracking-tight leading-tight">SuperAdmin</h1>
              <p className="text-indigo-400 text-[10px] uppercase font-black tracking-widest">Master Control</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <div className="px-4 py-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Core Management</p>
            <button onClick={() => setActiveTab('offices')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${activeTab === 'offices' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <FiBriefcase className="text-lg" /> <span className="font-bold">Manage Offices</span>
            </button>
            <button onClick={() => setActiveTab('admins')} className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl mt-2 transition-all duration-300 ${activeTab === 'admins' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <FiUser className="text-lg" /> <span className="font-bold">Branch Admins</span>
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-slate-800/50">
          <button onClick={logout} className="w-full flex items-center space-x-3 px-4 py-3.5 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold">
            <FiLogOut /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 shrink-0 relative z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-black text-slate-900 capitalize">{activeTab}</h2>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <p className="text-sm text-slate-500 font-medium">System Status: <span className="text-emerald-500 font-bold">Operational</span></p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 pl-6 border-l border-slate-100">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">{user?.name || 'Super Admin'}</p>
                <p className="text-[10px] text-indigo-600 font-black uppercase tracking-wider">Root Access</p>
              </div>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
                {user?.name?.[0] || 'S'}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'offices' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">Registered Offices</h3>
                    <p className="text-slate-500 mt-1">Manage all service locations across the platform.</p>
                  </div>
                  <button onClick={() => setShowAddOffice(true)} className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-700">
                    <FiPlus className="inline mr-2" /> Add Office
                  </button>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                          <th className="px-8 py-5">Office Identity</th>
                          <th className="px-8 py-5">Category</th>
                          <th className="px-8 py-5">Location</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {offices.map((office) => (
                          <tr key={office._id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="px-8 py-6">
                              <p className="font-black text-slate-900">{office.name}</p>
                              <p className="text-xs text-slate-500">{office.branch}</p>
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                {office.category}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-slate-700 font-bold">
                              <FiMapPin className="inline mr-1 text-indigo-500" /> {office.location}
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button onClick={() => handleDeleteOffice(office._id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>
            )}

            {activeTab === 'admins' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-slate-900">Branch Administrators</h3>
                    <p className="text-slate-500 mt-1">Assign and manage managers for each registered office.</p>
                  </div>
                  <button onClick={() => { setEditingAdmin(null); setAdminForm({ name: '', email: '', password: '', phone: '', office_id: '' }); setShowAddAdmin(true); }} className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-700">
                    <FiPlus className="inline mr-2" /> Add Admin
                  </button>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                   <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                        <tr>
                          <th className="px-8 py-5">Administrator</th>
                          <th className="px-8 py-5">Assigned Office</th>
                          <th className="px-8 py-5">Contact</th>
                          <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {admins.map((admin) => (
                          <tr key={admin._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                                  {admin.name[0]}
                                </div>
                                <p className="font-black text-slate-900">{admin.name}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-slate-600 font-bold">
                              {offices.find(o => o._id === admin.office_id)?.name || 'Unassigned'}
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-xs text-slate-500 space-y-1">
                                <p className="flex items-center"><FiMail className="mr-1.5" /> {admin.email}</p>
                                <p className="flex items-center"><FiPhone className="mr-1.5" /> {admin.phone}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-right space-x-2">
                              <button onClick={() => handleEditAdmin(admin)} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                                <FiEdit2 />
                              </button>
                              <button onClick={() => handleDeleteAdmin(admin.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                <FiTrash2 />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Office Modal (Same as before) */}
      {showAddOffice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl p-10 shadow-2xl flex flex-col md:flex-row gap-10">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl font-black text-slate-900">Register Branch</h2>
              <form onSubmit={handleAddOffice} className="space-y-4">
                <input type="text" placeholder="Office Name" className="input-field" required value={officeForm.name} onChange={e => setOfficeForm({...officeForm, name: e.target.value})} />
                <input type="text" placeholder="Branch Identity" className="input-field" required value={officeForm.branch} onChange={e => setOfficeForm({...officeForm, branch: e.target.value})} />
                <input type="text" placeholder="City" className="input-field" required value={officeForm.location} onChange={e => setOfficeForm({...officeForm, location: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" step="any" className="input-field" required value={officeForm.latitude} readOnly />
                  <input type="number" step="any" className="input-field" required value={officeForm.longitude} readOnly />
                </div>
                <div className="flex space-x-3 mt-6">
                  <button type="button" onClick={() => setShowAddOffice(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20">Save Office</button>
                </div>
              </form>
            </div>
            <div className="flex-1 min-h-[400px] bg-slate-100 rounded-[2rem] overflow-hidden">
              <MapContainer center={[28.61, 77.20]} zoom={11} className="h-full w-full">
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapPicker setCoordinates={updateCoords} />
                <Marker position={[officeForm.latitude, officeForm.longitude]} />
              </MapContainer>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-lg p-12 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-8">{editingAdmin ? 'Edit Branch Manager' : 'Appoint Branch Manager'}</h2>
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <input type="text" placeholder="Manager Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium" required value={adminForm.name} onChange={e => setAdminForm({...adminForm, name: e.target.value})} />
              <input type="email" placeholder="Email Address" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium" required value={adminForm.email} onChange={e => setAdminForm({...adminForm, email: e.target.value})} />
              {!editingAdmin && (
                <input type="password" placeholder="Initial Password" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium" required value={adminForm.password} onChange={e => setAdminForm({...adminForm, password: e.target.value})} />
              )}
              <input type="tel" placeholder="Phone Number" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium" required value={adminForm.phone} onChange={e => setAdminForm({...adminForm, phone: e.target.value})} />
              <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-medium" required value={adminForm.office_id} onChange={e => setAdminForm({...adminForm, office_id: e.target.value})}>
                <option value="">Assign to Office</option>
                {offices.map(o => <option key={o._id} value={o._id}>{o.name} - {o.branch}</option>)}
              </select>
              <div className="flex space-x-3 mt-8">
                <button type="button" onClick={() => { setShowAddAdmin(false); setEditingAdmin(null); }} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold text-slate-600">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-600/20 transition-all hover:bg-indigo-700">
                  {editingAdmin ? 'Update Admin' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdmin;
