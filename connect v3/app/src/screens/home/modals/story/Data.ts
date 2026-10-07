



export type User = { id: string; name: string; avatar: string };
export type Story = {
  id: string;
  image: string;
  caption: string;
  timestamp: string;
  viewed: boolean;
};
export type UserStories = { user: User; stories: Story[] };

export const usersStories: UserStories[] = [
  {
    user: { id: 'u1', name: 'Alice', avatar: `https://i.pravatar.cc/100?img=8` },
    stories: [
      {
        id: '1_1',
        image: `https://picsum.photos/600/800?random=1`,
        caption: `Alice's first adventure 🚴‍♂️`,
        timestamp: '2025-06-24T08:30:00Z',
        viewed: true,
      },
      {
        id: '1_2',
        image: `https://picsum.photos/600/800?random=4`,
        caption: `Alice in nature 🌲`,
        timestamp: '2025-06-24T09:00:00Z',
        viewed: true,
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
        viewed: true,
      },
      {
        id: '2_2',
        image: `https://picsum.photos/600/800?random=5`,
        caption: `Bob's sunset view 🌅`,
        timestamp: '2025-06-23T21:00:00Z',
        viewed: false,
      },
      {
        id: '2_3',
        image: `https://picsum.photos/600/800?random=6`,
        caption: `Rainy street stroll 🌧️`,
        timestamp: '2025-06-23T22:00:00Z',
        viewed: false,
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
        viewed: false,
      },
      {
        id: '3_2',
        image: `https://picsum.photos/600/800?random=7`,
        caption: `Morning jog 🏃‍♀️`,
        timestamp: '2025-06-24T08:15:00Z',
        viewed: false,
      },
    ],
  },
  {
    user: { id: 'u4', name: 'Dave', avatar: `https://i.pravatar.cc/100?img=4` },
    stories: [
      {
        id: '4_1',
        image: `https://picsum.photos/600/800?random=8`,
        caption: `Coding marathon 💻`,
        timestamp: '2025-06-22T12:00:00Z',
        viewed: false,
      },
      {
        id: '4_2',
        image: `https://picsum.photos/600/800?random=9`,
        caption: `Midnight pizza run 🍕`,
        timestamp: '2025-06-22T23:30:00Z',
        viewed: false,
      },
    ],
  },
  {
    user: { id: 'u5', name: 'Eve', avatar: `https://i.pravatar.cc/100?img=5` },
    stories: [
      {
        id: '5_1',
        image: `https://picsum.photos/600/800?random=10`,
        caption: `Yoga and peace 🧘‍♀️`,
        timestamp: '2025-06-20T06:00:00Z',
        viewed: true,
      },
      {
        id: '5_2',
        image: `https://picsum.photos/600/800?random=11`,
        caption: `Healthy breakfast 🥑🍞`,
        timestamp: '2025-06-20T07:30:00Z',
        viewed: false,
      },
      {
        id: '5_3',
        image: `https://picsum.photos/600/800?random=12`,
        caption: `Colorful smoothie bowl 🍓`,
        timestamp: '2025-06-20T08:00:00Z',
        viewed: false,
      },
    ],
  },
  {
    user: { id: 'u6', name: 'Frank', avatar: `https://i.pravatar.cc/100?img=6` },
    stories: [
      {
        id: '6_1',
        image: `https://picsum.photos/600/800?random=13`,
        caption: `Climbing heights 🧗‍♂️`,
        timestamp: '2025-06-21T15:00:00Z',
        viewed: true,
      },
    ],
  },
  {
    user: { id: 'u7', name: 'Grace', avatar: `https://i.pravatar.cc/100?img=7` },
    stories: [
      {
        id: '7_1',
        image: `https://picsum.photos/600/800?random=14`,
        caption: `Bookstore wander 📚`,
        timestamp: '2025-06-19T17:00:00Z',
        viewed: true,
      },
      {
        id: '7_2',
        image: `https://picsum.photos/600/800?random=15`,
        caption: `Afternoon tea time 🍵`,
        timestamp: '2025-06-19T18:30:00Z',
        viewed: false,
      },
    ],
  },
];
