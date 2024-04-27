import { Location } from './location.model';

export interface User {
  username: string;
  profilePictureUrl: string;
  location?: Location;
  bio: string;
  links: link[];
  onlineAuctions: number;
  pastDeals: number;
}

export type UserSummary = Pick<User, 'username' | 'location'>;

interface link {
  name: string;
  url: string;
}
