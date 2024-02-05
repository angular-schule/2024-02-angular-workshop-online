import { Component, inject } from '@angular/core';
import { Book } from '../shared/book';
import { BookComponent } from '../book/book.component';
import { BookRatingService } from '../shared/book-rating.service';
import { BookStoreService } from '../shared/book-store.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BookComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  books: Book[] = [];

  // private rs2 = inject(BookRatingService);

  constructor(private rs: BookRatingService, private bs: BookStoreService) {
    this.bs.getAll().subscribe(books => {
      this.books = books;
    });
  }

  doRateUp(book: Book) {
    const ratedBook = this.rs.rateUp(book);
    this.updateList(ratedBook);
  }

  doRateDown(book: Book) {
    const ratedBook = this.rs.rateDown(book);
    this.updateList(ratedBook);
  }

  doDelete(book: Book) {
    this.bs.delete(book.isbn).subscribe(() => {
      this.bs.getAll().subscribe(books => {
        this.books = books;
      })
    })
  }

  private updateList(ratedBook: Book) {
    // [1,2,3,4,5].map(e => e * 10); // [10, 20, 30, 40, 50]
    // [1,2,3,4,5,6,7,8,9].filter(e => e > 5) // [6,7,8,9]

    this.books = this.books.map(b => {
      if (b.isbn === ratedBook.isbn) {
        return ratedBook;
      } else {
        return b;
      }
    })

    // this.books = this.books.map(b => b.isbn === ratedBook.isbn ? ratedBook : b);
  }
}
