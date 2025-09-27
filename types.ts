export interface Document {
  id: string;
  title: string;
  thumbnailDataUrl: string;
  fileDataUrl: string;
  fileType: 'image' | 'pdf';
  tags: string[];
  createdAt: number;
  folder?: string;
}

export type SubscriptionStatus = 'free' | 'premium';

export interface BiometricConfig {
  isSupported: boolean;
  isEnabled: boolean;
}

export type Folder = 'inbox' | 'all' | 'sent';
