# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Purpose

This is a Next.js 15 cache behavior verification application. The primary goal is to validate whether `fetch` with `next.tags` option works as documented, specifically testing if cache tags function without explicit `cache: 'force-cache'` setting.

## Essential Commands

```bash
# Development (with Turbopack)
npm run dev

# Production build and test (CRITICAL for cache verification)
npm run build && npm run start

# Code quality
npm run lint
npm run format

# Clean cache verification
rm -rf .next && npm run build && npm run start
```

**Important**: Cache verification MUST be done in production mode. Development mode (`npm run dev`) uses HMR cache which interferes with cache testing.

## Architecture Overview

### Verification Cases Structure
The application tests 5 different cache scenarios:
1. **Case 1**: Tags only (`next: { tags: ['time'] }`)
2. **Case 2**: Force cache + tags (`cache: 'force-cache', next: { tags: ['time'] }`)
3. **Case 3**: Revalidate + tags (`next: { tags: ['time'], revalidate: 60 }`)
4. **Case 4**: Default (no options)
5. **Case 5**: No-store + tags (conflicting options)

### Key Components
- **TestPanel**: Unified testing interface for each case with interactive buttons
- **Dashboard**: Real-time comparison of all cases
- **API Routes**: `/api/test/[case]` for server-side fetch testing
- **Server Actions**: `actions.ts` for `revalidateTag` functionality

### Test API
Uses `https://worldtimeapi.org/api/timezone/Asia/Tokyo` which provides timestamps for easy cache validation.

## Implementation Guidelines

### File Structure (from PRD.md)
```
src/app/
├── dashboard/page.tsx          # Main comparison dashboard
├── case[1-5]/page.tsx         # Individual test cases
├── components/TestPanel.tsx   # Reusable test interface
├── actions.ts                 # Server actions for revalidateTag
└── api/
    ├── test/[case]/route.ts   # Case-specific API endpoints
    └── revalidate/route.ts    # Cache revalidation API
```

### Critical Verification Steps
1. Build in production mode (`npm run build`)
2. Check build output for static vs dynamic rendering
3. Run production server (`npm run start`)
4. Test each case with dashboard buttons:
   - 🔄 Page refresh (hard reload)
   - 🔗 Soft navigation (Router cache)
   - 🗑️ RevalidateTag (cache invalidation)
   - 📡 API fetch (Route handler)
5. Compare timestamps to verify cache behavior

### Expected Behavior Patterns
- **Cached cases**: Same Unix timestamp across page refreshes
- **Non-cached cases**: New timestamp on each request
- **RevalidateTag effective**: New data after tag invalidation
- **Conflicting options**: Warnings or no-store takes precedence

## Tech Stack Specifics
- **Next.js 15.5.2** with App Router
- **React 19.1.0** 
- **Turbopack** for builds (faster but verify functionality)
- **Biome** for linting/formatting (not Prettier/ESLint)
- **Tailwind CSS v4**

## Development Notes
- All cache-related testing requires production builds
- Server console logs show `[CaseN] Fetched at ...` for verification
- TestPanel logs provide client-side timestamps
- Build output indicates static (○) vs dynamic (λ) rendering