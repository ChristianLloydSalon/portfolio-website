import type { Outcome, ProjectStatus } from '@/types';

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  production: 'In production',
  published: 'Published',
  'in-development': 'In development',
  experimental: 'Experimental',
  discontinued: 'Discontinued',
};

/** Where a number comes from, so production figures never blur into test results. */
export const BASIS_LABEL: Record<Outcome['basis'], string> = {
  production: 'Production',
  'load-test': 'Load test',
  internal: 'Internal measurement',
  public: 'Public listing',
};
