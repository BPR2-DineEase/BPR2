import React from 'react';

type ReservationProccessProps = {
  step: number;
};

const ReservationProccess: React.FC<ReservationProccessProps> = ({ step }) => {
  // Helper function to determine the background class
  const getBackgroundClass = (currentStep: number) => {
    return step >= currentStep ? 'bg-slate-400' : 'bg-slate-100';
  };

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="w-[200px] mt-10 h-[2px] bg-gray-300"></div>
      <div
        className={`rounded-full  w-8 h-8 mt-10 ${getBackgroundClass(
          1
        )} border-red-900 border-2 flex justify-center items-center`}
      >
        <b>1</b>
      </div>
      <div className="w-[200px] mt-10 h-[2px] bg-gray-300"></div>
      <div
        className={`rounded-full w-8 h-8 mt-10 ${getBackgroundClass(
          2
        )} border-red-900 border-2 flex justify-center items-center`}
      >
        <b>2</b>
      </div>
      <div className="w-[200px] mt-10 h-[2px] bg-gray-300"></div>
      <div
        className={`rounded-full w-8 h-8 mt-10 ${getBackgroundClass(
          3
        )} border-red-900 border-2 flex justify-center items-center`}
      >
        <b>3</b>
      </div>
      <div className="w-[200px] mt-10 h-[2px] bg-gray-300"></div>
      <div
        className={`rounded-full w-8 h-8 mt-10 ${getBackgroundClass(
          4
        )} border-red-900 border-2 flex justify-center items-center`}
      >
        <b>4</b>
      </div>
      <div className="w-[200px] mt-10 h-[2px] bg-gray-300"></div>
    </div>
  );
};

export default ReservationProccess;
