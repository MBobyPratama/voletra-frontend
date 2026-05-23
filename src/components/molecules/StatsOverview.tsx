import React from 'react';
import StatCard from '../atoms/StatCard';
import { Misi } from '@/types/misi';

interface StatsOverviewProps {
  missions: Misi[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ missions }) => {
  const totalMissions = missions.length;
  
  const activeMissions = missions.filter(m => {
      const s = (m.status || '').toLowerCase();
      // 'Open', 'In Progress', 'Full', 'Ongoing' are considered active
      return ['open', 'ongoing', 'in progress', 'full', 'sedang_berjalan', 'relawan_terkumpul'].includes(s);
  }).length;

  const completedMissions = missions.filter(m => 
    (m.status || '').toLowerCase() === 'completed' || 
    (m.status || '').toLowerCase() === 'selesai'
  ).length;

  // Pending Review is the sum of pending applicants across all missions
  const pendingReview = missions.reduce((acc, curr) => acc + (curr.pending_applicants_count || 0), 0);
  
  // Total Volunteers is the sum of APPROVED volunteers (volunteers_applied from backend)
  const totalVolunteers = missions.reduce((acc, curr) => acc + (curr.volunteers_applied || 0), 0);

  return (
    <div className="flex flex-wrap gap-[40px] mb-10">
      <StatCard label="Total Missions" value={totalMissions} />
      <StatCard label="Active Missions" value={activeMissions} />
      <StatCard label="Completed Missions" value={completedMissions} />
      <StatCard label="Total Volunteers" value={totalVolunteers} />
      <StatCard label="Pending Review" value={pendingReview} />
    </div>
  );
};

export default StatsOverview;
