import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { toast } from 'sonner';

// Query Keys
export const QUERY_KEYS = {
  // User
  USER_PROFILE: ['user', 'profile'],
  USER_BOOKMARKS: ['user', 'bookmarks'],
  
  // Schemes
  SCHEMES: ['schemes'],
  SCHEME_DETAIL: (id) => ['schemes', id],
  RECOMMENDED_SCHEMES: ['schemes', 'recommended'],
  
  // Events
  EVENTS: ['events'],
  EVENT_DETAIL: (id) => ['events', id],
  REGISTERED_EVENTS: ['events', 'registered'],
  
  // Complaints
  COMPLAINTS: ['complaints'],
  COMPLAINT_DETAIL: (id) => ['complaints', id],
  
  // Documents
  DOCUMENTS: ['documents'],
  DOCUMENT_STATUS: (id) => ['documents', id, 'status'],
  
  // Locations
  LOCATIONS: ['locations'],
  LOCATION_DETAIL: (id) => ['locations', id],
  NEARBY_LOCATIONS: (lat, lng, radius) => ['locations', 'nearby', lat, lng, radius],
  
  // Notifications
  NOTIFICATIONS: ['notifications'],
  UNREAD_COUNT: ['notifications', 'unread-count'],
  
  // Dashboard
  DASHBOARD_STATS: ['dashboard', 'stats'],
  RECENT_ACTIVITY: ['dashboard', 'recent'],
};

// Custom Hooks for Schemes
export const useSchemes = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.SCHEMES, params],
    queryFn: () => api.schemes.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useScheme = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.SCHEME_DETAIL(id),
    queryFn: () => api.schemes.getById(id),
    enabled: !!id,
  });
};

export const useRecommendedSchemes = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RECOMMENDED_SCHEMES,
    queryFn: () => api.schemes.getRecommended(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCheckEligibility = () => {
  return useMutation({
    mutationFn: (schemeId) => api.schemes.checkEligibility(schemeId),
    onSuccess: (data) => {
      toast.success('Eligibility check completed');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to check eligibility');
    },
  });
};

// Custom Hooks for Events
export const useEvents = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.EVENTS, params],
    queryFn: () => api.events.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useEvent = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.EVENT_DETAIL(id),
    queryFn: () => api.events.getById(id),
    enabled: !!id,
  });
};

export const useRegisteredEvents = () => {
  return useQuery({
    queryKey: QUERY_KEYS.REGISTERED_EVENTS,
    queryFn: () => api.events.getRegistered(),
  });
};

export const useEventRegistration = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ eventId, action }) => {
      return action === 'register' 
        ? api.events.register(eventId)
        : api.events.unregister(eventId);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REGISTERED_EVENTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.EVENT_DETAIL(variables.eventId) });
      
      const action = variables.action === 'register' ? 'registered for' : 'unregistered from';
      toast.success(`Successfully ${action} the event`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update event registration');
    },
  });
};

// Custom Hooks for Complaints
export const useComplaints = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.COMPLAINTS, params],
    queryFn: () => api.complaints.getAll(params),
  });
};

export const useComplaint = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.COMPLAINT_DETAIL(id),
    queryFn: () => api.complaints.getById(id),
    enabled: !!id,
  });
};

export const useCreateComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (complaintData) => api.complaints.create(complaintData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPLAINTS });
      toast.success('Complaint submitted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit complaint');
    },
  });
};

export const useUpdateComplaint = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => api.complaints.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPLAINTS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COMPLAINT_DETAIL(variables.id) });
      toast.success('Complaint updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update complaint');
    },
  });
};

// Custom Hooks for Documents
export const useDocuments = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DOCUMENTS,
    queryFn: () => api.documents.getAll(),
  });
};

export const useDocumentStatus = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.DOCUMENT_STATUS(id),
    queryFn: () => api.documents.getVerificationStatus(id),
    enabled: !!id,
    refetchInterval: 30000, // Refetch every 30 seconds for status updates
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ file, documentType }) => api.documents.upload(file, documentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DOCUMENTS });
      toast.success('Document uploaded successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to upload document');
    },
  });
};

// Custom Hooks for Locations
export const useLocations = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.LOCATIONS, params],
    queryFn: () => api.locations.getAll(params),
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useNearbyLocations = (lat, lng, radius = 10) => {
  return useQuery({
    queryKey: QUERY_KEYS.NEARBY_LOCATIONS(lat, lng, radius),
    queryFn: () => api.locations.getNearby(lat, lng, radius),
    enabled: !!(lat && lng),
    staleTime: 10 * 60 * 1000,
  });
};

export const useLocation = (id) => {
  return useQuery({
    queryKey: QUERY_KEYS.LOCATION_DETAIL(id),
    queryFn: () => api.locations.getById(id),
    enabled: !!id,
  });
};

// Custom Hooks for Notifications
export const useNotifications = () => {
  return useQuery({
    queryKey: QUERY_KEYS.NOTIFICATIONS,
    queryFn: () => api.notifications.getAll(),
    refetchInterval: 60000, // Refetch every minute
  });
};

export const useUnreadCount = () => {
  return useQuery({
    queryKey: QUERY_KEYS.UNREAD_COUNT,
    queryFn: () => api.notifications.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (notificationId) => api.notifications.markAsRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UNREAD_COUNT });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => api.notifications.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.NOTIFICATIONS });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.UNREAD_COUNT });
      toast.success('All notifications marked as read');
    },
  });
};

// Custom Hooks for User Profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_PROFILE,
    queryFn: () => api.users.getProfile(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useUserBookmarks = () => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_BOOKMARKS,
    queryFn: () => api.users.getBookmarks(),
  });
};

export const useBookmarkMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ action, data, id }) => {
      return action === 'add' 
        ? api.users.addBookmark(data)
        : api.users.removeBookmark(id);
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USER_BOOKMARKS });
      const action = variables.action === 'add' ? 'added to' : 'removed from';
      toast.success(`Bookmark ${action} your list`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update bookmark');
    },
  });
};

// Custom Hooks for Dashboard
export const useDashboardStats = () => {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD_STATS,
    queryFn: () => api.dashboard.getStats(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: QUERY_KEYS.RECENT_ACTIVITY,
    queryFn: () => api.dashboard.getRecentActivity(),
    staleTime: 2 * 60 * 1000,
  });
};

// Custom Hook for Chatbot
export const useChatbot = () => {
  return useMutation({
    mutationFn: (message) => api.chatbot.sendMessage(message),
    onError: (error) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};

// Generic API Call Hook
export const useApi = () => {
  const apiCall = async (url, options = {}) => {
    try {
      const token = localStorage.getItem('token');
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`, {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  };

  return { apiCall };
};