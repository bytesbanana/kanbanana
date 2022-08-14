import dynamic from 'next/dynamic';
import React from 'react';

const DynamicSideNav = dynamic(() => import('../components/SideNav'), {
  ssr: false,
});

const Layout = (props) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex flex-1 h-full overflow-hidden'>
        <DynamicSideNav />
        <main className='flex flex-1 max-w-[calc(100%-250px)] min-w-[calc(100%-250px)]'>{props.children}</main>
      </div>
    </div>
  );
};

export default Layout;
