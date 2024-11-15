import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, getDocs, addDoc, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SystemPrompt } from '../types/admin';
import { Save, Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AdminPromptEditor() {
  const [prompts, setPrompts] = useState<SystemPrompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<SystemPrompt | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editName, setEditName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/');
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      if (!userData?.isAdmin) {
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      loadPrompts();
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const loadPrompts = async () => {
    try {
      const promptsRef = collection(db, 'systemPrompts');
      const q = query(promptsRef);
      const querySnapshot = await getDocs(q);
      const loadedPrompts: SystemPrompt[] = [];
      querySnapshot.forEach((doc) => {
        loadedPrompts.push({ id: doc.id, ...doc.data() } as SystemPrompt);
      });
      setPrompts(loadedPrompts);
    } catch (error) {
      console.error('Error loading prompts:', error);
      toast.error('Failed to load prompts');
    }
  };

  const handleSave = async () => {
    if (!isAdmin) return;

    try {
      if (selectedPrompt) {
        const promptRef = doc(db, 'systemPrompts', selectedPrompt.id);
        await updateDoc(promptRef, {
          name: editName,
          content: editContent,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, 'systemPrompts'), {
          name: editName || 'New Prompt',
          content: editContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: true
        });
      }
      toast.success('Prompt saved successfully');
      loadPrompts();
    } catch (error) {
      console.error('Error saving prompt:', error);
      toast.error('Failed to save prompt');
    }
  };

  const handleDelete = async () => {
    if (!isAdmin || !selectedPrompt) return;

    if (!window.confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      const promptRef = doc(db, 'systemPrompts', selectedPrompt.id);
      await deleteDoc(promptRef);
      toast.success('Prompt deleted successfully');
      setSelectedPrompt(null);
      setEditContent('');
      setEditName('');
      loadPrompts();
    } catch (error) {
      console.error('Error deleting prompt:', error);
      toast.error('Failed to delete prompt');
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6">System Prompts Editor</h2>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <select 
              className="border rounded-md p-2"
              onChange={(e) => {
                const prompt = prompts.find(p => p.id === e.target.value);
                setSelectedPrompt(prompt || null);
                setEditContent(prompt?.content || '');
                setEditName(prompt?.name || '');
              }}
              value={selectedPrompt?.id || ''}
            >
              <option value="">Create New Prompt</option>
              {prompts.map((prompt) => (
                <option key={prompt.id} value={prompt.id}>
                  {prompt.name}
                </option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedPrompt(null);
                  setEditContent('');
                  setEditName('');
                }}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                <Plus size={20} />
                New Prompt
              </button>

              {selectedPrompt && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  <Trash2 size={20} />
                  Delete
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 block mb-2">Prompt Name</span>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter prompt name..."
              />
            </label>

            <label className="block">
              <span className="text-gray-700 block mb-2">Prompt Content</span>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-64 p-4 border rounded-md"
                placeholder="Enter the system prompt content..."
              />
            </label>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              <Save size={20} />
              Save Prompt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}