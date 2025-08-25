import React from 'react';

const CourseCard = ({ courseName, studentCount }) => {
  return (
    <div className="bg-accent-green text-white rounded-lg p-3 shadow-lg hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium leading-tight flex-1 pr-2">{courseName}</h3>
        <div className="bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full min-w-[2rem] text-center">
          {studentCount}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
