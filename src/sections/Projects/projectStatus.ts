import type { Project } from '@/types';

export const STATUS_LABEL: Record<NonNullable<Project['status']>, string> = {
  'in-development': 'In development',
  discontinued: 'Discontinued',
};
