# Project Requirements Document (PRD)

## 1. Project Overview

This project is for a dashboard and data input app designed to help civil servants involved with Brazil's Estratégia Federal de Governo Digital (EFGD). The EFGD is a framework that modernizes government operations and public services by promoting transparency, efficiency, inclusion, and innovation. The app lets managers and field data inputters record real-time progress on various digital government initiatives, while a monitoring dashboard visualizes key performance metrics, making it easier for all stakeholders to track the evolution of the strategy.

The main goal is to provide an easy-to-use, secure, and consistent digital solution that supports the execution and oversight of the EFGD. By streamlining data collection and displaying mission-critical information in a clear graphical format, the project aims to enhance decision making, ensure accountability, and drive timely action. Success will be measured by improved data accuracy, adherence to security standards and government branding, and the overall usability of both the mobile and desktop experiences.

## 2. In-Scope vs. Out-of-Scope

**In-Scope:**

*   A responsive app optimized for both mobile devices and desktops.
*   Secure user authentication with multi-factor authentication (MFA) and integration with Azure Active Directory for role-based access control.
*   A user-friendly data input interface where civil servants can select initiatives, input progress data (completion percentages, milestones, challenges, attachments), and review updates before submission.
*   A monitoring dashboard that aggregates data from a SharePoint table and displays key metrics—including initiative progress, timelines, outputs, and satisfaction ratings—via graphical representations.
*   Integration with government design manuals for consistent branding and dashboard design.
*   Notification feature to alert users about deadlines, initiative updates, or changes to policies.
*   Batch updates from the app to the dashboard, with data integration from SharePoint.
*   Administrative oversight capabilities that allow managers to edit roles, permissions, and review historic user submissions.

**Out-of-Scope:**

*   A full-fledged messaging system between users (only notifications are required).
*   Offline functionality is desirable but not essential in the first phase.
*   Advanced analytical tools or predictive analytics beyond basic descriptive metrics.
*   Extensive customization or third-party integrations outside the SharePoint API and existing government systems.

## 3. User Flow

A typical user journey starts when a civil servant launches the app on their mobile device or desktop. They are greeted with a splash screen followed by a secure login screen that uses multi-factor authentication. Once logged in, the user lands on a personalized dashboard designed according to government branding guidelines. Here, they find a list of assigned initiatives and select the project they are responsible for.

After selecting an initiative, the user is navigated to a dedicated data entry form. This screen prompts them to input progress updates such as completion percentages, milestones achieved, and challenges encountered, with the option to attach supporting documents. The user then reviews the input data on a summary screen and submits the update. A confirmation message is displayed to verify successful submission. Meanwhile, notifications keep the user informed of critical alerts like upcoming deadlines and any changes to initiative parameters.

## 4. Core Features

*   **User Authentication & Role Management:**\
    • Secure login with multi-factor authentication (MFA).\
    • Role-based access control (RBAC) differentiating managers and data inputers.\
    • Managers can edit permissions, roles, and view all data submissions.
*   **Data Input Interface:**\
    • Initiative selection from a tailored list of ongoing projects assigned to the user.\
    • Structured form for recording progress (completion percentages, milestones, challenges, and attachments).\
    • Summary page for review before submitting the data.
*   **Monitoring Dashboard:**\
    • Graphical display of initiative progress, timelines, output indicators, and satisfaction ratings.\
    • Batch updates from SharePoint data to ensure consistent metric refresh.\
    • Consistent layout and design following the government design manual.
*   **Notifications:**\
    • Alerts for deadlines, initiative updates, and changes in project parameters.\
    • Real-time notifications (although dashboard updates are batched).
*   **Integration with Government Systems:**\
    • Data synchronization with a central SharePoint table updated by managers and the data input app.

## 5. Tech Stack & Tools

*   **Frontend:**\
    • Framework: React (ensuring a responsive and dynamic user interface).\
    • Mobile/Desktop Compatibility: The UI design will prioritize usability on both platforms per government design guidelines.
*   **Backend:**\
    • Server: Node.js with Express for REST API endpoints.\
    • Database: NoSQL (for flexible data models) and Firebase for potential real-time functionalities.\
    • Integration: SharePoint API for accessing and updating the central SharePoint table.
*   **Security & Authentication:**\
    • Azure Active Directory for implementing Role-Based Access Controls (RBAC).\
    • Multi-Factor Authentication (MFA) to secure all user credentials.
*   **Development Tools & AI Assistance:**\
    • ChatGPT (OpenAI’s GPT-4 model) and Claude AI (Anthropic’s Sonnet 3.5 model) for advanced code generation and assistance.\
    • Cursor for an AI-powered coding IDE, Deepseek for additional language model assistance, and Replit for online collaboration and coding.

## 6. Non-Functional Requirements

*   **Performance:**\
    • The app should load within a few seconds on both mobile and desktop devices.\
    • Dashboard updates will be batched at set intervals to balance load and responsiveness.
*   **Security:**\
    • All sensitive data must be encrypted both at rest and in transit.\
    • Regular security audits and vulnerability checks should be conducted to meet Brazil’s LGPD guidelines.
*   **Usability & Accessibility:**\
    • The user interface must be intuitive and comply with government design manuals, ensuring that both tech-savvy and less experienced users can navigate the system with ease.
*   **Compliance:**\
    • Must adhere to Brazil’s data protection regulations (LGPD) and relevant government design standards.

## 7. Constraints & Assumptions

*   The solution depends on the availability and stability of GPT-4 O1 and Claude AI models for code generation and assistance.
*   It is assumed that the SharePoint table will serve as the central data repository and is maintained accurately by managers.
*   Offline functionality is a nice-to-have but is not critical for the first version.
*   The design and branding must strictly follow existing government manuals, which may limit customization.
*   The batched update mechanism is assumed to be acceptable for the dashboard, considering that real-time updates are not essential.

## 8. Known Issues & Potential Pitfalls

*   **Integration with SharePoint:**\
    • The reliance on SharePoint as a data source could introduce complications if the API experiences rate limits or downtime.\
    • To mitigate, implement caching mechanisms and handle API errors gracefully.
*   **Security Challenges:**\
    • Handling sensitive government data means that any security vulnerability could be critical.\
    • Regular security audits and adherence to encryption standards should be enforced, plus a clear incident response plan must be in place.
*   **User Interface Consistency:**\
    • Strict adherence to government design manuals might restrict flexible design improvements.\
    • Develop a design prototype early on to ensure feasibility and seek early feedback from stakeholders.
*   **Batch Data Updates:**\
    • The decision to update dashboard data in batches may lead to slightly outdated information between update cycles.\
    • Clearly communicate the update intervals to all users and consider a short refresh frequency to balance performance and data timeliness.
*   **Role & Permissions Management:**\
    • Misconfigurations in RBAC could lead to unauthorized data access or editing.\
    • Incorporate thorough testing and regular monitoring of permission settings throughout development.

This document is intended to serve as the central source of truth for the entire project development. It provides clear, detailed guidelines that the AI model and subsequent technical documentation must follow to ensure there is no ambiguity in the design, implementation, or project objectives.
