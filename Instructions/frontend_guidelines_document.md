# Updated Frontend Guidelines Document

## Introduction

This document explains the setup and guidelines for the frontend of our digital dashboard and data input application. The app is part of Brazil's Estratégia Federal de Governo Digital (EFGD) and is aimed at civil servants involved in the execution of digital government initiatives. Its goal is to simplify data entry, keep track of progress, and display key performance metrics that allow government decision makers to monitor the evolution of digital initiatives. By following these guidelines, every team member can understand the frontend's role in making the system secure, consistent, and easy to use on both mobile devices and desktops.

## Frontend Architecture

Our frontend is built with React, a popular library that enables the creation of a dynamic and responsive user interface. Using React makes the application scalable and maintainable over time because it encourages a component-based structure. The application also leverages libraries and integration points that work smoothly with the backend services powered by Node.js and Express, as well as integration with external systems like SharePoint. This setup ensures that the system can adapt to future requirements, maintains good performance levels, and supports regular updates without causing disruptions to the end user.

## Design Principles

The design of our frontend is guided by three essential principles: usability, accessibility, and responsiveness. We follow government-specified design manuals to ensure that every element in the app—whether it is a button or a data display area—matches governmental brand standards and layout preferences. The interfaces are simple and straightforward so that both highly technical and less experienced users can easily navigate the system. Accessibility means that the app considers users with different needs and devices, while responsiveness makes sure that it looks and works great on both mobile devices and desktop computers.

## Visual Identity Guidelines

### Typography

The Verdana font must be used throughout the application for all text elements, as specified in the Brazilian government's visual identity manual. This font was chosen for its legibility, clarity, and wide technical compatibility. Font sizes should follow these guidelines:
- Main titles: Verdana 44pt (Bold)
- Section headings: Verdana 26pt
- Regular text: Verdana 14pt
- Small text/footnotes: Verdana 8pt-12pt
- Data visualization labels: Verdana 16pt

### Color Scheme

The color palette must adhere to the government's official colors:

**Primary Colors:**
- Yellow: #FFD000
- Blue: #183EFF
- Green: #00D000
- Red: #FF0000

**Base Colors for UI Elements:**
- Black (#000000): For main text
- Dark Gray (#585C5D): For subtitles and headers
- Medium Gray (#999999): For labels and secondary text
- Light Gray (#e7e7e7): For card backgrounds
- White (#FFFFFF): For page backgrounds

**Dashboard Backgrounds:**
Six background pattern options are available as specified in the visual identity manual:
1. Gray gradient pattern
2. Blue gradient pattern (recommended for most dashboards)
3. Gray dotted pattern
4. Dark blue pattern
5. Yellow pattern
6. Green pattern

### Layout Standards

All dashboard pages should use a 1280×720 (16:9) aspect ratio for optimal display on standard screens and projectors. This ensures consistency across different viewing environments.

## Component Structure

The frontend is organized in a component-based manner that makes it easy to develop, test, and maintain. Each part of the interface, from forms to dashboards, is built as a standalone component that can be reused across the system. Using React ensures that components are easily composable and modular. This approach simplifies code management and enhances maintainability, as changes in one component have minimal impact on others. It also makes the system scalable, as new features can be added or modified without overhauling the existing codebase.

### Dashboard Components

The following components should be used consistently across all dashboards:

1. **Header Area:**
   - Must include the dashboard title in Verdana 43pt
   - Date/time of last update in the top right corner
   - Filter inputs with gray background (#999999)

2. **Cards:**
   - Use white background with subtle rounded corners
   - Keep consistent padding within cards
   - Use shadows sparingly to create hierarchy

3. **Indicators and KPIs:**
   - Prominently display important numbers in Verdana 100pt
   - Include descriptive labels in Verdana 26pt
   - Use consistent units and formatting for numbers

4. **Footer:**
   - Include the ministry logo in the bottom right corner
   - Technical team information in the bottom left
   - Management team information center-left

## Data Visualization Guidelines

The following visualization types are recommended for different data scenarios:

1. **Cards:** 
   - Use for single important metrics
   - Keep clean and minimal
   - Use gray tones for a professional appearance

2. **Area Charts:**
   - For time series data showing volume changes
   - Use blue color scheme variations

3. **Line Charts:**
   - For continuous data and trends over time
   - Best for representing changes over days, months, or years

4. **Bar Charts:**
   - Use for comparing totals between categories
   - Use vertical orientation for fewer categories
   - Use horizontal orientation for many categories or long names

5. **Stacked Columns:**
   - For showing parts of a whole across categories
   - Limit to 5-6 segments for readability

6. **Pie/Donut Charts:**
   - Only for proportions between categories
   - Limit to 2-3 categories maximum
   - Always include percentages

7. **Tables:**
   - For detailed data that users need to read precisely
   - Use alternating row colors (white and light gray)
   - Keep design simple to focus on the data

### Color Usage in Visualizations

- Use blue tones for primary metrics and neutral information
- Use red for negative indicators, errors, or alerts
- Use green for positive status, success indicators, or growth
- Use yellow for warnings or items needing attention
- Always maintain sufficient contrast for readability

## State Management

For managing data across the app, we use patterns like the Context API or other libraries where necessary, such as Redux. This helps make sure that data such as user login status, initiative progress updates, and notification messages are handled in a controlled manner. The chosen approach manages state across multiple components seamlessly, ensuring that each part of the application updates appropriately when new data arrives or when actions are taken. This not only makes the user experience smoother but also keeps the interface in sync with the backend SharePoint data and other integrated systems.

## Routing and Navigation

Navigation within the application is managed using popular routing libraries tailored to our chosen framework. In our React application, we use React Router to handle multiple views such as the login screen, initiative selection page, data entry forms, and dashboard view. The routing system is designed to provide a smooth transition between pages with clear URLs and state persistence. This ensures that civil servants can easily follow their workflow, from securely logging in to submitting updates and reviewing them on the monitoring dashboard.

## Performance Optimization

To keep our frontend fast and responsive, several optimization techniques are in place. Strategies like lazy loading and code splitting ensure that only the necessary code is loaded at startup, reducing initial load times. Asset optimization, including image compression and minification of CSS and JavaScript files, further improves performance. Additionally, because the dashboard data is updated in batches rather than in real time, the system can balance resource usage with a reliable display of metrics. These optimizations all contribute to a smoother user experience and efficient operation even during peak usage times.

## Testing and Quality Assurance

Quality assurance is essential for this project. The frontend undergoes thorough testing, including unit, integration, and end-to-end tests. With these tests, we ensure that every component works as expected and that the user interface remains consistent with government design and security standards. Tools and frameworks such as Jest for unit testing and Cypress for end-to-end testing come into play here. Regular testing not only ensures that the codebase is robust but also mitigates any issues before they affect the end user.

## Additional Resources

For more detailed guidance on implementing the government's visual identity, team members should consult:

1. Brazilian Government Design System:
   - https://www.gov.br/ds/home

2. UI Kit (Figma):
   - https://www.figma.com/file/Glyb4WRiXyxZEepdUGTCHF/UI-Kit-(Governo-Federal)

3. Icon Resources:
   - Flaticon: https://www.flaticon.com/authors/detailed-rounded/lineal
   - Rawpixel: https://www.rawpixel.com/search/icons

## Conclusion and Overall Frontend Summary

In summary, the frontend of our application is built with modern tools and a clear set of guidelines to deliver a secure, reliable, and user-friendly experience. The use of React helps us achieve a component-based structure that is both scalable and maintainable, while careful attention to design, state management, routing, and performance ensures that the application remains efficient. The process of entering data, monitoring progress via the dashboard, and managing user roles and permissions all adhere strictly to government design manuals, ensuring consistency and trust. This comprehensive approach makes the frontend not only a vital component of the application but also a standout example of how careful planning and execution can transform complex requirements into a smooth, everyday digital experience that aligns with Brazil's digital government initiative.