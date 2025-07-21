import React from 'react';
import { Link } from 'react-router-dom';
import ProgressBar from '../common/ProgressBar';
import { formatDistanceToNow } from 'date-fns';
import { Calendar, Users, DollarSign } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const fundingPercentage = (project.currentFunding / project.fundingGoal) * 100;
  const daysRemaining = Math.max(0, Math.ceil((project.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <h3 className="text-white text-xl font-bold text-center px-4">{project.title}</h3>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3">{project.description}</p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              ${project.currentFunding.toLocaleString()} raised
            </span>
            <span className="text-sm font-medium text-gray-900">
              {fundingPercentage.toFixed(0)}%
            </span>
          </div>
          <ProgressBar current={project.currentFunding} goal={project.fundingGoal} />
          <div className="text-xs text-gray-500 mt-1">
            Goal: ${project.fundingGoal.toLocaleString()}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{project.backers.length} backers</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{daysRemaining} days left</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">by {project.creatorName}</span>
          <Link
            to={`/project/${project.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;