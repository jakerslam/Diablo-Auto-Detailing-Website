# Software Requirements Specification (SRS)
## Project: Diablo Auto Detailing Landing Page
## Version: 1.0
## Date: April 8, 2026

## 1. Purpose
Create a high-converting single-page website for **Diablo Auto Detailing** (Walnut Creek, CA) that:
- Builds local trust and service credibility.
- Captures qualified leads for mobile auto detailing services.
- Presents service offerings and one-time / quarterly / monthly plans with visible price indicators.
- Requires every visitor requesting a price to submit a quote form (no direct purchase).
- Sends lead data to GoHighLevel via embedded external tracking script and form workflow.

## 1.1 Technology Stack (Approved)
- Frontend framework: SvelteKit
- Language: TypeScript
- Styling: Tailwind CSS
- Markup: Svelte component HTML-style templates
- Form/validation layer: TypeScript-driven form state with typed field model and validation
- Deployment target: Static-first preferred (can remain static if no auth/SSR requirement)
- Tracking: GHL external script included at site-level root

## 2. Business Context
- Business: Diablo Auto Detailing - Mobile Car Detailing
- Area focus: Walnut Creek and nearby cities.
- Brand goal: Position as fast, premium, reliable, and convenient mobile detailing.
- Conversion goal: Generate booking inquiries and recurring plan leads.

## 3. Stakeholders
- Owner/Manager (Primary)
- Marketing lead (optional)
- Web/Design contractor (Implementer)
- GoHighLevel operator (Forms + automation)

## 4. Core Service Definition
- Mobile full detail service scope (default baseline package):
  - 2-3 hours inside-and-out service
  - Carpet shampooing
  - Interior detailing
  - Hand wash
  - Full wheel cleaning
  - Complimentary ceramic wax protection
- This service package is the base model to describe in hero highlights and plan details unless owners approve variants.

## 4. Scope
### 4.1 In Scope
- Single responsive webpage with smooth section flow and sticky CTAs.
- Hero, services, service area, plans/pricing, process, gallery, reviews, FAQ, lead form, contact details, and footer.
- Social links in footer.
- GHL tracking script added in `<head>`.
- Quote request form with required fields and optional vehicle photo upload.

### 4.2 Out of Scope
- E-commerce checkout.
- Customer login/portal.
- On-site payment collection.
- Separate blog or CMS for dynamic content updates (outside this page).

## 5. User Personas
1. **Busy Professional**
   - Wants fast booking and clear pricing expectations.
2. **Family Vehicle Owner**
   - Needs reassurance, trust signals, and options for repeat cleaning plans.
3. **Fleet/Multiple-car Owner**
   - Wants efficiency, schedule coordination, and clear recurring service value.

## 6. User Goals
- Find trustworthy, mobile detailing service near Walnut Creek.
- Understand plans and service options quickly.
- Submit vehicle details and contact info to get a personalized quote.
- Contact business via phone/Instagram or form.

## 7. Target Audience & UX Principles
- Local, mobile-first customers searching from phones.
- CTA-first layout with repeated conversion opportunities.
- Trust-first sections (before/after, reviews, certifications, service area).
- Low-friction quote form with clear privacy reassurance.

## 8. Information Architecture
### Core Sections (in order)
1. Header / hero
2. Why choose us + trust indicators
3. Service cards
4. Plan section (One-Time, Quarterly, Monthly)
5. Pricing transparency + quote CTA
6. How it works
7. Gallery / work proof
8. Location + service area
9. Reviews/testimonials
10. FAQ
11. Quote request form
12. Footer with social links and contact

## 9. Functional Requirements
### 9.1 FR-01: Hero and Primary Conversion
- Display business name, short value proposition, service type, city mention, and primary CTA button (e.g., “Get Your Quote”).
- Include direct phone number with click-to-call.

### 9.2 FR-02: Service Detail Presentation
- List core services (interior, exterior, full detail, add-ons).
- Each service card should include estimated duration and best use case.
- Baseline service card must include the defined 2-3-hour full detail scope above.

### 9.3 FR-03: Plan Section Requirements
- Include exactly three plan types:
  - One-Time
  - Quarterly
  - Monthly
- Plan details must include:
  - “Starting at” pricing labels (or exact if provided).
  - Coverage/benefits per plan.
  - Renewal/frequency details.
  - All plan CTAs should route to quote form.
- Pricing is non-final and no direct booking checkout is allowed.
- Include in One-Time, Quarterly, Monthly plan behavior:
  - baseline full detail scope defined in Section 4 is included in all plans unless an internal plan matrix changes scope.
  - Quarterly/Monthly plans must define visit count, recurring cadence, preferred recurring discount/benefit language, and lead-in scheduling note.

### 9.4 FR-04: Required Quote Workflow
- Every pricing and availability inquiry must end at quote submission form.
- No direct “book now” path that bypasses the form.
- Offer scheduling preference field but do not finalize appointment without internal confirmation.

### 9.5 FR-05: Quote Form Requirements
- Required fields:
  - Name
  - Phone
  - Email
  - ZIP / City
  - Vehicle year/make/model
  - Service interest (one-time / quarterly / monthly)
  - Preferred date window
  - Service notes
- Add checkbox group for baseline options captured as explicit lead qualifier:
  - Carpet shampooing
  - Interior detailing
  - Hand wash
  - Full wheel cleaning
  - Complimentary ceramic wax

### 9.6 FR-06: Content Integrity and Service Accuracy
- Service text and plan descriptions must match the baseline service definition.
- If any offer variation exists (e.g., mini wash, exterior-only, add-on add-ons), it must be declared as a deviation from the baseline 2-3 hour package.
- Claims and pricing references in hero, pricing cards, FAQ, and social proofs should stay consistent with the baseline definition.
- Optional fields:
  - Vehicle photos upload
  - Referral source
  - Best time to contact
- Validation:
  - Phone in valid format
  - Email format checks
  - Required field enforcement
- Form success/error states with clear confirmation messaging.

### 9.6 FR-06: GHL Tracking and Lead Capture Integration
- Add script globally:
  ```html
  <script 
    src="https://link.msgsndr.com/js/external-tracking.js"
    data-tracking-id="tk_6b8e14ba48b440209f9eb1d4b6196105">
  </script>
  ```
- Map form submission to GoHighLevel form endpoint (or workflow) with fields and metadata.
- Include hidden attribution fields (UTM, source, campaign, page URL, timestamp).
- Track quote intent buttons as custom events if supported.

### 9.7 FR-07: Reviews and Proof
- Add testimonial carousel/cards and at least three reviews.
- Include location context and star rating summary.

### 9.8 FR-08: Contact and Footer
- Footer must contain:
  - Phone number
  - Service area cities
  - Email (if applicable)
  - Social links:
    - Instagram
    - Facebook
    - Google Business Profile / Maps
    - Optional: TikTok or Yelp (if available)
- Footer social links should use clear icon links and open in new tabs.
- Footer links to policy/privacy/terms if available.

### 9.9 FR-09: Accessibility and Responsiveness
- WCAG 2.1 AA baseline.
- Mobile-first responsive behavior at common breakpoints.
- Keyboard focus-visible styles for buttons and inputs.
- Sufficient color contrast for text and CTA buttons.

## 10. Non-Functional Requirements
- Load time: Primary page load under 3 seconds on 4G class networks.
- Core Web Vitals targets:
  - LCP < 2.5s
  - CLS < 0.1
  - INP acceptable on interaction
- No layout jumps from images (declare dimensions/size constraints).
- SEO basics: proper title, meta description, local keywords, canonical URL.
- Security: avoid exposing private API keys on frontend scripts.
- Compliance: include consent messaging if cookies/tracking forms collect data.

### 10.1 Frontend Architecture Requirements
- Use SvelteKit routes to keep page modular and maintainable.
- Use TypeScript for all non-style logic, especially form state, validation, mapping, and external payload typing.
- Use Tailwind CSS utility classes and theme variables for brand consistency and responsive behavior.
- Keep all sections as reusable Svelte components (hero, trust indicators, service cards, plans, process, reviews, gallery, FAQ, quote form, footer).
- Build mobile-first responsive breakpoints with no horizontal overflow.
- Include clear form and CTA component reusability with props-based section config objects.

### 10.2 Form and Tracking Integration Requirements
- Implement a single shared form schema type for validation and payload shape to GoHighLevel.
- Ensure form submission logic is adapter-friendly and can be switched to API/proxy endpoint later without refactor.
- Add GHL script once at app shell level and reference custom event calls from quote CTA and form submit events.

## 11. Content and Copy Requirements
- Tone: premium, confident, local, and direct.
- Avoid overly technical jargon.
- CTA language should emphasize convenience and convenience-first service.
- Price section should use “Starting at” messaging and “Request a quote” CTA to reinforce custom pricing.

## 12. Visual and UI Requirements
- Distinctive, bold look aligned to auto-detailing premium style.
- Use readable high-contrast theme and branded accent color.
- Add subtle gradients/background texture.
- Optional subtle animations:
  - Section fade-in on scroll
  - Staggered card reveal
  - CTA pulse on initial viewport for emphasis

## 13. Analytics & Tracking Requirements
- Track at least:
  - Form submission success
  - Form abandonment (if possible)
  - CTA clicks (hero + plan cards + sticky button)
  - Phone click action
- Set source attribution using URL parameters.

## 14. Dependencies
- Correct social profile URLs provided by owner.
- High-quality before/after images for gallery.
- Reviews and testimonials text/permissions.
- GHL form endpoint and webhook map confirmed before release.

## 15. Risks and Mitigations
- Missing social handles: use placeholders and hide until verified.
- Incomplete review rights: use testimonials with signed permission.
- Incorrect lead mapping in GHL: stage a staging test lead first.

## 16. Acceptance Criteria
- All sections render correctly on mobile and desktop.
- At least one quote form path completes end-to-end.
- Plan CTAs never lead to checkout and always route to quote form.
- GHL tracking script is loaded and confirmed in browser devtools network.
- Footer contains working social links.

## 17. Milestones
1. Information capture approval (copy + plan names + prices)
2. SRS review with owner
3. Wireframe approval
4. Build and first staging
5. GHL integration QA
6. Final launch

## 18. Open Items
- Confirm exact social links:
  - Instagram URL
  - Facebook URL
  - Google profile URL
- Confirm recurring-plan pricing logic and constraints.
- Confirm lead destination field names in GHL.

## 19. Competitive Pattern Model (Sample Implementations)
Use these reference patterns as copyable requirements for the landing page.

- 1) BrushHour (Chicago, IL) - https://www.brushhour.co/chicago.html
  - Uses high-frequency CTA pattern: sticky scheduling links repeated at hero and repeat sections.
  - Shows a base one-time option and membership-level recurring options in one clear family model.
  - Publishes explicit service coverage by city/borough and includes FAQ section for scheduling, cancellation, and weather contingencies.
  - Includes social proof blocks with named review snippets and photos.
  - Includes social links in header/footer and trust sections tied to corporate/press references.

- 2) Blackline Detailing (Austin, TX) - https://blackline-detailing.com/
  - Pattern: high-intent location landing page, clear offer blocks, and service pages tied to expected outcomes.
  - Include process messaging that explains duration, prep steps, and what is included.
  - Add review/social proof as a conversion assist in the middle of the page.
  - Use service inquiry forms that request vehicle details to prevent generic lead responses.

- 3) 5Boro Auto Detailing (New York City) - https://www.5boroautodetailing.com/mobile-detailing
  - Strong conversion pattern: full quote form appears on landing content with vehicle/year/make/model, service selection, addons, and borough choice.
  - Very explicit service-area coverage across NYC boroughs with location selector to reduce request ambiguity.
  - Offers recurring maintenance mindset through package framing even while keeping quote flow intact.
  - Transparent tiered "starting at" pricing for vehicle sizes and visible bundle examples.

- 4) Glow Up Details (Miami, FL) - https://glowupcardetailing.com/
  - Uses service-specific pages with location-context content and clear “Learn More and Book” action per service.
  - Includes climate-specific educational section explaining why details matter locally (trust + SEO signal).
  - FAQ block answers mobile-detail practical objections (setup, environment, scheduling).
  - Uses Google-sourced trust snippets in reviews to reinforce local credibility.

- 5) ZS Clean San Diego (San Diego, CA) - https://www.zscleansandiego.com/
  - Uses service-area map + city pages for local SEO and conversion clarity.
  - Uses both booking and quote routes in top-level navigation to support different user intents.
  - Includes resource/blog page for trust-building and SEO depth without cluttering the core funnel.
  - Clear logistics copy: fully equipped, no user setup burden, service process and guarantees.
  - Includes explicit newsletter and privacy policy flow to support future retargeting and permission-based nurture.

Common Practices to Copy Into Diablo SRS
- Keep a clear quote-first conversion path at every pricing touchpoint.
- Show one-time and recurring options with names and cadence labels; add "starting at" pricing where useful.
- Add a hero with immediate action button and location-specific subheadline.
- Include a short process timeline so users understand what happens before and after booking.
- Add a gallery/portfolio section with before-after evidence.
- Add a social proof block with recent, named testimonials and rating snapshots.
- Add a robust FAQ for top objections: water/power needs, what to expect, cancellation policy, visit-time, and travel radius.
- Build a logistics section explaining mobile setup, what customer should prepare, and what is included.
- Add service-area copy that can support local SEO pages.
- Add footer social links and operational details (phone, service areas, hours) in one place.
- Add a form that includes: name, phone, email, ZIP/city, vehicle details, vehicle condition, selected plan, preferred timing, add-ons, notes, and media upload.
- Track quote interactions as measurable CTA events (hero quote, service card quote, sticky quote, nav quote).

Additional Ideas to Consider
- Add a lightweight price-estimator form that pre-fills vehicle size + package to increase qualification.
- Add a “What to expect on arrival” card deck (arrival window, team arrives with all supplies, typical duration).
- Add a visible trust bar with licenses, insurance, business hours, and response-time promise.
- Add a “Before/After by service type” gallery filter (interior, exterior, paint correction).
- Add seasonal care tips in a small resource section to improve repeat SEO and lead retention.

## 20. Sales Script and Operational Intelligence (From Provided Script)
### 20.1 Sales Script Content to Reuse on Site
- Opening and qualification language should mirror this tone:
  - Confirm lead, acknowledge request, and ask for car model immediately.
  - Position mobile detail as a complete interior and exterior service.
- Interior service messaging:
  - Carpet shampooing when carpet mats are present.
  - Rubber mats scrubbed by hand.
  - Interior surfaces including seats, doors, center console, and door jambs.
  - Full interior vacuum and glass cleaning as standard sequence.
- Exterior service messaging:
  - Hand wash plus full wheel cleaning.
  - Wash and wax included.
  - Ceramic wax messaging: protects against water spots, dirt, dust, and keeps vehicle cleaner longer between services.

### 20.2 Plan Pricing and Discount Logic to Reflect in Messaging/Calculators
- Baseline recommended and floor prices:
  - One-Time: recommended $275, floor $225.
  - Biannual: recommended $250 ($25 off), floor $195.
  - Quarterly: recommended $225 ($50 off), floor $175.
  - Monthly: recommended $175 ($100 off), floor $150.
  - Biweekly: recommended $150 ($125 off), floor $135.
- Location surcharge logic:
  - +$25 outside normal service range.
- SRS requirement: quote/checkout pages and scripts should show offer messaging as “starting from” values, not fixed final price.

### 20.3 Service Territories to Include
- Danville
- Alamo
- Walnut Creek
- Moraga
- Lafayette
- Orinda
- San Ramon
- Dublin
- Pleasanton
- Livermore
- Castro Valley
- Hayward
- Diablo / Blackhawk
- SRS requirement: service area should be shown clearly and can be shown as city list + “service by appointment.”

### 20.4 Recurring Sales and Trust Language
- Recurring offer terms to include:
  - Monthly: typically $100 off baseline, resulting example $175 for quoted model.
  - Quarterly: typically $50 off baseline, resulting example $225 for quoted model.
  - Biannual: typically $25 off baseline, resulting example $250 for quoted model.
  - Biweekly: baseline from your notes $125 off, resulting $150.
- Trust/differentiation language:
  - 100% clean car guarantee with free exterior wash re-clean if dirty between visits.
  - Complimentary ceramic wax included in scope.
- Trial and cancellation framing to include for recurring plans:
  - Six/twelve month trial start with clear expectation.
  - If terminating early, return only the original first-discount amount ($50 or $100 based on plan) as a practical rollback/settlement term.

### 20.5 Conversion Flow and Compliance Inputs
- Call-handling flow extraction:
  - Confirm car model.
  - Confirm familiarity with mobile detailing and waxing.
  - Explain scope, pricing adjustment by plan, and schedule intent before contract step.
- Contract/onboarding flow terms:
  - Contract scope must match selected plan and vehicle model.
  - Use clear “scope of services” at top of contract.
  - Send confirmation text plus onboarding text after contract acceptance.
- Closing / onboarding copy templates for recurring plans to align SMS and web follow-up automation:
  - Ask for confirmation to send confirmation and payment steps.
  - For recurring, send reminder cadence text (5 days before).
  - Set recurring cadence to 4/12 week windows as selected by customer.

### 20.6 Scheduling Rules (Operations)
- Primary scheduling constraints:
  - Website estimate: 2-3 hours.
  - Visit window for first vehicle: 3 hours.
  - Additional vehicles: 2.5 hours each.
  - 30-minute gap between jobs.
  - 60-minute lunch break mid-day.
  - Operating hours: Mon-Sat 8:00 AM–6:30 PM.
- Route timing requirement:
  - Appointment windows should remain within 30 minutes of expected technician travel proximity to city.
  - If weekday weekend-only customer and weekends blocked, escalate to Andres for Sunday feasibility.
- SRS requirement:
  - Display realistic arrival/slot messaging and avoid impossible lead capture slots on unavailable windows.
