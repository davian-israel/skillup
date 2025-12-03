1. Introduction
The SkillFundr Software Requirements Specification (SRS) provides a detailed and
structured overview of the system requirements for the SkillFundr web . This document
defines the purpose, scope, functionalities, constraints, and performance requirements
needed to guide developers, stakeholders, and project contributors.
SkillFundr is a digital marketplace that connects financially constrained students with
NGOs, startups, and small businesses needing skilled services. Students complete
tasks in exchange for tuition support, stipends, or scholarship contributions.
1.1 Purpose
The purpose of this SRS is to capture all system requirements for designing,
developing, and deploying the SkillFundr platform. It defines the expected features from
the perspective of users, partners, and administrators. This specification ensures a clear
and consistent understanding of system goals, constraints, and technical expectations.
1.2 Scope
The SkillFundr system will:
 Enable students to showcase skills, apply for tasks, and receive verified tuition or
scholarship payments.
 Allow NGOs/startups to post tasks, fund them through escrow, and approve
completed work.
 Provide a secure system for managing scholarship payments, ratings,
verification, and profiles.

 Optionally integrate universities for work verification and student support tracking.

2. Specific Requirements
2.1 Functionality
2.1.1 Student Profile &amp; Skill Management
 The system shall allow students to create and manage profiles.
 The system shall allow students to upload skills, portfolios, and experience.
 The system shall allow students to update personal and academic information.
2.1.2 Task Marketplace
 The system shall display available tasks posted by NGOs/startups.
 The system shall allow students to search, filter, and apply for tasks.
 The system shall show task requirements, compensation, deadlines, and skill
needs.
2.1.3 NGO/Startup Task Posting &amp; Management
 The system shall allow NGOs to create accounts.
 The system shall enable NGOs to post tasks with detailed descriptions.
 The system shall allow NGOs to fund tasks through the escrow system.
 The system shall allow NGOs to approve or reject student submissions.
2.1.4 Escrow &amp; Scholarship Disbursement System
 The system shall hold funds in escrow once a task is posted.
 The system shall release funds only upon task approval.
 The system shall transfer funds to designated school or scholarship accounts.
2.1.5 Notifications
 The system shall notify users of task applications, approvals, rejections, and
payment status.
 The system shall send email confirmations for major actions.
2.1.6 Ratings &amp; Reviews
 The system shall allow NGOs to rate students after task completion.

 The system shall allow students to rate NGOs.
2.1.7 Customer Support
 The system shall provide FAQs, help pages, and support channels.
 The system shall provide automated assistance for common technical issues.

2.2 Usability
2.2.1 Graphical User Interface
 The system shall have a clean, modern interface optimized for both mobile and
desktop users.
 The system shall provide visual consistency across all pages.
2.2.2 Accessibility
 The system shall provide readable fonts, color contrast, and support for screen
readers.
 The system shall provide multilingual support (English + major Ghanaian
languages in future expansions).

2.3 Reliability &amp; Availability
 The system shall maintain 99% uptime.
 The system shall store data on redundant cloud servers.
 The system shall create daily automated backups.

2.4 Performance
 The system shall load main pages within 3 seconds on a standard internet
connection.
 The system shall support up to 10,000 concurrent users during peak periods.

2.5 Security
2.5.1 Data Transfer

 The system shall use HTTPS for all transactions.
 The system shall encrypt all sensitive communications.
2.5.2 Data Storage
 The system shall store passwords using salted hashing.
 The system shall encrypt scholarship and financial data.
 The system shall restrict admin access to authorized personnel.

2.6 Supportability
 The system shall maintain all source code in a version control system.
 The system shall support continuous integration and updates.

2.7 Design Constraints
 The system must be web-based and mobile-responsive.
 Development tools must align with industry standards.
 Must comply with Ghana Data Protection Act.

2.8 Online User Documentation
 The system shall include help articles, guides, and support links.

2.9 Purchased Components
 Use of third-party payment gateway.
 Use of cloud-based database.

2.10 Interfaces
2.10.1 User Interfaces
 Web and mobile views must support all modern browsers.
2.10.2 Hardware Interfaces

 Standard internet-enabled devices.
2.10.3 Software Interfaces
 Integration with external payment gateways.
 Integration with school payment portals.
2.10.4 Communication Interfaces
 Uses HTTPS and REST APIs.

2.11 Licensing Requirements
 Not applicable.
2.12 Legal &amp; Other Notices
 Must include copyright and terms of service.
2.13 Applicable Standards
 Follows IEEE SRS structure.
 Complies with global data privacy best practices.