# Uizzy

Uizzy is an interactive quiz application inspired by Kahoot!, built using React.js, Tailwind CSS, Ant Design, React Icons, Supabase, and PostgreSQL. The platform allows users to create, share, and participate in quizzes in a fun and engaging manner.

## Features

- **User Authentication**: Secure sign-up and login using Supabase.
- **Create Quizzes**: Users can create quizzes with multiple-choice questions.
- **Real-time Interaction**: Participants can join quizzes in real-time and submit answers.
- **Leaderboards**: View scores and rankings after quizzes.
- **Responsive Design**: Built with Tailwind CSS for a seamless experience across devices.

## Tech Stack

- **Frontend**:
  - [React.js](https://reactjs.org/)
  - [Tailwind CSS](https://tailwindcss.com/)
  - [Ant Design](https://ant.design/)
  - [React Icons](https://react-icons.github.io/react-icons/)
  
- **Backend**:
  - [Supabase](https://supabase.io/) for authentication and database management
  - [PostgreSQL](https://www.postgresql.org/) for storing quiz and user data

## Installation

To get started with Uizzy locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/laxnax/Uizzy.git
    ```

2. Navigate into the project directory:

    ```bash
    cd Uizzy
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Set up environment variables:

    - Create a `.env` file in the root of the project.
    - Add the following variables (obtain your Supabase credentials from your Supabase project):

      ```
      REACT_APP_SUPABASE_URL=your-supabase-url
      REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
      ```

5. Run the application:

    ```bash
    npm start
    ```

6. Visit `http://localhost:3000` in your browser to see the app in action.

## Usage

- Sign up or log in to start participating in quizzes.
- Create a quiz with multiple-choice questions.
- Share the quiz link with friends and join live sessions.
- After each quiz, view the leaderboard to check scores and rankings.

## Contributing

Contributions are welcome! If you'd like to help improve Uizzy, follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Kahoot!](https://kahoot.com/) for inspiring this project.
- [Supabase](https://supabase.io/) for their amazing backend-as-a-service platform.
- [React.js](https://reactjs.org/) for the powerful frontend library.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Ant Design](https://ant.design/) for the beautiful UI components.

## Demo

You can check out the demo of Uizzy at [Live](https://uizzy.vercel.app).

## Screenshots
![image](https://github.com/user-attachments/assets/4f8b1ea8-0a30-4010-a04d-b6e40c7117a9)

![image](https://github.com/user-attachments/assets/bfb29b65-63df-4c86-8068-50e256ca851b)

![image](https://github.com/user-attachments/assets/20d7a55c-2c94-4d78-923f-cb2364a89d18)

![image](https://github.com/user-attachments/assets/612781de-5c1f-4f26-9ab1-66d00bf43e8f)









