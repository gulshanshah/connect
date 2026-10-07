import Realm from 'realm';
import {StoryGroupSchema} from './schemas/StoryGroupSchema';
import {StorySchema} from './schemas/StorySchema';

const realm = await Realm.open({
  path: 'storiesRealm',
  schema: [StoryGroupSchema, StorySchema],
});
