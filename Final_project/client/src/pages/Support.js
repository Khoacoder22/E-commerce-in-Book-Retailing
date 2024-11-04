import React from "react";
import ChatBot from 'react-simple-chatbot';

const bookRecommendations = {
  fiction: ['1984', 'To Kill a Mockingbird', 'The Great Gatsby'],
  nonFiction: ['Sapiens', 'Educated', 'Becoming'],
  technology: ['Clean Code', 'The Pragmatic Programmer', 'Introduction to Algorithms'],
  fantasy: ['Harry Potter', 'The Hobbit', 'The Name of the Wind'],
  bestSeller: ['Atomic Habits', 'The Silent Patient', 'Where the Crawdads Sing'], 
  nobelPrize: ['The Old Man and the Sea', 'One Hundred Years of Solitude', 'Beloved'], 
  cheapest: ['The Little Prince - $5', 'Frankenstein - $4.50', 'The Metamorphosis - $3'] 
};

const RecommendBooks = ({ steps }) => {
  const genre = steps.genre.value;
  const books = bookRecommendations[genre] || [];
  
  return (
    <div>
      {books.length > 0 ? (
        <div>
          <p>Here are some {genre} books I recommend:</p>
          <ul>
            {books.map((book, index) => (
              <li key={index}>{book}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Sorry, I don't have recommendations for this genre.</p>
      )}
    </div>
  );
};

export default function Support() {
  return (
    <ChatBot
      steps={[
        {
          id: '1',
          message: 'Hi! What is your name?',
          trigger: 'name',
        },
        {
          id: 'name',
          user: true,
          trigger: 'genre',
        },
        {
          id: 'genre',
          options: [
            { value: 'fiction', label: 'Fiction', trigger: '5' },
            { value: 'nonFiction', label: 'Non-fiction', trigger: '5' },
            { value: 'technology', label: 'Technology', trigger: '5' },
            { value: 'fantasy', label: 'Fantasy', trigger: '5' },
            { value: 'bestSeller', label: 'Best Sellers', trigger: '5' },
            { value: 'nobelPrize', label: 'Nobel Prize Winners', trigger: '5' },
            { value: 'cheapest', label: 'Cheapest Books', trigger: '5' }
          ]
        },
        {
          id: '5',
          component: <RecommendBooks />,
          asMessage: true,
          end: true,
        },
      ]}
      floating={true} // Làm chatbot nổi ở góc phải
    />
  );
}
