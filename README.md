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

AWS_ACCESS_KEY=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET=
AWS_REGION=
AWS_TASK_DEFINITION=
AWS_CLUSTER=
AWS_CONTAINER_NAME=
AWS_SECURITY_GROUP=
AWS_SUBNET_1=
AWS_SUBNET_2=
AWS_SUBNET_3=

OAUTH_CLIENT_ID=
OAUTH_CLIENT_SECRET=
OAUTH_REDIRECT_URI=
```

Create a `.env` file inside `/container` directory with:

```env
AWS_ACCESS_KEY=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET=
AWS_REGION=

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