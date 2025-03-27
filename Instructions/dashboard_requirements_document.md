# Best Practices Manual for Visual Identity - Power BI Dashboards

## Table of Contents
- [Introduction](#introduction)
- [Pillars for Creating an Effective Dashboard](#pillars-for-creating-an-effective-dashboard)
- [Technical Information and Logos](#technical-information-and-logos)
- [Colors and General Specifications](#colors-and-general-specifications)
- [Cover Page Specifications](#cover-page-specifications)
- [Visualization Models and Patterns](#visualization-models-and-patterns)
- [Final Considerations](#final-considerations)
- [Additional Information](#additional-information)

## Introduction

This manual presents guidelines for creating standardized Power BI dashboards for use by the agencies that make up ColaboraGov, the Shared Services Center of the Ministry of Management and Innovation in Public Services.

The following sections establish guidelines for the application of logos, fonts, colors, and configurations, aiming to enhance the harmony and visual clarity of the dashboards.

The objective of this material is to ensure that dashboards present data clearly and attractively, providing the best possible experience in visualizing strategic information.

It is recommended to adopt the proposed standards in dashboards developed by the ministries that are members of ColaboraGov, whenever applicable.

## Pillars for Creating an Effective Dashboard

### 1. Definition of Objectives
- Understand the purpose and objectives of the dashboard.
- Identify the business needs and problems that the dashboard should address.
- Define leaders from business areas for effective collaboration in dashboard development.

### 2. Data Collection and Preparation
- Acquire relevant and reliable data.
- Perform extraction, cleaning, and transformation (ETL) of data as needed.
- Enrich the data, if possible, to provide additional insights.
- Promote collaboration between business areas and data specialists.

### 3. Analysis and Modeling
- Conduct an exploratory analysis of the data to identify trends and patterns.
- Model the data effectively to support the dashboard's objectives.
- Create relevant metrics and inferences for decision-making.
- Promote collaboration between business areas, data architects, and BI analysts.

### 4. Development and Production
- Build the final products, including reports and dashboards.
- Establish a data pipeline or ETL with automatic information updates.
- Implement continuous improvement processes (PDCA) to enhance the dashboard over time.
- Establish joint responsibility between business areas and the data team.

## Technical Information and Logos

### Federal Government Visual Identity
We emphasize the importance of adhering to the Federal Government's visual identity when creating Power BI dashboards.

For this material, we used the guidelines from the Federal Government Brand Usage Manual – Version 1.1 as a reference, ensuring that the Federal Government brand is accurately represented.

Maintaining this consistency is essential to ensure credibility and uniformity in all presentations.

Although these guidelines are recommended, we understand that participating ministries may make necessary adaptations to meet their specific realities, as long as they remain aligned with the general visual identity.

[Federal Government Brand Usage Manual](https://www.gov.br/ds/home)

### Signatures
They are used in a more formal and documentary setting.

In dashboards developed by participating agencies of ColaboraGov, the official signatures of each agency should be used.

**Main signature** (most used)  
**Box signature** (used on colored backgrounds or images)

### Typography
The recommended font for dashboards is **Verdana**, chosen for its readability, clarity, and broad technical compatibility, ensuring visual uniformity and accessibility across different platforms.

Its adoption ensures a consistent visual identity and reinforces the credibility and efficiency in communicating government information.

## Colors and General Specifications

### Colors
Below, we present the available colors to support the creation of dashboards for ColaboraGov agencies.

These colors are aligned with the guidelines established in the Federal Government Brand Usage Manual.

- **Yellow**: #FFD000
- **Green**: #00D000
- **Blue**: #183EFF
- **Red**: #FF0000

### Base Colors
To support the construction of digital products, a palette with base colors is proposed:

- **50**: #f6f6f6
- **100**: #e7e7e7
- **200**: #d1d1d1
- **300**: #b0b0b0
- **400**: #888888
- **500**: #6d6d6d
- **600**: #5d5d5d
- **700**: #4f4f4f
- **800**: #454545
- **900**: #3d3d3d
- **950**: #000000

With the base colors, it is recommended to use:
- **Black**: texts and paragraphs in general.
- **Dark gray**: subtitles, labels, and legends.
- **Light gray**: background color for content cards and other elements (so they stand out against the standard white background).
- **White**: general page background.

### Color Palette
The proposed color palette offers shades of blue, red, green, and yellow for different elements, creating clear visual hierarchies and maintaining product consistency.

- **Blue**: Soft tones for highlight elements and backgrounds (lighter tones), and darker tones for buttons, icons, or calls to action that require more attention.
- **Red**: Ideal for indicating important actions, such as errors or warnings, with lighter tones being used in subtle alerts and darker ones for greater emphasis.
- **Green**: Can be applied to indicate success or positive states, with light tones used in backgrounds or soft borders and darker ones for buttons or highlights.
- **Yellow**: Recommended for drawing attention, used for warnings or important indicators, with darker tones for strong highlights.

### Page Size
- **Width**: 1280px
- **Height**: 720px
- **Ratio**: 16:9

## Cover Page Specifications

### Title and Cover Colors
- Titles and other texts should follow the Verdana font.
- We suggest using bold for emphasis when necessary.
- The cover background color should be the blue tone (pattern 2) to create a neutral background, useful when displaying multiple logos to avoid chromatic interference.
- Buttons adopt a gray tone to highlight interactive elements.

### Cover Elements
- **Main title**: Bold, Verdana font, 44pt
- **Captions**: Regular, Verdana font, 16pt
- **Positioning**:
  - The Department responsible for Technical Management should be in the lower left corner
  - The Secretary responsible for Business Management immediately after
  - Ministry signature in the lower right side

## Visualization Models and Patterns

### Icons
The incorporation of icons is fundamental to enhance the user experience, making the dashboard more interactive and facilitating the understanding of the information presented.

We present below two online resources where a variety of icons can be found to visually enrich the dashboards:
- [Flaticon](https://www.flaticon.com/authors/detailed-rounded/lineal)
- [Rawpixel](https://www.rawpixel.com/search/icons?page=1&sort=curated&topic_group=_topics)

### Visual Pattern for Dashboards
Various information is displayed on dashboards. These tools track a variety of numbers according to the needs of each business.

They can be configured to present any type of data that is useful for managers.

To ensure unity and standardization of dashboards, here are some suggestions for templates, pantones, styles, and elements to be used, according to the Power BI business tool.

### Visualization Types

#### Card
It's a great way to communicate and highlight important data. When positioned in the upper area of the screen, they gain prominence. Use more sober gray tones for a more solid and professional effect.

#### Area Chart
Offers the ability to visualize numbers of significantly different magnitudes. Customize it in the report display mode using the government standard colors mentioned above.

#### Line Chart
Most frequently used for continuous data records. The connection of points through the line indicates the connection between them. In general, they are used to represent a unit of time, such as days, months, or years.

#### Table
The table design should assume a secondary role, since the data is the central element. Use a simple layout that allows the data to be easily highlighted. Also, alternate background colors between white and gray for clearer and more pleasant reading.

#### Stacked Bar Chart
They allow the comparison of totals between categories, as in common bar charts, but also allow visualizing the parts that make up a particular category.

#### Pie or Sector Chart
Pie or sector charts are useful for visually highlighting the proportion between categories. Use them to emphasize differences or relationships clearly and concisely. Should be used in situations with up to two categories.

#### Stacked Column Chart
They allow the comparison of totals between categories, similar to conventional bar charts. Additionally, they enable the visualization of the parts that make up a specific category.

## Final Considerations

1. The color palette can be softened according to the colors listed above to improve visual impact.

2. Third-party plugins, such as pureviz, should not be used to maintain the integrity and security of the dashboards.

3. Depending on the application context, for example, constant display of dashboards on a monitor/screen, the background can be adapted to dark mode.

4. This is not a final document; it can be adjusted and improved based on feedback from those involved in building the dashboard.

## Additional Information

### Design System – Federal Government Digital Standard
To support the construction of digital products between designers and developers, the Federal Government provides a complete design system.

In it, you can find documentation in descriptive, visual format and also in code related to components and patterns already used.

**Federal Government Digital Standard**

As the Official Government Design System, the Design System serves a wide range of designers and developers who create digital products and experiences.

[https://www.gov.br/ds/home](https://www.gov.br/ds/home)

### UI Kit
To better exemplify the use and construction of digital products, the UI Kit available in Figma details how the main components should be reproduced, such as: buttons, labels, inputs, lists, and menus.

**UI KIT (Federal Government)**

[https://www.figma.com/file/Glyb4WRiXyxZEepdUGTCHF/UI-Kit-(Governo-Federal)?type=design&mode=design](https://www.figma.com/file/Glyb4WRiXyxZEepdUGTCHF/UI-Kit-(Governo-Federal)?type=design&mode=design)

It is recommended to use these resources whenever possible, allowing flexibility as necessary to meet the specific operations and needs of each institution.

---

**Prepared by:**  
Ministry of Management and Innovation in Public Services – MGI  
Shared Services Secretariat – SSC  
Information Technology Directorate - DTI  
General Coordination of Digital Transformation in Shared Services - CGTDS