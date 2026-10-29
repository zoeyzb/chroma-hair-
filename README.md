# Chroma Hair Atelier

A responsive, editorial-style single-page salon website for Chroma Hair Atelier.

## Run locally

Serve the project root over HTTP so the portrait asset and browser APIs load consistently:

    python3 -m http.server 4173

Then open http://localhost:4173.

## Included

- Portrait-led hero with a visible trust strip
- Responsive navigation with keyboard support
- Scrollable service cards with previous/next controls
- Editorial, image-led section explaining the salon's approach
- Salon philosophy and three-step visit overview
- Appointment request builder with service/date/time preferences and copyable request text
- Reduced-motion support and responsive mobile layouts

## Booking integration

The booking UI prepares a request locally and lets the visitor copy it. It does not reserve a real slot or send customer information to the salon. Connect a real booking provider or a salon-owned endpoint before treating requests as confirmed appointments.

The page uses the local portrait asset and Google Fonts. The core layout and booking interactions do not depend on Three.js or GSAP.
