import { QueryClient } from '@tanstack/react-query';
import { cache } from 'react';

// cache()를 사용해 요청 간에 동일한 QueryClient 인스턴스를 공유하도록 보장
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
