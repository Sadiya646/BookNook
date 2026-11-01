export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  imageUrl?: string;
  copies: number;
  totalCopies: number;
  userName: string;
  userEmail: string;
  createdAt: string;
}

export interface Borrow {
  _id: string;
  bookId: string;
  userEmail: string;
  borrowDate: string;
  returnDate?: string;
}