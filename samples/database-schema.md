# Database Schema

See `prisma/schema.prisma` for the source of truth.

## User
- `id`, `name`, `email` (unique), `passwordHash`, `createdAt`

## Note
- `id`, `noteId` (e.g. NOTE_482910), `title`, `content`, `tags` (JSON string)
- `category`, `archived`, `isPublic`, `shareId`
- `summary`, `actionItems`, `suggestedTitle` (AI fields)
- `userId`, `createdAt`, `updatedAt`

## AiUsageLog
- `id`, `userId`, `noteId`, `feature`, `createdAt`
