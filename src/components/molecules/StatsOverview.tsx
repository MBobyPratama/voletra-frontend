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
      return ['ongoing', 'sedang_berjalan', 'relawan_terkumpul', 'in progress', 'full'].includes(s);
  }).length;
  const completedMissions = missions.filter(m => (m.status || '').toLowerCase() === 'completed' || (m.status || '').toLowerCase() === 'selesai').length;
  const pendingReview = missions.filter(m => (m.status || '').toLowerCase() === 'pending' || (m.status || '').toLowerCase() === 'menunggu_konfirmasi').length;
  
  const totalVolunteers = missions.reduce((acc, curr) => acc + (curr.jumlah_relawan || 0), 0);

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
