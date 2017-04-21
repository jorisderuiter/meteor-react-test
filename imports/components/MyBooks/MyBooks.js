import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectSheet } from '/imports/styling';
import Bookshelf, { BookshelfHelper } from '../Bookshelf';

const styles = {
  bookResults: {
    marginTop: 24,
  },

  manageButtons: {
    marginTop: 16,
  },
};

@injectSheet(styles)
@BookshelfHelper class MyBooks extends Component {
  removeBooks = () => {
    this.props.removeBooks.call({
      books: this.props.books.filter(
        book => this.props.selectedBookIds.indexOf(book.id) >= 0,
      ),
    }, (err) => {
      if (!err) {
        this.props.selectedBookIds.forEach(bookId => {
          this.props.onToggleBookSelection(bookId);
        })
      }
    });
  };

  renderRemoveBooksAction() {
    if (this.props.selectedBookIds <= 0) return null;

    const { classes } = this.props;

    return (
      <div className={classes.manageButtons}>
        <button onClick={this.removeBooks}>Remove from My Collection</button>
      </div>
    )
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.renderRemoveBooksAction()}
        <div className={classes.bookResults}>
          <Bookshelf
            books={this.props.books}
            selectedBookIds={this.props.selectedBookIds}
            onToggleBookSelection={this.props.onToggleBookSelection}
          />
        </div>
      </div>
    );
  }
}

export default MyBooks;
