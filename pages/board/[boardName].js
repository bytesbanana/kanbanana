import dynamic from 'next/dynamic';
import Loader from '../../components/Loader';

export default dynamic(() => import('../../components/Board'), {
  ssr: false,
  loading: () => <Loader />,
});
