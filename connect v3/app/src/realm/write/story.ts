realm.write(() => {
    realm.create('StoryGroup', {
      id: 'your',
      name: 'Your Story',
      isYourStory: true,
      avatar: 'https://i.pravatar.cc/150?img=99',
      stories: [
        {
          id: 'ys1',
          image: 'https://picsum.photos/300/500?random=111',
          caption: 'Just chilling at home...',
          postedTime: new Date('2024-03-25T14:30:00'),
        },
        {
          id: 'ys2',
          image: 'https://picsum.photos/300/500?random=112',
          caption: 'Look at this cool view!',
          postedTime: new Date('2024-03-25T15:45:00'),
        },
      ],
    });
  });
  