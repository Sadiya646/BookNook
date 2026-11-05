# BookNook 📚

A small online library. **Add a book, borrow a book, return a book.**

🔗 **Live site:** [LIVE SITE URL]
⚙️ **Server repo:** [GITHUB SERVER LINK]

## Features

- Browse all books and see the 6 newest on the home page
- Register and log in with email or Google
- Add, edit and delete your own books
- Borrow a book for 7 days and return it in one click
- Live copy count, shows "Not Available" when no copies are left
- Stops you from borrowing the same book twice
- Dark and light theme, fully responsive
- Animated hero slider with Swiper.js and Framer Motion

## Tech Stack

- **Client:** Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Auth:** BetterAuth with MongoDB adapter, JWT
- **Server:** Express.js, MongoDB

## Run Locally

```bash
git clone [GITHUB CLIENT LINK]
cd booknook-client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).