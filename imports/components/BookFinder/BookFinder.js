import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import axios from 'axios';
import { injectSheet } from '/imports/styling';
import Bookshelf, { BookshelfHelper } from '../Bookshelf';

const styles = {
  bookCount: {
    fontWeight: 'bold',
  },

  bookResults: {
    marginTop: 24,
  },

  busyText: {
    fontSize: 13,
    marginLeft: 6,
  },

  manageButtons: {
    marginTop: 16,
  },

  resultsArea: {
    marginTop: 24,
  },

  searchButton: {
    marginLeft: 6,
  },
  saveBooksResponse: {
    marginTop: 16,
  }
};

@injectSheet(styles)
@BookshelfHelper
class BookFinder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      bookCount: 0,
      books: [],
      fetching: false,
      query: '',
      saveBooksResponse: false,
    };
  }

  bookSelectionUpdated = bookIds => {
    this.setState({ bookSelections: bookIds });
  };

  saveBooks = () => {
    this.props.saveBooks.call({
      books: this.state.books.filter(
        book => this.props.selectedBookIds.indexOf(book.id) >= 0,
      ),
    }, (err) => {
      if (err) {
        this.setState({ saveBooksResponse: err.message });
      } else {
        this.setState({ saveBooksResponse: 'Saved successfully' });
        this.props.selectedBookIds.forEach(bookId => {
          this.props.onToggleBookSelection(bookId);
        })
      }
    });
  };

  toggleBookSelection = (bookId) => {
    this.setState({ saveBooksResponse: false });
    this.props.onToggleBookSelection(bookId);
  }

  searchBooks = async event => {
    event.preventDefault();
    this.setState({ bookCount: 0, fetching: true });

    try {
      /*
       * We normally wouldn't use Meteor-specific stuff in non-container
       * components (keep the React components pure!), but since this is just a
       * test, we're breaking the rules a bit.
       */
      const response = await axios.get(
        Meteor.settings.public.baseReqUrl + `&q=${this.state.query}`,
      );

      if (response.status === 200) {
        this.setState({
          bookCount: response.data.totalItems,
          books: response.data.items,
          fetching: false,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  textChange = ({ target }) => {
    this.setState({
      [target.name]: target.value,
    });
  };

  renderSaveBooksAction = () => {
    if (this.props.selectedBookIds <= 0) return null;

    const { classes } = this.props;

    return (
      <div className={classes.manageButtons}>
        <button onClick={this.saveBooks}>Save to My Collection</button>
      </div>
    )
  }

  renderSaveBooksResponse = () => {
    if (!this.state.saveBooksResponse) return null;

    const { classes } = this.props;

    return (
      <div className={classes.saveBooksResponse}>
        {this.state.saveBooksResponse}
      </div>
    )
  }

  renderResultsArea = () => {
    if (!this.state.bookCount) return null;

    const { classes } = this.props;

    return (
      <div>
        <div className={classes.bookCount}>
          {this.state.bookCount} books found. Showing 40.
        </div>
        {this.renderSaveBooksAction()}
        {this.renderSaveBooksResponse()}
        <div className={classes.bookResults}>
          <Bookshelf
            books={this.state.books}
            selectedBookIds={this.props.selectedBookIds}
            onToggleBookSelection={this.toggleBookSelection}
          />
        </div>
      </div>
    );
  };

  renderSearchArea = () => {
    const { classes } = this.props;

    return (
      <div>
        <form onSubmit={this.searchBooks}>
          <input
            name="query"
            onChange={this.textChange}
            value={this.state.query}
          />
          <button
            className={classes.searchButton}
            disabled={this.state.fetching}
            type="submit"
          >
            Search
          </button>
          {this.state.fetching
            ? <span className={classes.busyText}>Searching...</span>
            : null}
        </form>
      </div>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.renderSearchArea()}

        <div className={classes.resultsArea}>
          {this.renderResultsArea()}
        </div>
      </div>
    );
  }
}

export default BookFinder;
