import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import MyBooks from './MyBooks';
import Books from '/imports/collections/books';
import { removeBooks } from '/imports/methods';
import { promisifyMethod } from '/imports/helpers';

export default createContainer(() => {
  const handle = Meteor.subscribe('myBooks');

  return {
    books: Books.find().fetch(),
    removeBooks: promisifyMethod(removeBooks),
  };
}, MyBooks);
