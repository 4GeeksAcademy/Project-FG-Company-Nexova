# Nexova Solutions Public Website

## Overview
This project is the public-facing website for Nexova Solutions and represents the first digital-presence milestone for the selected company.

It includes:
- A public landing page for company information and services.
- A separate business inquiry form page.
- Client-side validation and accessibility behaviors without backend integration.

## Company Summary (from CONTEXT.md)
Nexova Solutions is an HR consulting and talent acquisition company:
- Founded in 2011.
- Operations in Chile and Argentina.
- Core services:
  - Executive search.
  - Outsourced customer support teams.
  - Corporate training.

## Implemented Pages
- uis/website/index.html
- uis/website/application.html

## Main Features
- Responsive mobile-first design.
- Tailwind CSS loaded via CDN.
- Semantic HTML structure.
- Accessible navigation and form structure.
- SEO metadata.
- Schema.org Organization JSON-LD in the landing page.
- Complete client-side form validation.
- Local-date validation for the start date.
- Character counter for project details.
- Accessible error and success states.
- Simulated submission flow without a backend.

## Form Fields
The inquiry form includes:
- Full name
- Work email
- Phone
- Company
- Country
- Employee count
- Service interest
- Estimated start date
- Project details
- Preferred contact method
- Privacy consent

## Project Structure
Relevant files in this repository:

- CONTEXT.md
- README.md
- uis/README.md
- uis/website/index.html
- uis/website/application.html
- uis/website/validation.js
- uis/website/README.md

## Run Locally
From the repository root, run:

```bash
npx --yes http-server uis/website -p 3000 -a 0.0.0.0
```

## Local URLs
- http://127.0.0.1:3000/index.html
- http://127.0.0.1:3000/application.html

## Validation Behavior
The form validation is implemented in uis/website/validation.js and provides:
- Validation on blur for text-based controls.
- Re-validation on input after interaction (touched state).
- Validation on change for select, radio, and checkbox controls.
- Focus movement to the first invalid control after invalid submission.
- Spanish error messages for all invalid states.
- Dynamic application and removal of aria-invalid.
- Simulated successful submission state.
- No data transmission or persistence.

## Accessibility
Accessibility implementation includes:
- Semantic landmarks and structure.
- Skip links.
- Visible labels associated with controls.
- Fieldset and legend for radio groups.
- Native keyboard support for controls.
- Visible focus states.
- aria-describedby relationships for helper and error text.
- Global polite status region for submission-level messages.
- Text-based error messages that do not rely only on color.

## SEO
The website includes:
- Meta title and description.
- Open Graph metadata (title, description, type).
- robots metadata.
- Schema.org Organization JSON-LD in the landing page.

## Testing Performed
The implementation was reviewed with:
- Responsive checks at 375px, 768px, and 1440px.
- Empty submission behavior.
- Field boundary validations.
- Local-date validation checks.
- Keyboard control behavior.
- Reset behavior.
- Successful simulated submission.
- Browser console review.

## Current Limitations
- No backend integration.
- No database.
- No real form submission.
- Tailwind CDN is used for this educational milestone.

## Technologies
- HTML5
- Tailwind CSS
- Vanilla JavaScript
