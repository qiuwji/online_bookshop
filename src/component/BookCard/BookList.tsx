import React from 'react';
import BookCard from './BookCard';
import type { BookCardProps } from './BookCard';
import './BookList.css';

interface BookListProps {
  books: BookCardProps[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
  return (
    <div className="book-list-container">
      {books.map((book) => (
        <BookCard
          key={book.bookId} 
          {...book} 
        />
      ))}
    </div>
  );
};

export default BookList;