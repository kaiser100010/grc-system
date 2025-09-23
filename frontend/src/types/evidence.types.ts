export interface Evidence {
  id: string;
  title: string;
  description?: string;
  category: 'document' | 'screenshot' | 'log' | 'report' | 'certificate' | 'audit-trail' | 'other';
  status: 'active' | 'archived' | 'expired' | 'under-review';
  uploadDate: string;
  uploader: string;
  createdAt: string;
  updatedAt: string;
}