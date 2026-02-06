# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

One-page personal portfolio website for Yan Liu, a UX/Product Designer. The site showcases design work and demonstrates vibe-coding capabilities through the experience itself.

## Tech Stack

- HTML, CSS, vanilla JavaScript (no frameworks, no build tools)
- SVG for hand-drawn decorative elements
- Intersection Observer API for scroll-triggered animations
- CSS custom properties for theming

## Running Locally

Open `index.html` directly in a browser, or use a local server:
```bash
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## Design Principles

- **No emojis** anywhere in the codebase or UI
- **Minimal and clean**: generous white space, typography-driven, every element earns its place
- **Hand-doodle elements used sparingly**: 2-3 moments maximum, never cluttered
- **Progressive delight**: calm at top, gradually more interactive as user scrolls
- **Scroll-driven narrative**: interactions feel discovered, not announced
- **The site itself is a portfolio piece**: demonstrates technical capability through craft and polish

## Visual Direction

- Light background (#FAFAFA or similar off-white)
- Dark charcoal text (#1a1a1a)
- Motion is smooth and purposeful, never busy
- Hand-drawn SVG strokes should feel imperfect/organic

## Structure

1. **Hero** - Name, role, calm animated entrance
2. **About** - Brief intro with subtle scroll animation
3. **Projects** - Placeholder cards with refined interactions
4. **Footer** - Social links (X, LinkedIn, Instagram, Figma)

## Interaction Hierarchy

- Top 25%: Pure stillness, fade-ins only
- Middle 50%: Hand-drawn SVG animations, gentle parallax, hover states
- Bottom 25%: Unexpected interactive moment (the "impressive" beat)
