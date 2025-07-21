import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProjects } from '../services/projectService';
import { setProjects, setLoading } from '../store/slices/projectsSlice';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFilters from '../components/projects/ProjectFilters';
import { Search } from 'lucide-react';

const HomePage = () => {
  const dispatch = useDispatch();
  const { projects, loading, searchTerm, categoryFilter, sortBy } = useSelector(
    (state) => state.projects
  );

  useEffect(() => {
    const fetchProjects = async () => {
      dispatch(setLoading(true));
      try {
        const projectsData = await getProjects();
        dispatch(setProjects(projectsData));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [dispatch]);

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(project => project.category === categoryFilter);
    }

    // Sort projects
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'funding':
          return b.currentFunding - a.currentFunding;
        case 'deadline':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        default:
          return 0;
      }
    });
  }, [projects, searchTerm, categoryFilter, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Amazing Projects
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Support innovative ideas and help bring creative projects to life. Browse through
          hundreds of projects across various categories and find something that inspires you.
        </p>
      </div>

      {/* Filters */}
      <ProjectFilters />

      {/* Projects Grid */}
      {filteredAndSortedProjects.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600">
            Try adjusting your search or filter criteria to find more projects.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Stats Section */}
      {projects.length > 0 && (
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-gray-600">Active Projects</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {projects.reduce((sum, p) => sum + p.backers.length, 0)}
              </div>
              <div className="text-gray-600">Total Backers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                ${projects.reduce((sum, p) => sum + p.currentFunding, 0).toLocaleString()}
              </div>
              <div className="text-gray-600">Funds Raised</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;