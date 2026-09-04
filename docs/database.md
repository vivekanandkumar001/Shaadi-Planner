# Shaadi Planner Database Schema

Designed for PostgreSQL using Prisma ORM.

```
User (1) ───< Wedding (N)
               ├───< Guest (N) ───> TableData (1)
               ├───< TableData (N)
               ├───< Vendor (N)
               ├───< WeddingFunction (N)
               ├───< ChecklistItem (N)
               ├───< ShagunEntry (N)
               ├───< MenuCourse (N) ───< MenuItem (N)
               ├───< Note (N)
               ├───< ShareLink (N)
               └───< ActivityLog (N)
```

## Key Entities & Constraints
- **Financial Precision**: `estimatedBudget`, `quotedAmount`, `paidAmount`, and `shagun.amount` use PostgreSQL `@db.Decimal(12, 2)` to eliminate floating-point calculation errors.
- **User Ownership**: Every table indexes `weddingId` and enforces foreign key cascading deletes on wedding removal.
- **Table Capacity**: Table capacity is validated server-side before attaching `Guest.tableId`.
