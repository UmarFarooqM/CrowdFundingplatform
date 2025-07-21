import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { subscribeToProject } from '../services/projectService';
import { setCurrentProject } from '../store/slices/projectsSlice';
import ContributionModal from '../components/projects/ContributionModal';
import CommentsSection from '../components/projects/CommentsSection';
import ProgressBar from '../components/common/ProgressBar';
import { formatDistanceToNow } from 'date-fns';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Heart, 
  Share2, 
  Gift,
  ArrowLeft,
  Facebook,
  Twitter,
  MessageCircle
} from 'lucide-react';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProject: project, loading } = useSelector((state) => state.projects);
  const { user } = useSelector((state) => state.auth);
  const [showContributionModal, setShowContributionModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    const unsubscribe = subscribeToProject(id, (projectData) => {
      dispatch(setCurrentProject(projectData));
    });

    return unsubscribe;
  }, [id, dispatch]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out this amazing project: ${project?.title}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;
  const daysRemaining = Math.max(0, Math.ceil((project.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  const isProjectOwner = user?.uid === project.creatorId;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Projects</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Header */}
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="h-64 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <h1 className="text-white text-3xl font-bold text-center px-6">{project.title}</h1>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">by</span>
                  <span className="font-medium text-gray-900">{project.creatorName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-sm text-gray-600">Share:</span>
                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                  <span className="text-sm">Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                  <span className="text-sm">Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">WhatsApp</span>
                </button>
              </div>

              <p className="text-gray-700 leading-relaxed">{project.description}</p>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
              <Gift className="h-5 w-5" />
              <span>Rewards</span>
            </h3>
            
            <div className="space-y-4">
              {project.rewards.map((reward) => (
                <div key={reward.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{reward.title}</h4>
                    <span className="text-lg font-bold text-blue-600">${reward.amount}+</span>
                  </div>
                  <p className="text-gray-600 mb-3">{reward.description}</p>
                  <div className="text-sm text-gray-500">
                    Estimated delivery: {new Date(reward.estimatedDelivery).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <CommentsSection 
            project={project} 
            onCommentAdded={() => {
              // Comments are updated in real-time through the subscription
            }} 
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Funding Progress */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${project.currentFunding.toLocaleString()}
              </div>
              <div className="text-gray-600">
                raised of ${project.fundingGoal.toLocaleString()} goal
              </div>
            </div>

            <ProgressBar current={project.currentFunding} goal={project.fundingGoal} className="mb-6" />

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{fundingPercentage.toFixed(0)}%</div>
                <div className="text-sm text-gray-600">funded</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{project.backers.length}</div>
                <div className="text-sm text-gray-600">backers</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-gray-900">{daysRemaining}</div>
              <div className="text-sm text-gray-600">days to go</div>
            </div>

            {user && !isProjectOwner && (
              <button
                onClick={() => setShowContributionModal(true)}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Back this project
              </button>
            )}

            {!user && (
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in to back this project
                </Link>
              </div>
            )}

            {isProjectOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-center">
                <p className="text-blue-800 font-medium">This is your project</p>
              </div>
            )}
          </div>

          {/* Project Timeline */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Campaign started</div>
                  <div className="text-sm text-gray-600">
                    {formatDistanceToNow(project.startDate, { addSuffix: true })}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">Campaign ends</div>
                  <div className="text-sm text-gray-600">
                    {project.endDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Backers */}
          {project.backers.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Recent Backers</h4>
              <div className="space-y-3">
                {project.backers
                  .sort((a, b) => new Date(b.backedAt).getTime() - new Date(a.backedAt).getTime())
                  .slice(0, 5)
                  .map((backer, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-700">
                            {backer.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-900">{backer.userName}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        ${backer.amount}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contribution Modal */}
      <ContributionModal
        project={project}
        isOpen={showContributionModal}
        onClose={() => setShowContributionModal(false)}
        onSuccess={() => {
          // Project is updated in real-time through the subscription
        }}
      />
    </div>
  );
};

export default ProjectDetailPage;