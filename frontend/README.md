This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.





# AI-Powered Cancer Detection Portal - Complete Project Overview

## Project Context
**Project Name:** Detect to Protect
**Program:** DIC MDaRT Summer Internship Projects (June 5 - July 4, 2025)
**Domain:** Artificial Intelligence
**Submission Deadline:** June 30, 2025
**Developer:**

## Problem Statement
Early and accurate cancer detection remains a critical global healthcare challenge, particularly in resource-constrained environments. While AI and deep learning technologies have demonstrated significant potential in cancer detection using imaging and clinical text data, there is currently no unified, user-friendly system that seamlessly integrates multimodal inputs (images and text) for comprehensive cancer diagnosis across multiple cancer types.

## Project Objective
Design and develop a comprehensive AI-integrated web-based Cancer Detection Portal that empowers healthcare professionals (doctors/researchers) and patients to upload clinical images and/or textual descriptions for accurate detection and analysis of multiple cancer types.

## Core Capabilities

### 1. Multimodal Input Support
- **Image-only Analysis:** Support for various medical imaging formats including:
  - Radiology images (CT, MRI, X-ray)
  - Histopathology slides
  - Dermoscopic images
  - 3D DICOM image processing with 2D slice separation for enhanced doctor inference
- **Text-only Input:** Clinical symptom descriptions and medical notes
- **Combined Multimodal:** Integrated image + text analysis for enhanced diagnostic accuracy

### 2. Multi-Cancer Detection Platform
The portal supports dedicated tabs for various cancer types:
- Brain Tumor/Cancer
- Breast Cancer
- Prostate Cancer
- Pancreatic Cancer
- Liver Cancer
- Esophagus Cancer
- Lung Cancer
- (Extensible architecture for additional cancer types)

### 3. User Role Management
- **Doctors/Healthcare Professionals:**
  - Access patient records and medical history
  - Upload and analyze medical images
  - View AI-generated segmentation results
  - Add medical notes and annotations
  - Manage appointments and patient interactions
  
- **Patients:**
  - Upload medical scans (MRI, CT, X-rays)
  - View segmented reports and AI analysis
  - Book appointments with healthcare providers
  - Access personal medical history
  - Interact with AI chatbot for symptom checking

- **System Administrators:**
  - Manage doctor registrations and permissions
  - Monitor system performance and usage statistics
  - Oversee platform maintenance and updates

## Technical Implementation

### Technology Stack
- **Frontend Framework:** Next.js 15 (App Router)
- **Backend & Database:** Firebase (Firestore, Authentication, Storage)
- **Styling:** Tailwind CSS
- **AI/ML Integration:** Pre-trained models with API integration
- **File Storage:** Firebase Storage for medical images
- **Real-time Features:** Firebase Realtime Database

### Key Features

#### 1. Intelligent Chatbot Interface
- Guides users through the upload process
- Provides AI-driven diagnostic insights
- Offers symptom checking capabilities
- Delivers educational content about cancer prevention

#### 2. Advanced Image Processing
- DICOM file support for 3D medical imaging
- Automated 2D slice extraction from 3D volumes
- Image preprocessing and enhancement
- Segmentation result visualization

#### 3. AI-Powered Detection Models
- Integration of specialized AI models for each cancer type
- Real-time image analysis and classification
- Confidence scoring and diagnostic recommendations
- Comparative analysis for multimodal inputs

#### 4. Comprehensive Reporting System
- Automated report generation
- AI-generated insights and recommendations
- Historical tracking and comparison
- Export capabilities for medical records

## User Journey Flow

### For Patients:
1. **Registration/Login** → Select patient role
2. **Dashboard Access** → View personal health overview
3. **Cancer Type Selection** → Choose specific cancer screening
4. **Data Upload** → Upload images and/or enter symptoms
5. **AI Processing** → Backend model analysis
6. **Results Review** → View segmented reports and recommendations
7. **Appointment Booking** → Schedule consultation with doctors
8. **Chatbot Interaction** → Get instant support and guidance

### For Doctors:
1. **Professional Login** → Access healthcare provider dashboard
2. **Patient Management** → View assigned patients and cases
3. **Image Analysis** → Review AI-processed medical images
4. **Diagnosis Input** → Add professional medical notes
5. **Report Generation** → Create comprehensive diagnostic reports
6. **Patient Communication** → Manage appointments and consultations

## Expected Deliverables

### Technical Deliverables:
1. **Functional Web Portal** - Complete Next.js 15 application
2. **Multi-Cancer Support** - Minimum 6-7 cancer type integrations
3. **AI Model Integration** - Working detection models for each cancer type
4. **Chatbot Implementation** - Intelligent conversational interface
5. **User Management System** - Role-based authentication and authorization
6. **Responsive Design** - Mobile and desktop optimized interface

### Medical Impact:
1. **Early Detection Support** - AI-assisted preliminary screening
2. **Resource Optimization** - Reduced radiologist intervention through automated segmentation
3. **Accessibility Enhancement** - User-friendly interface for non-technical users
4. **Educational Component** - Increased awareness through chatbot interactions

## Security & Compliance Considerations
- HIPAA-compliant data handling
- Encrypted medical image storage
- Secure user authentication
- Audit logging for medical data access
- Role-based access controls

## Innovation Highlights
1. **Multimodal AI Integration** - Combining image and text analysis
2. **3D to 2D Processing** - Automated DICOM slice extraction
3. **Real-time Chatbot** - Instant AI-powered medical guidance
4. **Extensible Architecture** - Easy addition of new cancer types
5. **Cross-platform Compatibility** - Web-based accessibility

This project represents a significant advancement in democratizing AI-powered cancer detection technology, making sophisticated diagnostic tools accessible to healthcare providers and patients while maintaining the highest standards of medical data security and user experience.