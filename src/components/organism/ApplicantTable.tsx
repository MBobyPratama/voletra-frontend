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
      <div className="bg-white rounded-[10px] p-[24px] shadow-sm min-h-[200px] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Belum ada pelamar</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-[10px] ${hideTitle ? 'p-0' : 'p-[24px] shadow-sm'} overflow-x-auto`}>
      {!hideTitle && <h2 className="font-semibold text-[20px] text-black mb-[24px]">Member</h2>}
      <table className="w-full min-w-[1000px] text-left border-collapse">
        <thead>
          <tr className="bg-[#f3f3f3] border border-[rgba(0,0,0,0.12)]">
            <th className="p-[10px] font-medium text-[14px] text-black rounded-tl-[10px] w-[20%]">Name</th>
            <th className="border-l border-[rgba(0,0,0,0.12)] p-[10px] font-medium text-[14px] text-black w-[15%]">Date of Birth</th>
            <th className="border-l border-[rgba(0,0,0,0.12)] p-[10px] font-medium text-[14px] text-black w-[20%]">Phone Number</th>
            <th className="border-l border-[rgba(0,0,0,0.12)] p-[10px] font-medium text-[14px] text-black w-[15%]">Skill</th>
            <th className="border-l border-[rgba(0,0,0,0.12)] p-[10px] font-medium text-[14px] text-black rounded-tr-[10px] w-[30%]">Domicile</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant, index) => {
            const isLast = index === applicants.length - 1;
            return (
              <tr key={applicant.apply_id} className={`border-b border-x border-[rgba(0,0,0,0.12)] ${isLast ? 'rounded-b-[10px]' : ''}`}>
                <td className={`p-[10px] ${isLast ? 'rounded-bl-[10px]' : ''}`}>
                  <div className="flex items-center gap-[10px]">
                    <div className="relative w-[31px] h-[31px] rounded-full overflow-hidden bg-gray-200 shrink-0">
                      {/* Placeholder avatar */}
                      <Image src="https://via.placeholder.com/31" alt={applicant.nama || 'Relawan'} fill className="object-cover" />
                    </div>
                    <p className="font-medium text-[14px] text-black">{applicant.nama}</p>
                  </div>
                </td>
                <td className="border-l border-[rgba(0,0,0,0.12)] p-[10px]">
                  <p className="font-medium text-[14px] text-black">{applicant.tanggal_lahir || '-'}</p>
                </td>
                <td className="border-l border-[rgba(0,0,0,0.12)] p-[10px]">
                  <p className="font-medium text-[14px] text-black">{applicant.phone || '-'}</p>
                </td>
                <td className="border-l border-[rgba(0,0,0,0.12)] p-[10px]">
                  <div className="flex items-center gap-[8px]">
                    <FiFileText className="text-[20px]" />
                    <p className="font-medium text-[14px] text-black">{applicant.skill || '-'}</p>
                  </div>
                </td>
                <td className={`border-l border-[rgba(0,0,0,0.12)] p-[10px] ${isLast ? 'rounded-br-[10px]' : ''}`}>
                  <div className="flex items-center justify-between gap-[16px]">
                    <p className="font-medium text-[14px] text-black">{applicant.domisili || '-'}</p>
                    
                    {applicant.status === 'pending' ? (
                      <div className="flex gap-[8px]">
                        <button
                          onClick={() => onDecline(applicant.apply_id)}
                          disabled={isProcessing}
                          className="bg-[#BCD1EF] text-[#1E4F98] hover:bg-blue-200 font-medium text-[14px] px-[24px] py-[6px] rounded-[10px] w-[110px] transition-colors disabled:opacity-50"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => onApprove(applicant.apply_id)}
                          disabled={isProcessing}
                          className="bg-[#2869CA] text-white hover:bg-blue-700 font-medium text-[14px] px-[24px] py-[6px] rounded-[10px] w-[110px] transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                      </div>
                    ) : (
                      <span className={`font-medium px-[24px] py-[6px] rounded-[10px] text-[14px] w-[110px] text-center ${applicant.status === 'approved' ? 'bg-[#31AA2A] text-white' : 'bg-[#FF4538] text-white'}`}>
                        {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
                      </span>
                    )}
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
