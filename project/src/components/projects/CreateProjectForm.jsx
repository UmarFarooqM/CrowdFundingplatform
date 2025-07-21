import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm, useFieldArray } from 'react-hook-form';
import { createProject } from '../../services/projectService';
import { Plus, Trash2 } from 'lucide-react';

const CreateProjectForm = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      rewards: [
        {
          id: '1',
          amount: 25,
          title: 'Early Bird',
          description: 'Get early access and a thank you message',
          estimatedDelivery: '2024-06-01',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'rewards',
  });

  const onSubmit = async (data) => {
    if (!user) return;

    setLoading(true);
    try {
      const projectData = {
        title: data.title,
        description: data.description,
        fundingGoal: data.fundingGoal,
        currentFunding: 0,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        creatorId: user.uid,
        creatorName: user.displayName || 'Anonymous',
        category: data.category,
        rewards: data.rewards.map((reward, index) => ({
          ...reward,
          id: (index + 1).toString(),
        })),
        backers: [],
        comments: [],
      };

      const projectId = await createProject(projectData);
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const addReward = () => {
    append({
      id: (fields.length + 1).toString(),
      amount: 0,
      title: '',
      description: '',
      estimatedDelivery: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Create a New Project</h1>
          <p className="mt-1 text-gray-600">
            Share your vision and start building your community of supporters.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Project Title</label>
              <input
                type="text"
                {...register('title', { required: 'Title is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                {...register('description', { required: 'Description is required' })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Funding Goal ($)</label>
                <input
                  type="number"
                  {...register('fundingGoal', { required: 'Funding goal is required', min: 1 })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.fundingGoal && <p className="mt-1 text-sm text-red-600">{errors.fundingGoal.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="technology">Technology</option>
                  <option value="art">Art</option>
                  <option value="music">Music</option>
                  <option value="film">Film</option>
                  <option value="games">Games</option>
                  <option value="publishing">Publishing</option>
                  <option value="food">Food</option>
                  <option value="fashion">Fashion</option>
                  <option value="health">Health</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  {...register('endDate', { required: 'End date is required' })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Rewards</h3>
              <button
                type="button"
                onClick={addReward}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                <span>Add Reward</span>
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-md font-medium text-gray-900">Reward {index + 1}</h4>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount ($)</label>
                      <input
                        type="number"
                        {...register(`rewards.${index}.amount`, { required: 'Amount is required', min: 1 })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        {...register(`rewards.${index}.title`, { required: 'Title is required' })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        rows={2}
                        {...register(`rewards.${index}.description`, { required: 'Description is required' })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Estimated Delivery</label>
                      <input
                        type="date"
                        {...register(`rewards.${index}.estimatedDelivery`, { required: 'Delivery date is required' })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;