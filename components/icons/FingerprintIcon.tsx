import React from 'react';

const FingerprintIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.588 8.188a15.02 15.02 0 01-3.413 3.413c-2.479 1.032-5.268 1.588-8.188 1.588a15.02 15.02 0 01-3.413-3.413A15.02 15.02 0 011.5 10.5c0-2.92.556-5.709 1.588-8.188A15.02 15.02 0 016.5 1.5a15.02 15.02 0 013.413-3.413z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75v-3.75m-3.75-3.75h3.75m-3.75-3.75h3.75m0-3.75h-3.75m3.75-3.75h-3.75m0-3.75h3.75M9 4.5v12.75" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 4.5v12.75a3 3 0 01-3 3h-3a3 3 0 01-3-3V4.5" />
  </svg>
);

export default FingerprintIcon;
