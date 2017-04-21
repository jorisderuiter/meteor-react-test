import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import Books from './collections/books';

export const saveBooks = new ValidatedMethod({
  name: 'saveBooks',

  validate: new SimpleSchema({
    books: Array,
    'books.$': { type: Object, blackbox: true },
  }).validator(),

  run({ books }) {
    try {
      Books.batchInsert(books);
    } catch (e) {
      throw new Meteor.Error('save-error');
    }
  },
});

export const removeBooks = new ValidatedMethod({
  name: 'removeBooks',

  validate: new SimpleSchema({
    books: Array,
    'books.$': { type: Object, blackbox: true },
  }).validator(),

  run({ books }) {
    try {
      const bookIds = books.map(book => { return book.id });
      Books.remove({ id: { $in: bookIds } });
    } catch (e) {
      throw new Meteor.Error('remove-error');
    }
  },
});
