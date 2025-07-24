# 🎬 YouTubeLayer

**Tagline:** _Streamline your YouTube video editing and publishing._

## 🚀 Overview

**YouTubeLayer** is a Proof of Concept (PoC) that demonstrates the feasibility of automating YouTube video publishing by integrating:

- **AWS S3** for storing uploaded videos
- **AWS ECR & ECS** for spinning containers that handle publishing
- **Google OAuth 2.0** for YouTube login
- **YouTube API** for video uploads

This PoC validates whether it's possible to:
- Upload videos to an S3 bucket via code
- Programmatically launch a container that downloads the video from S3
- Publish the video to YouTube via the YouTube API

---

## 👥 Target Users

- YouTube Channel Owners
- Remote Video Editors

---

## 🛠️ Tech Stack

- **Frontend/Backend:** Next.js
- **Database:** MongoDB
- **Cloud Infrastructure:** AWS (S3, ECR, ECS)
- **Authentication:** Google OAuth 2.0
- **Video Upload:** YouTube API

---

## ✅ Features in v1

- User registration and sign-in (for owners and editors)
- Individual dashboards for each user type
- Project creation and editor assignment by owner
- Raw and edited video upload functionality
- Google login for owners to connect YouTube
- YouTube video publishing from the dashboard (owner)

---

## 🧩 Planned Features (Future Phases)

- Email-based OTP for user registration verification
- Forgot password, change password, change email
- Project management (edit/delete project, delete videos)
- Editor management (remove editor from a project)
- Google login management (login status, logout, view profile/channel info)
- UI enhancements based on user role

---

## 🐞 Known Issues / Bugs

This is a list of the known bugs and issues identified in the **v1 release** of the **YouTubeLayer** platform.

### 1. Login Redirect Issue
- After successful login, the user is redirected to the **home page** instead of the **dashboard**.  
- A **manual refresh** is required for the dashboard to appear correctly.

### 2. Editor Assignment UI Not Updating
- After assigning an editor to a project, the list of editors **does not update automatically**.  
- A **manual refresh** is needed to reflect the changes.

### 3. Video Upload UI Delay
- After uploading a video to a project, the updated list of videos is **not rendered automatically**.  
- Users must **refresh the page manually** to see the uploaded content.

### 4. Google Login Redirection
- After logging in with Google, users are always redirected to the **dashboard**, regardless of their original navigation path or intended destination.

### 5. Persistent Google Login Token Issue
- Once a user logs in via Google, they **cannot log in again in future sessions**.  
- The authentication tokens are **set indefinitely**, which prevents proper re-authentication and token renewal.

### 6. Session Timeout Missing
- Users remain logged in **indefinitely** unless they **manually log out**.  
- There is currently **no session timeout** or auto-logout mechanism based on inactivity.

### 7. Login Fails
- Login fails when a user enters their email in uppercase or mixed case.
- Login only succeeds when the email is entered with the exact same case (uppercase/lowercase) as it was during registration.

### 8. Editor Assignment Fails
- Fails when a user enters editor's email in uppercase or mixed case.
- Only succeeds when the email is entered with the exact same case (uppercase/lowercase) as it was during registration.

---

## ⚙️ Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/roydevashish/youtubelayer.git

cd youtubelayer

npm install
```

### 2. Infrastructure Setup
- Setup a MongoDB database
- Setup Resend for API Keys
- Setup/generate a random secret for NextAuth
- Setup AWS as per the AWS Setup Requirements
- Setup Google OAuth at Google Cloud Platform for OAuth API Keys

### 3. Setup Environment Variables

Create a `.env` file in the root directory with the following:

```env
MONGODB_URI=
RESEND_API_KEY=
NEXTAUTH_SECRET=

YT_AWS_ACCESS_KEY=
YT_AWS_SECRET_ACCESS_KEY=
YT_AWS_BUCKET=
YT_AWS_REGION=
YT_AWS_TASK_DEFINITION=
YT_AWS_CLUSTER=
YT_AWS_CONTAINER_NAME=
YT_AWS_SECURITY_GROUP=
YT_AWS_SUBNET_1=
YT_AWS_SUBNET_2=
YT_AWS_SUBNET_3=

OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
OAUTH_REDIRECT_URI=
```

Create a `.env` file inside `/container` directory with:

```env
YT_AWS_ACCESS_KEY=
YT_AWS_SECRET_ACCESS_KEY=
YT_AWS_BUCKET=
YT_AWS_REGION=

OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
OAUTH_REDIRECT_URI=
```

### 4. Build and Publish container image to ECR

- Build a contianer image from the files inside `/container`
- Publish the container image at ECR

### 5. Run the development server
``` bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ☁️ AWS Setup Requirements

- An IAM user with permissions for ECS, ECR, S3
- An S3 bucket for uploading raw and edited videos
- An ECR repository to host the container image
- An ECS cluster to run the container
- A task definition that spins the container to upload videos to YouTube

---

## 🧱 Architecture Overview

```text
YouTubeLayer
│
├── Frontend/Backend (Next.js)
│
├── MongoDB (User/Project Data)
│
├── AWS S3 (Video Storage)
│
├── AWS ECR (Container Image)
│
├── AWS ECS (Runs YouTube Uploader Container)
│
└── YouTube API + Google OAuth (For publishing)
```

---

## 📜 License

No license specified as of v1 release.

---

## 🙋‍♂️ Maintainer

GitHub: [@roydevashish](https://github.com/roydevashish)
