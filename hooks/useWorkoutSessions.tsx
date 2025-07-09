import { useState, useEffect } from 'react';
import { workoutSessionService, WorkoutSession, CreateWorkoutSessionRequest } from '@/services/workoutSessionService';
import { useAuth } from './useAuth';

export function useWorkoutSessions() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Load sessions for current user
  const loadUserSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const userId = parseInt(user.id);
      const response = await workoutSessionService.getSessionsByUserId(userId);
      if (response.success && response.data) {
        setSessions(response.data);
        console.log('✅ User sessions loaded:', response.data.length);
      } else {
        setError(response.error || 'Failed to load sessions');
      }
    } catch (err) {
      setError('Error loading sessions');
      console.error('❌ Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load all sessions
  const loadAllSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await workoutSessionService.getAllSessions();
      if (response.success && response.data) {
        setSessions(response.data);
        console.log('✅ All sessions loaded:', response.data.length);
      } else {
        setError(response.error || 'Failed to load sessions');
      }
    } catch (err) {
      setError('Error loading sessions');
      console.error('❌ Error loading sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create workout session
  const createSession = async (
    workoutId: number,
    durationMinutes?: number,
    caloriesBurned?: number,
    notes?: string
  ): Promise<boolean> => {
    if (!user) return false;

    try {
      const sessionData: CreateWorkoutSessionRequest = {
        user: { id: parseInt(user.id) },
        workout: { id: workoutId },
        durationMinutes,
        caloriesBurned,
        notes,
      };

      const response = await workoutSessionService.createSession(sessionData);
      if (response.success && response.data) {
        // Refresh the sessions list
        await loadUserSessions();
        console.log('✅ Session created:', response.data);
        return true;
      } else {
        setError(response.error || 'Failed to create session');
        return false;
      }
    } catch (err) {
      setError('Error creating session');
      console.error('❌ Error creating session:', err);
      return false;
    }
  };

  // Complete session
  const completeSession = async (sessionId: number): Promise<boolean> => {
    try {
      const response = await workoutSessionService.completeSession(sessionId);
      if (response.success) {
        // Update local state
        setSessions(prev => 
          prev.map(session => 
            session.id === sessionId 
              ? { ...session, finishedAt: new Date().toISOString() }
              : session
          )
        );
        console.log('✅ Session completed:', sessionId);
        return true;
      } else {
        setError(response.error || 'Failed to complete session');
        return false;
      }
    } catch (err) {
      setError('Error completing session');
      console.error('❌ Error completing session:', err);
      return false;
    }
  };

  // Delete session
  const deleteSession = async (sessionId: number): Promise<boolean> => {
    try {
      const response = await workoutSessionService.deleteSession(sessionId);
      if (response.success) {
        // Remove from local state
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        console.log('✅ Session deleted:', sessionId);
        return true;
      } else {
        setError(response.error || 'Failed to delete session');
        return false;
      }
    } catch (err) {
      setError('Error deleting session');
      console.error('❌ Error deleting session:', err);
      return false;
    }
  };

  // Auto-load user sessions when user changes
  useEffect(() => {
    if (user) {
      loadUserSessions();
    }
  }, [user]);

  return {
    sessions,
    loading,
    error,
    loadUserSessions,
    loadAllSessions,
    createSession,
    completeSession,
    deleteSession,
  };
}
