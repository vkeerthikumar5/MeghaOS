# EnguOS Backend (MERN)

This is the backend server for the EnguOS Cloud Desktop.

## Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or MongoDB Atlas)
- OnlyOffice Document Server (Optional, for full editing capability)

## Setup
1. `cd server`
2. `npm install`
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/enguos
   JWT_SECRET=your_super_secret_key
   ```
4. `npm run dev`

## API Endpoints

### Files
- `GET /api/files/:parentId?` - List files/folders
- `POST /api/files` - Create new file/folder
- `DELETE /api/files/:id` - Delete item
- `GET /api/files/:id/open` - Get OnlyOffice config
- `POST /api/files/:id/save` - Callback for saving edits

### Users
- `POST /api/users/register` - Signup
- `POST /api/users/login` - Login

## OnlyOffice Integration
The frontend is configured to load OnlyOffice Editors via iFrame. It expects an OnlyOffice server running at `http://localhost:8080`. If not found, a beautiful simulation UI is displayed.
