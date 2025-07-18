# Team Management Application

A web-based application for managing teams and projects with role-based access control (Admin and Member roles). Built using React, Node.js, Express, and MongoDB, this application allows Admins to create teams, invite members, and assign projects, while Members can view their assigned teams and projects.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [File Structure](#file-structure)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication (Signup/Login) with JWT tokens.
- Role-based access: Admin and Member roles.
- Admin can:
  - Create and manage teams.
  - Invite and remove members from teams.
  - Create, update, and delete projects.
  - Assign members to projects.
- Member can:
  - View assigned teams and projects.
- Pagination and search functionality for teams and projects.
- CSV export of projects.

## Prerequisites
- Node.js (v14.x or later)
- MongoDB (local or remote instance)
- npm or yarn
- Postman (for API testing)

## Installation

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd backend

.env file
PORT=5000
MONGODB_URI=mongodb://localhost:27017/team-management
JWT_SECRET=your-secret-key
