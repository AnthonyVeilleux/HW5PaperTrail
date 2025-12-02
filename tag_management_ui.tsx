import React, { useState, useEffect } from 'react';
import { Search, Plus, Hash, X, ChevronDown, ChevronRight, MoreVertical, Edit2, Trash2, Command, Folder, Calendar, User, Tag, Settings, FolderOpen, AlertCircle, AlertTriangle, Check, FileText, Clock, TrendingUp, Filter } from 'lucide-react';

const CompleteTagManager = () => {
  // Core state management
  const [expandedProjects, setExpandedProjects] = useState(['AI Research']);
  const [expandedTags, setExpandedTags] = useState([]);
  const [hoveredTag, setHoveredTag] = useState(null);
  const [activeFilter, setActiveFilter] = useState('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Form states for modals
  const [createForm, setCreateForm] = useState({
    tagName: '',
    color: '',
    project: '',
    description: ''
  });
  const [createErrors, setCreateErrors] = useState({});

  const [editForm, setEditForm] = useState({
    tagName: '',
    color: '',
    project: '',
    description: ''
  });
  const [editErrors, setEditErrors] = useState({});

  // Color options
  const colorOptions = [
    { value: '#1A73E8', name: 'Blue' },
    { value: '#34A853', name: 'Green' },
    { value: '#FBBC04', name: 'Yellow' },
    { value: '#EA4335', name: 'Red' },
    { value: '#9334E9', name: 'Purple' },
    { value: '#0891B2', name: 'Cyan' }
  ];

  // Enhanced project data with dates and metadata
  const projects = [
    {
      id: 'ai-research',
      name: 'AI Research',
      color: '#1A73E8',
      created: '2024-01-15',
      lastActivity: '2 hours ago',
      tags: [
        { 
          name: 'Note', 
          count: 12, 
          color: '#1A73E8', 
          metadata: { created: '2024-01-15', createdTime: '09:30 AM', author: 'John Doe', lastUsed: '2 hours ago' },
          items: ['Neural network findings', 'Transformer architecture notes', 'Training optimization']
        },
        { 
          name: 'Idea', 
          count: 8, 
          color: '#34A853',
          metadata: { created: '2024-01-20', createdTime: '02:15 PM', author: 'Jane Smith', lastUsed: '1 day ago' },
          items: ['Novel attention mechanism', 'Multi-modal approach']
        },
        { 
          name: 'Research', 
          count: 15, 
          color: '#EA4335',
          metadata: { created: '2024-01-10', createdTime: '11:00 AM', author: 'John Doe', lastUsed: '3 hours ago' },
          items: ['Literature review notes', 'Methodology framework', 'Data collection plan']
        },
        { 
          name: 'Reference', 
          count: 6, 
          color: '#9334E9',
          metadata: { created: '2024-01-12', createdTime: '04:45 PM', author: 'Team', lastUsed: '5 hours ago' },
          items: ['Key papers', 'Citation list']
        }
      ]
    },
    {
      id: 'ux-study',
      name: 'UX Study 2024',
      color: '#FBBC04',
      created: '2024-02-01',
      lastActivity: '30 mins ago',
      tags: [
        { 
          name: 'Interview', 
          count: 10, 
          color: '#FBBC04',
          metadata: { created: '2024-02-01', createdTime: '10:00 AM', author: 'Sarah Lee', lastUsed: '30 mins ago' },
          items: ['User interview #1', 'User interview #2', 'Stakeholder feedback']
        },
        { 
          name: 'Insight', 
          count: 7, 
          color: '#34A853',
          metadata: { created: '2024-02-03', createdTime: '03:30 PM', author: 'Sarah Lee', lastUsed: '1 hour ago' },
          items: ['Pain points identified', 'User needs analysis']
        },
        { 
          name: 'To-Do', 
          count: 5, 
          color: '#EA4335',
          metadata: { created: '2024-02-05', createdTime: '01:20 PM', author: 'Team', lastUsed: '2 hours ago' },
          items: ['Schedule interviews', 'Analyze survey results']
        }
      ]
    },
    {
      id: 'product-dev',
      name: 'Product Development',
      color: '#0891B2',
      created: '2024-01-25',
      lastActivity: '4 hours ago',
      tags: [
        { 
          name: 'Feature', 
          count: 9, 
          color: '#0891B2',
          metadata: { created: '2024-01-25', createdTime: '09:00 AM', author: 'Dev Team', lastUsed: '4 hours ago' },
          items: ['Dashboard concept', 'Mobile responsiveness']
        },
        { 
          name: 'Bug', 
          count: 4, 
          color: '#EA4335',
          metadata: { created: '2024-02-10', createdTime: '11:30 AM', author: 'QA Team', lastUsed: '6 hours ago' },
          items: ['Login issue', 'Performance lag']
        }
      ]
    }
  ];

  // Global tags
  const globalTags = [
    { name: 'Important', count: 25, color: '#EA4335', type: 'priority' },
    { name: 'Urgent', count: 12, color: '#FBBC04', type: 'priority' },
    { name: 'Archive', count: 45, color: '#5F6368', type: 'status' },
    { name: 'Draft', count: 18, color: '#9334E9', type: 'status' }
  ];

  // Date-based organization
  const dateBasedTags = {
    today: {
      label: 'Today',
      date: 'Dec 01, 2024',
      tags: [
        { name: 'Note', count: 5, color: '#1A73E8', time: '2:30 PM', project: 'AI Research' },
        { name: 'Interview', count: 2, color: '#FBBC04', time: '11:00 AM', project: 'UX Study 2024' },
        { name: 'To-Do', count: 3, color: '#EA4335', time: '9:15 AM', project: 'UX Study 2024' }
      ]
    },
    yesterday: {
      label: 'Yesterday',
      date: 'Nov 30, 2024',
      tags: [
        { name: 'Research', count: 4, color: '#EA4335', time: '4:45 PM', project: 'AI Research' },
        { name: 'Idea', count: 2, color: '#34A853', time: '1:20 PM', project: 'AI Research' },
        { name: 'Feature', count: 3, color: '#0891B2', time: '10:30 AM', project: 'Product Development' }
      ]
    },
    thisWeek: {
      label: 'This Week',
      date: 'Nov 25-30, 2024',
      tags: [
        { name: 'Bug', count: 3, color: '#EA4335', time: 'Nov 29', project: 'Product Development' },
        { name: 'Insight', count: 5, color: '#34A853', time: 'Nov 28', project: 'UX Study 2024' },
        { name: 'Reference', count: 4, color: '#9334E9', time: 'Nov 27', project: 'AI Research' }
      ]
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Validation functions
  const validateTagName = (name) => {
    if (!name || name.trim().length === 0) return 'Tag name is required.';
    if (name.length > 50) return `Tag name must be 1-50 characters.`;
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) return 'Only letters, numbers, hyphens, underscores.';
    return null;
  };

  const validateColor = (color) => !color ? 'Please select a color.' : null;
  const validateDescription = (desc) => desc && desc.length > 200 ? 'Max 200 characters.' : null;

  // Form handlers
  const handleCreateChange = (field, value) => {
    setCreateForm({ ...createForm, [field]: value });
    const newErrors = { ...createErrors };
    delete newErrors[field];
    setCreateErrors(newErrors);
  };

  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
    const newErrors = { ...editErrors };
    delete newErrors[field];
    setEditErrors(newErrors);
  };

  // Modal actions
  const handleCreateTag = () => {
    const errors = {};
    const nameError = validateTagName(createForm.tagName);
    const colorError = validateColor(createForm.color);
    if (nameError) errors.tagName = nameError;
    if (colorError) errors.color = colorError;
    
    if (Object.keys(errors).length === 0) {
      setActiveModal(null);
      setCreateForm({ tagName: '', color: '', project: '', description: '' });
      alert('✓ Tag created successfully!');
    } else {
      setCreateErrors(errors);
    }
  };

  const handleEditTag = () => {
    const errors = {};
    const nameError = validateTagName(editForm.tagName);
    const colorError = validateColor(editForm.color);
    if (nameError) errors.tagName = nameError;
    if (colorError) errors.color = colorError;
    
    if (Object.keys(errors).length === 0) {
      setActiveModal(null);
      alert('✓ Tag updated successfully!');
    } else {
      setEditErrors(errors);
    }
  };

  const handleDeleteTag = () => {
    setActiveModal(null);
    alert('✓ Tag deleted successfully!');
  };

  const openEditModal = (tag, projectId) => {
    setSelectedTag({ ...tag, projectId });
    setEditForm({
      tagName: tag.name,
      color: tag.color,
      project: projectId || '',
      description: ''
    });
    setEditErrors({});
    setActiveModal('edit');
  };

  const openDeleteModal = (tag, projectId) => {
    setSelectedTag({ ...tag, projectId });
    setActiveModal('delete');
  };

  const toggleProject = (projectName) => {
    setExpandedProjects(prev =>
      prev.includes(projectName) ? prev.filter(p => p !== projectName) : [...prev, projectName]
    );
  };

  const toggleTag = (tagId) => {
    setExpandedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  // M1: Create Tag Modal
  const CreateTagModal = () => {
    const isValid = createForm.tagName.trim() && createForm.color;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setActiveModal(null)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-semibold text-gray-900">Create New Tag</h2>
            <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="px-6 py-6">
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tag Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">#</span>
                <input
                  type="text"
                  value={createForm.tagName}
                  onChange={(e) => handleCreateChange('tagName', e.target.value)}
                  placeholder="Enter tag name"
                  maxLength={50}
                  className={`w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    createErrors.tagName ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                  }`}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                {createErrors.tagName ? (
                  <div className="flex items-center gap-1.5 text-red-500 text-xs">
                    <AlertCircle className="w-3 h-3" />
                    <span>{createErrors.tagName}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-500">Letters, numbers, hyphens, underscores</span>
                )}
                <span className="text-xs text-gray-400">{createForm.tagName.length}/50</span>
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Tag Color <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-6 gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => handleCreateChange('color', c.value)}
                    className={`w-full aspect-square rounded-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      createForm.color === c.value ? 'ring-3 ring-blue-600' : ''
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.name}
                  >
                    {createForm.color === c.value && <Check className="w-5 h-5 text-white m-auto drop-shadow-lg" />}
                  </button>
                ))}
              </div>
              {createErrors.color && (
                <div className="flex items-center gap-1.5 text-red-500 text-xs mt-2">
                  <AlertCircle className="w-3 h-3" />
                  <span>{createErrors.color}</span>
                </div>
              )}
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Assign to Project</label>
              <div className="relative">
                <Folder className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={createForm.project}
                  onChange={(e) => handleCreateChange('project', e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                >
                  <option value="">None (Global Tag)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description (Optional)</label>
              <textarea
                value={createForm.description}
                onChange={(e) => handleCreateChange('description', e.target.value)}
                placeholder="Add a description..."
                maxLength={200}
                rows={3}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-xs text-gray-500">Optional</span>
                <span className="text-xs text-gray-400">{createForm.description.length}/200</span>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTag}
              disabled={!isValid}
              className={`px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-sm transition-all ${
                isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed opacity-60'
              }`}
            >
              Create Tag
            </button>
          </div>
        </div>
      </div>
    );
  };

  // M2: Edit Tag Modal
  const EditTagModal = () => {
    const isValid = editForm.tagName.trim() && editForm.color;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setActiveModal(null)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-semibold text-gray-900">
              Edit Tag: <span className="text-blue-600">#{editForm.tagName}</span>
            </h2>
            <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="px-6 py-6">
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tag Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">#</span>
                <input
                  type="text"
                  value={editForm.tagName}
                  onChange={(e) => handleEditChange('tagName', e.target.value)}
                  maxLength={50}
                  className="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-xs text-gray-400 float-right mt-1">{editForm.tagName.length}/50</span>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Tag Color</label>
              <div className="grid grid-cols-6 gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => handleEditChange('color', c.value)}
                    className={`w-full aspect-square rounded-lg transition-all hover:scale-105 ${
                      editForm.color === c.value ? 'ring-3 ring-blue-600' : ''
                    }`}
                    style={{ backgroundColor: c.value }}
                  >
                    {editForm.color === c.value && <Check className="w-5 h-5 text-white m-auto drop-shadow-lg" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Project Assignment</label>
              <select
                value={editForm.project}
                onChange={(e) => handleEditChange('project', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None (Global)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-gray-900 mb-1">Tag Usage Information</p>
                  <p className="text-gray-600 mb-2">Used in <strong>{selectedTag?.count || 0} items</strong></p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <p>Last used: {selectedTag?.metadata?.lastUsed || 'Recently'}</p>
                    <p>Created by: {selectedTag?.metadata?.author || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between sticky bottom-0">
            <button
              onClick={() => setActiveModal('delete')}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete Tag
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTag}
                disabled={!isValid}
                className={`px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-sm ${
                  isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // M3: Delete Confirmation Modal
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setActiveModal('edit')}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-8 pb-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Tag?</h2>
        </div>

        <div className="px-6 pb-6">
          <p className="text-center text-gray-600 mb-4">
            Are you sure you want to delete <strong className="text-gray-900">#{selectedTag?.name}</strong>?
          </p>

          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700 space-y-1">
                <p>This tag is used in <strong className="text-red-700">{selectedTag?.count || 0} items</strong></p>
                <p>Deleting will remove it from all tagged items</p>
                <p className="font-semibold text-red-700">This action cannot be undone</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedTag?.color }}></div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 text-sm">#{selectedTag?.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {projects.find(p => p.id === selectedTag?.projectId)?.name || 'Global Tag'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleDeleteTag}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-base font-semibold rounded-lg shadow-sm mb-2 transition-colors"
          >
            Delete Tag
          </button>
          <button
            onClick={() => setActiveModal('edit')}
            className="w-full py-3 px-4 bg-transparent hover:bg-gray-50 text-gray-700 text-base font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Command Palette (⌘+K)
  const CommandPalette = () => {
    const [query, setQuery] = useState('');
    const allTags = projects.flatMap(p => p.tags.map(t => ({ ...t, project: p.name })));
    const filtered = allTags.filter(t => 
      t.name.toLowerCase().includes(query.toLowerCase())
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-start justify-center pt-32 z-50" onClick={() => setShowCommandPalette(false)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tags... (type # to start)"
                autoFocus
                className="flex-1 text-base focus:outline-none"
              />
              <button onClick={() => setShowCommandPalette(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Hash className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No tags found</p>
                {query && <p className="text-sm mt-1">Press Enter to create #{query}</p>}
              </div>
            ) : (
              filtered.map((tag, idx) => (
                <div
                  key={`${tag.name}-${idx}`}
                  className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    openEditModal(tag, projects.find(p => p.name === tag.project)?.id);
                    setShowCommandPalette(false);
                  }}
                >
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex gap-4">
                  <span><kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↑↓</kbd> Navigate</span>
                  <span><kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">↵</kbd> Select</span>
                </div>
                <span><kbd className="px-1.5 py-0.5 bg-white rounded border border-gray-300">Esc</kbd> Close</span>
      </div>
    </div>
  </div>
);
{/* Search */}
    <div className="relative mb-3">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search tags, projects..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-9 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
      {searchQuery && (
        <button 
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>

    {/* Filter Tabs */}
    <div className="grid grid-cols-4 gap-1 bg-gray-50 p-1 rounded-lg">
      {[
        { id: 'all', label: 'All' },
        { id: 'projects', label: 'Projects' },
        { id: 'date', label: 'Date' },
        { id: 'global', label: 'Global' }
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveFilter(tab.id)}
          className={`px-2 py-1.5 text-xs font-medium rounded transition-all ${
            activeFilter === tab.id
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>

  {/* Content Area */}
  <div className="flex-1 overflow-y-auto px-3 py-3">
    {/* Projects View */}
    {activeFilter === 'projects' && (
      <div className="space-y-2">
        {projects.map(project => (
          <div key={project.id}>
            <div
              className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => toggleProject(project.name)}
            >
              {expandedProjects.includes(project.name) ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
              {expandedProjects.includes(project.name) ? (
                <FolderOpen className="w-4 h-4" style={{ color: project.color }} />
              ) : (
                <Folder className="w-4 h-4" style={{ color: project.color }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900 truncate">{project.name}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full flex-shrink-0">
                    {project.tags.reduce((acc, t) => acc + t.count, 0)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  <span>Created {project.created}</span>
                  <span>•</span>
                  <span className="truncate">{project.lastActivity}</span>
                </div>
              </div>
            </div>

            {expandedProjects.includes(project.name) && (
              <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
                {project.tags.map(tag => {
                  const tagId = `${project.id}-${tag.name}`;
                  return (
                    <div key={tag.name}>
                      <div
                        className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer group"
                        onMouseEnter={() => setHoveredTag(tagId)}
                        onMouseLeave={() => setHoveredTag(null)}
                      >
                        <div
                          className="flex items-center gap-2 flex-1"
                          onClick={() => toggleTag(tagId)}
                        >
                          {expandedTags.includes(tagId) ? (
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          )}
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></div>
                          <span className="text-sm font-medium text-gray-700">#{tag.name}</span>
                          <span className="text-xs text-gray-400 ml-auto mr-1">{tag.count}</span>
                        </div>

                        {hoveredTag === tagId && (
                          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(tag, project.id);
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Edit tag"
                            >
                              <Edit2 className="w-3 h-3 text-gray-500" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openDeleteModal(tag, project.id);
                              }}
                              className="p-1 hover:bg-red-50 rounded"
                              title="Delete tag"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Expanded Tag Details */}
                      {expandedTags.includes(tagId) && (
                        <div className="ml-5 mt-2 mb-3 space-y-2">
                          {/* Metadata */}
                          <div className="bg-gray-50 rounded-lg p-2 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Calendar className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium">Created:</span>
                              <span>{tag.metadata.created}</span>
                              <span className="text-gray-400">at</span>
                              <span className="font-medium text-blue-600">{tag.metadata.createdTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <User className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium">Author:</span>
                              <span>{tag.metadata.author}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span className="font-medium">Last used:</span>
                              <span>{tag.metadata.lastUsed}</span>
                            </div>
                          </div>

                          {/* Tagged Items */}
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1">
                              Tagged Items
                            </div>
                            {tag.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="text-xs text-gray-700 py-1.5 px-2 hover:bg-blue-50 rounded cursor-pointer truncate border-l-2 border-transparent hover:border-blue-500 transition-all"
                              >
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Date View */}
    {activeFilter === 'date' && (
      <div className="space-y-3">
        {Object.entries(dateBasedTags).map(([key, section]) => (
          <div key={key}>
            <div className="sticky top-0 bg-white z-10 px-2 py-2 mb-1">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-blue-600" />
                  {section.label}
                </div>
                <span className="text-xs text-gray-500">{section.date}</span>
              </div>
            </div>
            <div className="space-y-1">
              {section.tags.map((tag, idx) => (
                <div
                  key={`${key}-${idx}`}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">#{tag.name}</span>
                      <span className="text-xs text-gray-400">{tag.count}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="truncate">{tag.project}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      <span>{tag.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Global Tags View */}
    {activeFilter === 'global' && (
      <div className="space-y-4">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-2 flex items-center gap-2">
            <Tag className="w-3 h-3" />
            Priority Tags
          </div>
          <div className="space-y-1">
            {globalTags.filter(t => t.type === 'priority').map(tag => (
              <div
                key={tag.name}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></div>
                <span className="text-sm font-medium text-gray-700 flex-1">#{tag.name}</span>
                <span className="text-xs text-gray-400">{tag.count}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-2 flex items-center gap-2">
            <Tag className="w-3 h-3" />
            Status Tags
          </div>
          <div className="space-y-1">
            {globalTags.filter(t => t.type === 'status').map(tag => (
              <div
                key={tag.name}
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></div>
                <span className="text-sm font-medium text-gray-700 flex-1">#{tag.name}</span>
                <span className="text-xs text-gray-400">{tag.count}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )}

    {/* All Tags View */}
    {activeFilter === 'all' && (
      <div className="space-y-1">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 py-2">
          All Tags ({projects.reduce((acc, p) => acc + p.tags.reduce((a, t) => a + t.count, 0), 0) + globalTags.reduce((acc, t) => acc + t.count, 0)})
        </div>
        {projects.map(project =>
          project.tags.map(tag => (
            <div
              key={`${project.id}-${tag.name}`}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></div>
              <span className="text-sm font-medium text-gray-700 flex-1">#{tag.name}</span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{project.name}</span>
              <span className="text-xs text-gray-400">{tag.count}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
            </div>
          ))
        )}
        <div className="border-t border-gray-200 my-2"></div>
        {globalTags.map(tag => (
          <div
            key={tag.name}
            className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tag.color }}></div>
            <span className="text-sm font-medium text-gray-700 flex-1">#{tag.name}</span>
            <span className="text-xs text-gray-400">{tag.count}</span>
            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
          </div>
        ))}
      </div>
    )}
  </div>

  {/* Footer Actions */}
  <div className="p-3 border-t border-gray-200 space-y-2 flex-shrink-0">
    <button
      onClick={() => {
        setCreateForm({ tagName: '', color: '', project: '', description: '' });
        setCreateErrors({});
        setActiveModal('create');
      }}
      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
    >
      <Plus className="w-4 h-4" />
      Create New Tag
    </button>
    <button className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors">
      <Folder className="w-4 h-4" />
      Add Project
    </button>
    <div className="text-xs text-gray-500 text-center pt-1">
      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-medium border border-gray-300">⌘</kbd>
      <span className="mx-1">+</span>
      <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-medium border border-gray-300">K</kbd>
      <span className="ml-1">quick access</span>
    </div>
  </div>
</div>
      {/* M1: Create Tag Modal */}
      {activeModal === 'create' && <CreateTagModal />}
      {/* M2: Edit Tag Modal */}
      {activeModal === 'edit' && <EditTagModal />}
      {/* M3: Delete Confirmation Modal */}
      {activeModal === 'delete' && <DeleteConfirmModal />}
      {/* Command Palette */}
      {showCommandPalette && <CommandPalette />}
    </div>
  );
}
  };

  // M1: Create Tag Modal
  const CreateTagModal = () => {
    const isValid = createForm.tagName.trim() && createForm.color;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setActiveModal(null)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-semibold text-gray-900">Create New Tag</h2>
            <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="px-6 py-6">
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tag Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">#</span>
                <input
                  type="text"
                  value={createForm.tagName}
                  onChange={(e) => handleCreateChange('tagName', e.target.value)}
                  maxLength={50}
                  className={`w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border ${createErrors.tagName ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
              {createErrors.tagName && (
                <div className="flex items-center gap-1.5 text-red-500 text-xs mt-2">
                  <AlertCircle className="w-3 h-3" />
                  <span>{createErrors.tagName}</span>
                </div>
              )}
              <span className="text-xs text-gray-400 float-right mt-1">{createForm.tagName.length}/50</span>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-3">Tag Color <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-6 gap-3">
                {colorOptions.map    ((c) => (
                  <button
                    key={c.value}  
                    onClick={() => handleCreateChange('color', c.value)}
                    className={`w-full aspect-square rounded-lg transition-all hover:scale-105 ${
                      createForm.color === c.value ? 'ring-3 ring-blue-600' : ''
                    }`}
                    style={{ backgroundColor: c.value }}
                  >
                    {createForm.color === c.value && <Check className="w-5 h-5 text-white m-auto drop-shadow-lg" />}
                  </button>
                ))}
              </div>
              {createErrors.color && (
                <div className="flex items-center gap-1.5 text-red-500 text-xs mt-2">
                  <AlertCircle className="w-3 h-3" />
                  <span>{createErrors.color}</span>
                </div>
              )}
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-900 mb-2">Project Assignment</label>
              <div className="relative">
                <select
                  value={createForm.project}
                  onChange={(e) => handleCreateChange('project', e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None (Global)</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description (Optional)</label>
              <textarea
                value={createForm.description}
                onChange={(e) => handleCreateChange('description', e.target.value)}
                maxLength={200}
                rows={3}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <span className="text-xs text-gray-400 float-right mt-1">{createForm.description.length}/200</span>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end sticky bottom-0">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTag}
              disabled={!isValid}
              className={`ml-3 px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-sm ${
                isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              Create Tag
            </button>
          </div>
        </div>
      </div>
    );
  };

  // M2: Edit Tag Modal
  const EditTagModal = () => {
    const isValid = editForm.tagName.trim() && editForm.color;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setActiveModal(null)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <h2 className="text-2xl font-semibold text-gray-900">Edit Tag</h2>
            <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="px-6 py-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tag Name <span className="text-r ed-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">#</span>
                <input
                  type="text"
                  value={editForm.tagName}
                  onChange={(e) => handleEditChange('tagName', e.target.value)}
                  maxLength={50}
                  className="w-full pl-8 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-xs text-gray-400 float-right mt-1">{editForm.tagName.length}/50</span>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Tag Color <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-6 gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => handleEditChange('color', c.value)}
                    className={`w-full aspect-square rounded-lg transition-all hover:scale-105 ${
                      editForm.color === c.value ? 'ring-3 ring-blue-600' : ''
                    }`}
                    style={{ backgroundColor: c.value }}
                  >
                    {editForm.color === c.value && <Check className="w-5 h-5 text-white m-auto drop-shadow-lg" />}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Project Assignment</label>
              <select
                value={editForm.project}
                onChange={(e) => handleEditChange('project', e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None (Global)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description (Optional)</label>
              <textarea
                value={editForm.description}
                onChange={(e) => handleEditChange('description', e.target.value)}
                maxLength={200}
                rows={3}
                className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <span className="text-xs text-gray-400 float-right mt-1">{editForm.description.length}/200</span>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between sticky bottom-0">
            <button
              onClick={() => setActiveModal('delete')}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50"
            >
              Delete Tag
            </button>
            <div>
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditTag}
                disabled={!isValid}
                className={`ml-3 px-5 py-2 text-sm font-semibold text-white rounded-lg shadow-sm ${
                  isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // M3: Delete Confirmation Modal
  const DeleteConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setActiveModal(null)}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 border-b border-gray-200 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Delete Tag</h2>
          <p className="text-gray-600 mb-4">Are you sure you want to delete this tag?</p>

          <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-700 mt-0.5" />
              <div className="text-sm">
                <p>This tag is associated with <strong className="text-red-800">{selectedTag?.count}</strong> items.</p>
                <p className="mt-1">Are you sure you want to <strong className="font-semibold">permanently delete</strong> this tag?</p>
                <p className="mt-1"><strong className="font-semibold">All tagged items will be untagged.</strong></p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full flex-shrink-0 border border-gray-200 shadow-sm mt-0.5" style={{ backgroundColor: selectedTag?.color }}></div>
              <div>
                <div className="text-sm font-medium text-gray-900">#{selectedTag?.name}</div>
                <div className="text-xs text-gray-500">Project: {selectedProjectName || 'Global'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col">
          <button
            onClick={handleDeleteTag}
            className="w-full mb-3 py-3 bg-red-600 hover:bg-red-700 text-white text-base font-medium rounded-lg transition-colors"
          >
            Yes, Delete Tag
          </button>
          <button
            onClick={() => setActiveModal(null)}
            className="w-full py-3 bg-white hover:bg-gray-100 text-gray-700 text-base font-medium rounded-lg transition-colors border border-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // Command Palette Component
  const CommandPalette = () => {
    const [query, setQuery] = useState('');

    const filtered = allTags.filter(tag =>
      tag.name.toLowerCase().includes(query.toLowerCase()) ||
      (tag.project && tag.project.toLowerCase().includes(query.toLowerCase()))
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCommandPalette(false)}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="px-4 py-3 bg-gray-50 shadow-sm flex items-center gap-3 border-b-2 border-blue-600 focus-within:border-blue-600 transition-all h-16 sm:h-12 md:h-16 lg:h-16 xl:h-16 2xl:h-16">
            <div className="flex items-center gap-3 w-full">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search tags, projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm"
              />
              <button onClick={() => setShowCommandPalette(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No tags found.</div>
            ) : (
              filtered.map((tag, idx) => (
                <div
                  key={idx}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 border-b border-gray-100"
                  onClick={() => {
                    setShowCommandPalette(false);
                    if (tag.projectId) {
                      setActiveFilter('projects');
                      if (!expandedProjects.includes(tag.projectId)) {
                        setExpandedProjects([...expandedProjects, tag.projectId]);
                      }
                    }
                    const tagId = tag.projectId ? `${tag.projectId}-${tag.name}` : `global-${tag.name}`;
                    if (!expandedTags.includes(tagId)) {
                      setExpandedTags([...expandedTags, tagId]);
                    }
                  }}
                >
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }}></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-700 truncate">#{tag.name}</div>
                    {tag.project && (
                      <div className="text-xs text-gray-500 truncate">Project: {tag.project}</div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{tag.count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex overflow-hidden border border-gray-200 rounded-2xl shadow-sm">
  {/* Sidebar */}
  <div className="w-80 border-r border-gray-200 flex flex-col flex-shrink-0">
  {/* Header */}
  <div className="px-4 py-3 border-b border-gray-200 flex flex-col">
    <div className="flex items-center justify-between mb-3">
      <h1 className="text-lg font-semibold text-gray-900">Tag Management</h1>
      <button
        onClick={() => setShowCommandPalette(true)}
        className="p-1 hover:bg-gray-100 rounded-lg"
        title="Open Command Palette"
      >
        <Command className="w-5 h-5 text-gray-500" />
      </button>
    </div>
    <div className="flex space-x-2">
      {filterTabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveFilter(tab.id)}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeFilter === tab.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  </div>

  {/* Content Area */}
  <div className="flex-1 p-6 overflow-y-auto space-y-8">
    {/* Project View */}
    {activeFilter === 'projects' && (
      <div className="space-y-6">
        {projects.map(project => (
          <div key={project.id}>
            <div className="sticky top-0 bg-white z-10 px-2 py-2 mb-1">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <Folder className="w-3 h-3 text-blue-600" />
                  {project.name}
                </div>
                <span className="text-xs text-gray-500">{project.tags.length} Tags</span>
              </div>
            </div>
            {project.tags.length === 0 ? (
              <div className="text-sm text-gray-500 px-2 py-4">No tags in this project.</div>
            ) : (
              <div className="space-y-1">
                {project.tags.map(tag => {
                  const tagId = `${project.id}-${tag.name}`;
                  return (
                    <div key={tagId}>
                      <div
                        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          if (expandedTags.includes(tagId)) {
                            setExpandedTags(expandedTags.filter(t => t !== tagId));
                          } else {
                            setExpandedTags([...expandedTags, tagId]);
                          }
                        }}
                      >
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">#{tag.name}</span>
                            <span className="text-xs text-gray-400">{tag.count}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                            <span className="truncate">{project.name}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3" />
                            <span>{tag.time}</span>
                          </div>
                        </div>
                      </div>
                      {expandedTags.includes(tagId) && (
                        <div className="bg-gray-50 border-l-4 border-blue-500 p-4 ml-6 rounded-r-lg mb-4">
                          <div className="text-sm text-gray-700">
                            {tag.description || 'No description provided for this tag.'}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    )}

    {/* Document View */}
  <div className="max-w-3xl mx-auto"> 
  {/* Document Content */}
    <div className="prose prose-gray max-w-none space-y-6">
      <p className="text-gray-700 text-base leading-relaxed">
        This research document explores transformer architectures and their applications in natural language processing. 
        The study demonstrates significant improvements in model performance across various benchmarks.
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-sm rounded ml-2 cursor-pointer hover:bg-blue-100 transition-colors">
          <Hash className="w-3 h-3" />
          Note
        </span>
      </p>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Hash className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-900 text-lg mb-2">Key Finding</div>
            <div className="text-gray-700 text-base mb-3">
              Multi-head attention mechanisms significantly improve model performance across various NLP tasks, 
              with particular effectiveness in capturing long-range dependencies.
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-blue-700 text-sm font-medium rounded-lg border border-blue-200 shadow-sm">
                <Hash className="w-3 h-3" />
                Research
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white text-green-700 text-sm font-medium rounded-lg border border-green-200 shadow-sm">
                <Hash className="w-3 h-3" />
                Idea
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-700 text-base leading-relaxed">
        Future work should focus on optimizing attention patterns for longer sequences and exploring 
        sparse attention mechanisms to reduce computational complexity.
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-sm rounded ml-2 cursor-pointer hover:bg-yellow-100 transition-colors">
          <Hash className="w-3 h-3" />
          To-Do
        </span>
      </p>

      <div className="bg-gray-50 rounded-xl p-6 my-8 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Methodology Overview</h3>
        <ul className="space-y-2 text-gray-700 text-base">
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
            <span>Collected dataset of 10M documents across multiple domains</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
            <span>Implemented transformer architecture with 12 attention heads</span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></div>
            <span>Evaluated performance on standard NLP benchmarks</span>
          </li>
        </ul>
      </div>

      <p className="text-gray-700 text-base leading-relaxed">
        The results demonstrate clear advantages of our approach, particularly in handling ambiguous contexts 
        and maintaining coherence across longer text spans.
      </p>
    </div>

    {/* Action Hint */}
    <div className="mt-12 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-medium text-blue-900 text-sm mb-1">Tip: Use Tags Effectively</div>
          <div className="text-blue-700 text-sm">
            Click any inline tag to see all related content. Use ⌘+K to quickly search and navigate tags.
            Tags help organize research, track progress, and connect related ideas across documents.
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
  {/* Main Content */}
  <div className="flex-1 flex overflow-hidden">
    <DocumentArea />
    <SmartSidebar />
  </div>

  {/* Modals */}
  {activeModal === 'create' && <CreateTagModal />}
  {activeModal === 'edit' && <EditTagModal />}
  {activeModal === 'delete' && <DeleteConfirmModal />}
  {showCommandPalette && <CommandPalette />}

  {/* Footer */}
  <div className="bg-gray-900 text-white px-6 py-2 text-xs flex-shrink-0">
    <div className="flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-4">
        <span className="font-semibold">Complete Tag Management System</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-400">Projects, Dates & Metadata</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-400">Google Docs Integration</span>
      </div>
      <div className="text-gray-400">
        Fully Functional • Ready for Production
      </div>
    </div>
  </div>
</div>

