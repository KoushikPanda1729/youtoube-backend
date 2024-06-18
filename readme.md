# YouTube Backend Project

This project is a backend service for a YouTube-like application. It uses a variety of technologies to handle user authentication, video uploads, and data management. Below is an overview of the technologies and how they are used in the project.

## Technologies Used

- **bcrypt**: Used for hashing and verifying user passwords.
- **Cloudinary**: Handles video and image uploads and storage.
- **cookie-parser**: Parses cookies attached to client requests.
- **cors**: Enables Cross-Origin Resource Sharing, allowing the frontend to communicate with the backend.
- **dotenv**: Loads environment variables from a `.env` file.
- **Express**: A web application framework for Node.js, used to build the server.
- **jsonwebtoken**: Used for creating and verifying JSON Web Tokens (JWTs) for authentication.
- **mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
- **mongoose-aggregate-paginate-v2**: Provides pagination for Mongoose aggregate queries.
- **multer**: Middleware for handling multipart/form-data, used for file uploads.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Node Package Manager is installed with Node.js. Verify by running `npm -v` in your terminal.
- **MongoDB**: Install MongoDB from [mongodb.com](https://www.mongodb.com/). Ensure MongoDB is running on your local machine or provide a remote MongoDB URI.
- **Cloudinary Account**: Sign up for a free account at [Cloudinary](https://cloudinary.com/). You will need your Cloud Name, API Key, and API Secret.
- **Environment Variables**: Set up a `.env` file in the root directory of your project with the following variables:
  ```env
  PORT=8000
  MONGODB_URI=your_mongodb_uri
  CORS_ORIGIN=*
  ACCESS_TOKEN_SECRET=youraccesstokensecret
  ACCESS_TOKEN_EXPIRY=youraccesstokenexpiry
  REFRESH_TOKEN_SECRET=yourrefreshtokensecret
  REFRESH_TOKEN_EXPIRY=yourrefreshtokenexpiry

  CLOUDINARY_CLOUD_NAME=yourcloudname
  CLOUDINARY_API_KEY=yourapikey
  CLOUDINARY_API_SECRET=yourapisecret

### Installation

1. Clone the repo:
   ```sh
   git clone https://github.com/KoushikPanda1729/youtoube-backend.git






## Running the Server

  ###  "dev": "nodemon src/index.js"

## Middleware
### bcrypt: Used to hash passwords before saving them to the database and to compare entered passwords with the hashed passwords during login.

### Cloudinary: Used to upload and store video files and thumbnails.
### cookie-parser: Parses cookies to read JWT tokens for user authentication.

### cors: Allows the frontend application to make requests to the backend server.

### dotenv: Loads environment variables from a .env file into process.env.

### jsonwebtoken: Generates and verifies JWT tokens for secure authentication.

### multer: Handles multipart/form-data for video uploads.


<br>
<br>


#  This is the  [Project link](https://github.com/KoushikPanda1729/youtoube-backend)