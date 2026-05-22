'use client';

import React from 'react';
import Image from 'next/image';
import { Applicant } from '@/types/misi';
import { FiFileText } from 'react-icons/fi';

interface ApplicantTableProps {
  applicants: Applicant[];
  onApprove: (id: string) => void;
  onDecline: (id: string) => void;
  isProcessing?: boolean;
  hideTitle?: boolean;
}

export default function ApplicantTable({ applicants, onApprove, onDecline, isProcessing, hideTitle }: ApplicantTableProps) {
  if (!applicants || applicants.length === 0) {
    return (
      <div className="bg-white rounded-[10px] p-[24px] shadow-sm min-h-[200px] flex items-center justify-center border border-[rgba(0,0,0,0.12)]">
        <p className="text-gray-500 font-medium">Belum ada pelamar</p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className={`bg-white rounded-[10px] ${hideTitle ? 'p-0' : 'p-[24px] shadow-sm'} overflow-x-auto`}>
      {!hideTitle && <h2 className="font-semibold text-[20px] text-black mb-[24px]">Member</h2>}
      <table className="w-full min-w-[1000px] text-left border-collapse">
        <thead>
          <tr className="bg-[#f3f3f3]">
            <th className="p-[10px] font-medium text-[14px] text-black border border-[rgba(0,0,0,0.12)] rounded-tl-[10px] w-[15%]">Name</th>
            <th className="p-[10px] font-medium text-[14px] text-black border border-[rgba(0,0,0,0.12)] w-[12%]">Date of Birth</th>
            <th className="p-[10px] font-medium text-[14px] text-black border border-[rgba(0,0,0,0.12)] w-[15%]">Phone Number</th>
            <th className="p-[10px] font-medium text-[14px] text-black border border-[rgba(0,0,0,0.12)] w-[15%]">Skill</th>
            <th className="p-[10px] font-medium text-[14px] text-black border border-[rgba(0,0,0,0.12)] rounded-tr-[10px] w-[43%]">Domicile</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => {
            const isLast = index === applicants.length - 1;
            const displayName = applicant.full_name || applicant.nama || '-';
            const displayDate = formatDate(applicant.birth_date || applicant.tanggal_lahir);
            const displayPhone = applicant.phone_number || applicant.phone || '-';
            const displayDomicile = applicant.domicile || applicant.domisili || '-';
            const skillLabel = applicant.skill || `Skill ${displayName.split(' ')[0]}`;

            return (
              <tr key={applicant.apply_id} className="h-[59px]">
                <td className="p-[10px] border border-[rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-[10px]">
                    <div className="relative w-[31px] h-[31px] rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <Image 
                        src={`https://ui-avatars.com/api/?name=${displayName}&background=random`} 
                        alt={displayName} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <p className="font-medium text-[14px] text-black line-clamp-1">{displayName}</p>
                  </div>
                </td>
                <td className="p-[10px] border border-[rgba(0,0,0,0.12)]">
                  <p className="font-medium text-[14px] text-black">{displayDate}</p>
                </td>
                <td className="p-[10px] border border-[rgba(0,0,0,0.12)]">
                  <p className="font-medium text-[14px] text-black">{displayPhone}</p>
                </td>
                <td className="p-[10px] border border-[rgba(0,0,0,0.12)]">
                  {applicant.skills_url ? (
                    <a 
                      href={applicant.skills_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-[5px] text-[#2869CA] hover:underline"
                    >
                      <FiFileText className="text-[20px] shrink-0" />
                      <span className="font-medium text-[14px] line-clamp-1">{skillLabel}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-[5px] text-gray-400">
                      <FiFileText className="text-[20px] shrink-0" />
                      <span className="font-medium text-[14px]">No file</span>
                    </div>
                  )}
                </td>
                <td className="p-[10px] border border-[rgba(0,0,0,0.12)]">
                  <div className="flex items-center justify-between gap-[16px]">
                    <p className="font-medium text-[14px] text-black flex-1 line-clamp-1">{displayDomicile}</p>
                    
                    <div className="shrink-0">
                      {applicant.status === 'pending' ? (
                        <div className="flex gap-[8px]">
                          <button
                            onClick={() => onDecline(applicant.apply_id)}
                            disabled={isProcessing}
                            className="bg-[#BCD1EF] text-[#1E4F98] hover:bg-blue-200 font-medium text-[14px] h-[33px] w-[148px] rounded-[10px] transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => onApprove(applicant.apply_id)}
                            disabled={isProcessing}
                            className="bg-[#2869CA] text-white hover:bg-blue-700 font-medium text-[14px] h-[33px] w-[148px] rounded-[10px] transition-colors disabled:opacity-50 flex items-center justify-center"
                          >
                            Approve
                          </button>
                        </div>
                      ) : (
                        <div className={`font-medium h-[33px] w-[148px] rounded-[10px] text-[14px] flex items-center justify-center text-white ${applicant.status === 'approved' ? 'bg-[#31AA2A]' : 'bg-[#FF4538]'}`}>
                          {applicant.status === 'approved' ? 'Approved' : 'Rejected'}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
