
export type User = { id: string; name: string; avatar: string };
export type Story = { id: string; image: string; caption: string; timestamp: string };
export type UserStories = { user: User; stories: Story[] };

export const usersStories: UserStories[] = [
  {
    user: { id: 'u1', name: 'Alice', avatar: `https://i.pravatar.cc/100?img=1` },
    stories: [
      {
        id: '1_1',
        image: `https://picsum.photos/600/800?random=1`,
        caption: `Alice's first adventure 🚴‍♂️`,
        timestamp: '2025-06-24T08:30:00Z',
      },
      {
        id: '1_2',
        image: `https://picsum.photos/600/800?random=4`,
        caption: `Alice in nature 🌲`,
        timestamp: '2025-06-24T09:00:00Z',
      },
    ],
  },
  {
    user: { id: 'u2', name: 'Bob', avatar: `https://i.pravatar.cc/100?img=2` },
    stories: [
      {
        id: '2_1',
        image: `https://picsum.photos/600/800?random=2`,
        caption: `Bob city lights ✨`,
        timestamp: '2025-06-23T20:15:00Z',
      },
      {
        id: '2_2',
        image: `https://picsum.photos/600/800?random=5`,
        caption: `Bob's sunset view 🌅`,
        timestamp: '2025-06-23T21:00:00Z',
      },
      {
        id: '1hdrf',
        image: `https://picsum.photos/600/800?random=1`,
        caption: `Alice's first adventure 🚴‍♂️`,
        timestamp: '2025-06-22T18:00:00Z',
      },
      {
        id: '1ksndc',
        image: `https://picsum.photos/600/800?random=4`,
        caption: `Alice in nature 🌲`,
        timestamp: '2025-06-22T19:00:00Z',
      },
    ],
  },
  {
    user: { id: 'u3', name: 'Carol', avatar: `https://i.pravatar.cc/100?img=3` },
    stories: [
      {
        id: '3_1',
        image: `https://picsum.photos/600/800?random=3`,
        caption: `Carol's coffee time ☕️`,
        timestamp: '2025-06-24T07:45:00Z',
      },
    ],
  },
];



export const user = {
  name: 'Jane Doe',
  avatar: 'https://i.pravatar.cc/150?img=8',
  timeAgo: '2h ago',
};

export const viewers = [
  { name: 'Alice', liked: true },
  { name: 'Bob', liked: false },
  { name: 'Charlie', liked: true },
  { name: 'Diana', liked: false },
];
